import express from "express";
import bcrypt from "bcryptjs";
import { getUserByPhone } from "../services/userService.js";
import { generateToken } from "../controllers/auth.js";

const router = express.Router();

function normalizePhone(phone) {
  let p = phone.replace(/\D/g, "");
  if (p.startsWith("0")) p = "254" + p.substring(1);
  if (!p.startsWith("254")) p = "254" + p;
  return p;
}

/* ===================== */
/* LOGIN */
/* ===================== */
router.post("/login", async (req, res) => {
  try {
    let { phone, pin } = req.body;

    if (!phone || !pin) {
      return res.status(400).json({ message: "Phone and PIN required" });
    }

    // ✅ FIX: normalize BEFORE query
    phone = normalizePhone(phone);

    const user = await getUserByPhone(phone);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(pin, user.pin);

    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
    const { pin: _, ...safeUser } = user;

    return res.json({
      user: safeUser,
      token,
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Login failed" });
  }
});

export default router;