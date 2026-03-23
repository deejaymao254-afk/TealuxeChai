import { createOrder } from "./orderService.js";

export async function createOrderHandler(req, res) {
  try {
    const { userId, items, amount } = req.body;

    const order = await createOrder(userId, items, amount);

    res.json(order);
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ error: err.message });
  }
}