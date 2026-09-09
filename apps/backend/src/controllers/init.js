import { pool } from "../config/db.js";

export async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        phone VARCHAR(20) UNIQUE NOT NULL,
        pin VARCHAR(255) NOT NULL,
        first_name VARCHAR(50),
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log("✅ Database schema ready");
  } catch (err) {
    console.error("❌ DB init error:", err.message);
  }
}