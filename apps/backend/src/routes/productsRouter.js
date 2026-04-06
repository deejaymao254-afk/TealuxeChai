// backend/routes/productsRouter.js
import express from "express";
import { upload } from "../middleware/upload.js";

import {
  getFullProducts,
  createProduct,
  updateProduct
} from "../controllers/productsController.js";

import {
  addVariation,
  deleteVariation,
  updateVariation
} from "../controllers/variationsController.js";

import {
  addWeight,
  deleteWeight,
  updateWeight
} from "../controllers/weightsController.js";

const router = express.Router();

// ==============================
// PRODUCTS
// ==============================
router.get("/", getFullProducts);
router.post("/", createProduct);
router.put("/:id", upload.single("image"), updateProduct);

// ==============================
// VARIATIONS
// ==============================
router.post("/variation", addVariation);
router.delete("/variation/:id", deleteVariation);
router.put("/variation/:id", updateVariation);

// ==============================
// WEIGHTS
// ==============================
router.post("/weight", addWeight);
router.delete("/weight/:id", deleteWeight);
router.put("/weight/:id", updateWeight);

export default router;