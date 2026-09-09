import { verifyToken } from "../controllers/auth.js";

export function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    req.user = decoded;
    next();

  } catch (err) {
    return res.status(401).json({ message: "Invalid token", err });
  }
}