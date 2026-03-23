import { pool } from "../config/db.js";
import bcrypt from "bcryptjs";

/* ===================== */
/* GET USER BY PHONE */
/* ===================== */
export async function getUserByPhone(phone) {
  const result = await pool.query(
    "SELECT * FROM users WHERE phone = $1",
    [phone]
  );
  return result.rows[0];
}

/* ===================== */
/* UPDATE USER PIN */
/* ===================== */
export async function updateUserPin(phone, pin) {
  // 🔥 Ensure pin is always hashed before saving
  const hashedPin = pin.startsWith("$2")
    ? pin
    : await bcrypt.hash(pin, 10);

  const result = await pool.query(
    `
    UPDATE users
    SET pin = $1
    WHERE phone = $2
    RETURNING *;
    `,
    [hashedPin, phone]
  );

  return result.rows[0];
}

/* ===================== */
/* UPDATE USER ROLE */
/* ===================== */
export async function updateUserRole(phone, role) {
  const result = await pool.query(
    `
    UPDATE users
    SET role = $1
    WHERE phone = $2
    RETURNING *;
    `,
    [role, phone]
  );

  return result.rows[0];
}

/* ===================== */
/* CREATE USER (AUTO-HASH PIN) */
/* ===================== */
export async function createUser(user) {
  const {
    phone,
    pin,
    firstName,
    lastName,
    idNo,
    shopName,
    shopAddress,
    role = "user",
  } = user;

  // 🔥 ALWAYS hash here (even if already hashed)
  const hashedPin = pin.startsWith("$2")
    ? pin
    : await bcrypt.hash(pin, 10);

  const result = await pool.query(
    `
    INSERT INTO users (
      phone,
      pin,
      first_name,
      last_name,
      id_no,
      shop_name,
      shop_address,
      role
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *;
    `,
    [
      phone,
      hashedPin,
      firstName,
      lastName || null,
      idNo || null,
      shopName || null,
      shopAddress || null,
      role,
    ]
  );

  return result.rows[0];
}