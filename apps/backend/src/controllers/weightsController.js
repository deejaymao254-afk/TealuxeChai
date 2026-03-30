import db from "../config/db.js";

export const addWeight = async (req, res) => {
  try {
    const { variation_id, weight, price } = req.body;

    const result = await db.query(
      `INSERT INTO product_weights (variation_id, weight, price)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [variation_id, weight, price]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to add weight" });
  }
};

export const deleteWeight = async (req, res) => {
  try {
    await db.query(
      `DELETE FROM product_weights WHERE id = $1`,
      [req.params.id]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
};