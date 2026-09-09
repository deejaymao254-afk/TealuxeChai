import express from "express";
import { getAllUsers } from "../services/userService.js";
import { pool } from "../routes/usersRouter.js";

const router = express.Router();

// =======================
// GET ALL USERS
// =======================
router.get("/users", async (req, res) => {
  try {
    const users = await getAllUsers();

    const safe = users.map(u => ({
      id: u.id,
      phone: u.phone,
      firstName: u.first_name,
      lastName: u.last_name,
      shopName: u.shop_name,
      role: u.role,
      createdAt: u.created_at
    }));

    res.json({ users: safe });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =======================
// GET ALL ORDERS
// =======================
router.get("/orders", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT o.*, u.phone, u.shop_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);

    res.json({ orders: result.rows });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =======================
// PRODUCTS
// =======================

// GET
router.get("/products", async (req, res) => {
  const result = await pool.query("SELECT * FROM products ORDER BY id DESC");
  res.json({ products: result.rows });
});

// CREATE
router.post("/products", async (req, res) => {
  const { name, category, image_url, variations } = req.body;

  const result = await pool.query(
    `INSERT INTO products (name, category, image_url, variations)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [name, category, image_url, variations]
  );

  res.json({ product: result.rows[0] });
});

// UPDATE
router.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, category, image_url, variations } = req.body;

  const result = await pool.query(
    `UPDATE products
     SET name=$1, category=$2, image_url=$3, variations=$4, updated_at=NOW()
     WHERE id=$5 RETURNING *`,
    [name, category, image_url, variations, id]
  );

  res.json({ product: result.rows[0] });
});

// DELETE
router.delete("/products/:id", async (req, res) => {
  await pool.query("DELETE FROM products WHERE id=$1", [req.params.id]);
  res.json({ message: "Deleted" });
});

export default router;