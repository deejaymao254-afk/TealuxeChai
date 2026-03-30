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
  updateVariation
} from "../controllers/variationsController.js";

import {
  updateWeight
} from "../controllers/weightsController.js";

import {
  addWeight,
  deleteWeight
} from "../controllers/weightsController.js";

import { upload } from "../middleware/upload.js";


const router = express.Router();

// PRODUCTS
router.get("/", getFullProducts);
router.post("/", createProduct);
router.put("/:id", upload.single("image"), updateProduct);


// VARIATIONS
router.post("/variation", addVariation);
router.delete("/variation/:id", deleteVariation);
router.put("/variation/:id", updateVariation);


// WEIGHTS
router.post("/weight", addWeight);
router.delete("/weight/:id", deleteWeight);
router.put("/weight/:id", updateWeight);

export default router;