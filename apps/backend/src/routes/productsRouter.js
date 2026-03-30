import express from "express";
import {
  getFullProducts,
  createProduct,
  updateProduct
} from "../controllers/productsController.js";

import {
  addVariation,
  deleteVariation
} from "../controllers/variationsController.js";

import {
  addWeight,
  deleteWeight
} from "../controllers/weightsController.js";

const router = express.Router();

// PRODUCTS
router.get("/full", getFullProducts);
router.post("/", createProduct);
router.put("/:id", updateProduct);

// VARIATIONS
router.post("/variation", addVariation);
router.delete("/variation/:id", deleteVariation);

// WEIGHTS
router.post("/weight", addWeight);
router.delete("/weight/:id", deleteWeight);

export default router;