import { pool } from "../config/db.js";
import bcrypt from "bcryptjs";

async function seedAdmin() {
  const phone = "0700000001";
  const pin = "1234";

  const hashedPin = await bcrypt.hash(pin, 10);

  await pool.query(
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
    ON CONFLICT (phone) DO NOTHING;
    `,
    [
      phone,
      hashedPin,
      "Admin",
      "User",
      "00000000",
      "Main Shop",
      "Nairobi",
      "admin",
    ]
  );

  console.log("✅ Admin seeded successfully");
  process.exit();
}

seedAdmin().catch((err) => {
  console.error("❌ Seed error:", err);
  process.exit(1);
});