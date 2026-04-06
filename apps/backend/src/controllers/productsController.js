// backend/controllers/productsController.js
import { pool } from "../config/db.js";

// ==============================
// GET FULL PRODUCT TREE
// ==============================
export const getFullProducts = async (req, res) => {
  try {
    const products = await pool.query(`
      SELECT 
        p.*,
        v.id AS v_id,
        v.flavour,
        v.image_url,
        w.id AS w_id,
        w.weight,
        w.price
      FROM products p
      LEFT JOIN product_variations v ON v.product_id = p.id
      LEFT JOIN product_weights w ON w.variation_id = v.id
      ORDER BY p.id ASC
    `);

    const map = {};

    for (const row of products.rows) {
      // PRODUCT
      if (!map[row.id]) {
        map[row.id] = {
          id: row.id,
          name: row.name,
          category: row.category,
          active: row.active,
          image: row.image || "", // 👈 ensure image is never null
          variations: []
        };
      }

      // VARIATION
      if (row.v_id) {
        let variation = map[row.id].variations.find(v => v.id === row.v_id);

        if (!variation) {
          variation = {
            id: row.v_id,
            flavour: row.flavour,
            image_url: row.image_url || "",
            weights: []
          };
          map[row.id].variations.push(variation);
        }

        // WEIGHT
        if (row.w_id) {
          variation.weights.push({
            id: row.w_id,
            weight: row.weight,
            price: row.price
          });
        }
      }
    }

    res.json(Object.values(map));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// ==============================
// CREATE PRODUCT
// ==============================
export const createProduct = async (req, res) => {
  try {
    const { name, category } = req.body;

    const newProduct = await pool.query(
      `INSERT INTO products (name, category)
       VALUES ($1, $2)
       RETURNING *`,
      [name, category]
    );

    res.json(newProduct.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create product" });
  }
};

// ==============================
// UPDATE PRODUCT
// ==============================
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, active } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const query = image
      ? `UPDATE products SET name = $1, active = $2, image = $3 WHERE id = $4 RETURNING *`
      : `UPDATE products SET name = $1, active = $2 WHERE id = $3 RETURNING *`;

    const values = image ? [name, active, image, id] : [name, active, id];
    const updated = await pool.query(query, values);

    res.json(updated.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
};