
import express from "express";
import pool from "../config/db.js"; // your pg pool

const router = express.Router();

/**
 * GET PRODUCTS (PUBLIC / APP)
 * returns structure matching your frontend
 */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id AS product_id,
        p.name,
        p.category,
        p.units_per_carton,

        v.id AS variation_id,
        v.flavour,
        v.image_url,

        w.id AS weight_id,
        w.weight,
        w.price

      FROM products p
      LEFT JOIN product_variations v ON v.product_id = p.id
      LEFT JOIN product_weights w ON w.variation_id = v.id
      WHERE p.active = TRUE
      ORDER BY p.id, v.id, w.id
    `);

    // Transform into your frontend structure
    const productsMap = {};

    result.rows.forEach(row => {
      if (!productsMap[row.product_id]) {
        productsMap[row.product_id] = {
          id: row.product_id,
          name: row.name,
          category: row.category,
          units_per_carton: row.units_per_carton,
          variations: []
        };
      }

      const product = productsMap[row.product_id];

      let variation = product.variations.find(v => v.id === row.variation_id);

      if (!variation && row.variation_id) {
        variation = {
          id: row.variation_id,
          flavour: row.flavour,
          image: row.image_url,
          weights: []
        };
        product.variations.push(variation);
      }

      if (variation && row.weight_id) {
        variation.weights.push({
          id: row.weight_id,
          weight: row.weight,
          price: Number(row.price)
        });
      }
    });

    res.json(Object.values(productsMap));

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

export default router;