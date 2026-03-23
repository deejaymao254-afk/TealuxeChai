import express from "express";
import bcrypt from "bcryptjs";
import { generateToken } from "../controllers/auth.js";
import { createUser, getUserByPhone } from "../services/userService.js";

const router = express.Router();

/* ===================== */
/* HELPERS */
/* ===================== */
function normalizePhone(phone) {
  let p = phone.replace(/\D/g, "");

  if (p.startsWith("0")) p = "254" + p.substring(1);
  if (!p.startsWith("254")) p = "254" + p;

  return p;
}

/* ===================== */
/* REGISTER */
/* ===================== */
router.post("/register", async (req, res) => {
  try {
    let { phone, pin, firstName, lastName, idNo, shopName, shopAddress } = req.body;

    phone = normalizePhone(phone);

    if (!phone || !pin || !firstName) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    if (pin.length < 4) {
      return res.status(400).json({ message: "PIN too short" });
    }

    const existing = await getUserByPhone(phone);

    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await createUser({
      phone,
      pin,
      firstName,
      lastName,
      idNo,
      shopName,
      shopAddress,
    });

    console.log("USER DATA:", user);

    const token = generateToken(user);

    const { pin: _, ...safeUser } = user;

    return res.json({
      user: safeUser,
      token,
      message: "Registered successfully",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
});

/* ===================== */
/* LOGIN */
/* ===================== */

router.post("/login", async (req, res) => {
  try {
    let { phone, pin } = req.body;

    // 1. Validate input
    if (!phone || !pin) {
      return res.status(400).json({ message: "Phone and PIN required" });
    }

    // 2. Normalize
    phone = normalizePhone(phone);

    // 3. Get user
    const user = await getUserByPhone(phone);

    if (!user || !user.pin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 4. Check password
    const valid = await bcrypt.compare(pin, user.pin);

    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 5. Success
    const token = generateToken(user);

const { pin: _, ...safeUser } = user;

return res.json({
  user: safeUser,
  token,
  message: "Login successful",
});

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Login failed" });
  }
});

export default router;