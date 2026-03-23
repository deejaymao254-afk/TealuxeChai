import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "duka2_secret";

export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      phone: user.phone,
      role: user.role,
    },
    SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}