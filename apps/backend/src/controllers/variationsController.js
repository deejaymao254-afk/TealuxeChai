import { pool } from "../config/db.js";

export const addVariation = async (req, res) => {
  try {
    const { product_id, flavour, image_url } = req.body;

    const result = await pool.query(
      `INSERT INTO product_variations (product_id, flavour, image_url)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [product_id, flavour, image_url]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to add variation" });
  }
};

export const deleteVariation = async (req, res) => {
  try {
    await pool.query(
      `DELETE FROM product_variations WHERE id = $1`,
      [req.params.id]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
};

export const updateVariation = async (req, res) => {
  try {
    const { id } = req.params;
    const { flavour } = req.body;

    const updated = await pool.query(
      `UPDATE product_variations
       SET flavour = $1
       WHERE id = $2
       RETURNING *`,
      [flavour, id]
    );

    res.json(updated.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update variation" });
  }
};