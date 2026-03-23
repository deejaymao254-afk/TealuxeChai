import express from "express";
import { createOrderHandler } from "../orders/orderController.js";

const router = express.Router();

router.post("/", createOrderHandler);

export default router;