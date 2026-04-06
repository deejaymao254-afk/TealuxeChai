import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "duka2_secret";

/* ===================== */
/* GENERATE TOKEN */
/* ===================== */
export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      phone: user.phone,
      role: user.role,
    },
    SECRET,
    {
      expiresIn: "7d",
    }
  );
}

/* ===================== */
/* VERIFY TOKEN */
/* ===================== */
export function verifyToken(token) {
  if (!token) return null;

  // Remove 'Bearer ' if present
  const cleanedToken = token.startsWith("Bearer ")
    ? token.slice(7)
    : token;

  try {
    return jwt.verify(cleanedToken, SECRET);
  } catch (err) {
    console.error("JWT verify error:", err.message);
    return null;
  }
}

/* ===================== */
/* MIDDLEWARE FOR PROTECTED ROUTES */
/* ===================== */
export function authMiddleware(req, res, next) {
  const token = req.headers.authorization;
  const payload = verifyToken(token);

  if (!payload) return res.status(401).json({ error: "Invalid or expired token" });

  req.user = payload;
  next();
}