import express from "express";
import bcrypt from "bcryptjs";
import pool from "../config/db.js";
import { generateToken } from "../controllers/auth.js";
import { createUser, getUserByPhone } from "../services/userService.js";

const router = express.Router();

/* ===================== */
/* HELPERS */
/* ===================== */
function normalizePhone(phone) {
  let p = phone.replace(/\D/g, "");

  if (p.startsWith("0")) p = "254" + p.substring(1);
  if (!p.startsWith("254")) p = "254" + p;

  return p;
}

/* ===================== */
/* REGISTER */
/* ===================== */
router.post("/register", async (req, res) => {
  try {
    let {
      phone,
      pin,
      firstName,
      lastName,
      idNo,
      shopName,
      shopAddress,
    } = req.body;

    phone = normalizePhone(phone);

    if (!phone || !pin || !firstName) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    if (pin.length < 4) {
      return res.status(400).json({ message: "PIN too short" });
    }

    const existing = await getUserByPhone(phone);

    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await createUser({
      phone,
      pin,
      firstName,
      lastName,
      idNo,
      shopName,
      shopAddress,
    });

    const token = generateToken(user);

    const { pin: _, ...safeUser } = user;

    return res.json({
      user: safeUser,
      token,
      message: "Registered successfully",
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Registration failed" });
  }
});

/* ===================== */
/* LOGIN */
/* ===================== */
router.post("/login", async (req, res) => {
  try {
    let { phone, pin } = req.body;

    if (!phone || !pin) {
      return res.status(400).json({ message: "Phone and PIN required" });
    }

    phone = normalizePhone(phone);

    const user = await getUserByPhone(phone);

    if (!user || !user.pin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(pin, user.pin);

    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    const { pin: _, ...safeUser } = user;

    return res.json({
      user: safeUser,
      token,
      message: "Login successful",
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Login failed" });
  }
});

/* ===================== */
/* GET USERS (PAGINATED + TOTALS) */
/* ===================== */
/* FILE: src/routes/usersRouter.js */
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit || 20);
    const offset = (page - 1) * limit;

    // Get total users count
    const totalResult = await pool.query(`SELECT COUNT(*) FROM users`);
    const total = parseInt(totalResult.rows[0].count);

    // Get paginated users with order stats
    const result = await pool.query(
      `
      SELECT 
        u.id,
        u.phone,
        u.first_name,
        u.last_name,
        u.shop_name,
        u.shop_address,
        u.role,
        u.created_at,
        u.updated_at,
        COUNT(o.id) AS total_orders,
        COALESCE(SUM(o.amount), 0) AS total_spent
      FROM users u
      LEFT JOIN orders o ON o.user_id = u.id
      GROUP BY u.id
      ORDER BY u.created_at DESC
      LIMIT $1 OFFSET $2
      `,
      [limit, offset]
    );

    return res.json({
      data: result.rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (err) {
    console.error("GET USERS ERROR:", err);
    return res.status(500).json({ message: "Failed to fetch users" });
  }
});

/* ===================== */
/* USER DETAILS (FULL) */
/* ===================== */
/* FILE: src/routes/usersRouter.js */
router.get("/:id/details", async (req, res) => {
  try {
    const { id } = req.params;

    const userRes = await pool.query(
      `SELECT * FROM users WHERE id = $1`,
      [id]
    );

    const user = userRes.rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const ordersRes = await pool.query(
      `
      SELECT id, amount, status, created_at
      FROM orders
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [id]
    );

    const orders = ordersRes.rows;

    const total_spent = orders.reduce(
      (sum, o) => sum + Number(o.amount || 0),
      0
    );

    const avg_order = orders.length
      ? total_spent / orders.length
      : 0;

    const last_order = orders[0]?.created_at || null;

    return res.json({
      ...user,
      total_spent,
      avg_order,
      last_order,
      orders,
    });

  } catch (err) {
    console.error("USER DETAILS ERROR:", err);
    return res.status(500).json({ message: "Failed to fetch user details" });
  }
});

/* ===================== */
/* STATS */
/* ===================== */
/* FILE: src/routes/usersRouter.js */
router.get("/stats", async (req, res) => {
  try {
    const totalRes = await pool.query(`SELECT COUNT(*) FROM users`);

    const activeRes = await pool.query(`
      SELECT COUNT(DISTINCT user_id) 
      FROM orders
    `);

    const topRes = await pool.query(`
      SELECT 
        u.id,
        u.first_name,
        SUM(o.amount) AS total_spent
      FROM users u
      LEFT JOIN orders o ON o.user_id = u.id
      GROUP BY u.id
      ORDER BY total_spent DESC
      LIMIT 1
    `);

    return res.json({
      total: parseInt(totalRes.rows[0].count),
      active: parseInt(activeRes.rows[0].count || 0),
      new: 0, // can be upgraded later
      top_spender: topRes.rows[0]?.total_spent || 0,
    });

  } catch (err) {
    console.error("STATS ERROR:", err);
    return res.status(500).json({ message: "Failed to fetch stats" });
  }
});

export default router;