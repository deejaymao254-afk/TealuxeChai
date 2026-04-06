import express from "express";
import bcrypt from "bcryptjs";
import cors from "cors";
import { generateToken } from "../controllers/auth.js";
import {
  createUser,
  getUserByPhone,
  getAllUsers,
  getUserStats,
  getUserDetails,
} from "../services/userService.js";

const router = express.Router();

// ====================
// Enable CORS for frontend
// ====================
router.use(
  cors({
    origin: "https://tealuxe-chai-app.vercel.app", // your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

function normalizePhone(phone) {
  let p = phone.replace(/\D/g, "");
  if (p.startsWith("0")) p = "254" + p.slice(1);
  if (!p.startsWith("254")) p = "254" + p;
  return p;
}

// ===== REGISTER =====
router.post("/register", async (req, res) => {
  try {
    let { phone, pin, firstName, lastName, idNo, shopName, shopAddress } =
      req.body;

    if (!phone || !pin || !firstName)
      return res.status(400).json({ message: "Required fields missing" });

    phone = normalizePhone(phone);

    if (pin.length < 4) return res.status(400).json({ message: "PIN too short" });

    const existing = await getUserByPhone(phone);
    if (existing) return res.status(400).json({ message: "User already exists" });

    const user = await createUser({
      phone,
      pin,
      firstName,
      lastName,
      idNo,
      shopName,
      shopAddress,
    });

    const token = generateToken(user);
    const { pin: _, ...safeUser } = user;

    return res.json({ user: safeUser, token, message: "Registered successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Registration failed" });
  }
});

// ===== LOGIN =====
router.post("/login", async (req, res) => {
  try {
    let { phone, pin } = req.body;

    if (!phone || !pin) {
      return res.status(400).json({ message: "Phone and PIN required" });
    }

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

    return res.json({ user: safeUser, token });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Login failed" });
  }
});

// ===== GET ALL USERS =====
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const users = await getAllUsers({ page: Number(page), limit: Number(limit) });
    return res.json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to load customers" });
  }
});

// ===== GET USER STATS =====
router.get("/stats", async (req, res) => {
  try {
    const stats = await getUserStats();
    return res.json(stats);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to load stats" });
  }
});

// ===== GET USER DETAILS =====
router.get("/:id/details", async (req, res) => {
  try {
    const details = await getUserDetails(req.params.id);
    if (!details) return res.status(404).json({ message: "User not found" });
    return res.json(details);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to load user details" });
  }
});

export default router;