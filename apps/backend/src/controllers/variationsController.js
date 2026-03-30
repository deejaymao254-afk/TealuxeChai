import db from "../config/db.js";

export const addVariation = async (req, res) => {
  try {
    const { product_id, flavour, image_url } = req.body;

    const result = await db.query(
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
    await db.query(
      `DELETE FROM product_variations WHERE id = $1`,
      [req.params.id]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
};