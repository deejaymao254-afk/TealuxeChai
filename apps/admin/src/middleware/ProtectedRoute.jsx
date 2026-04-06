// src/middleware/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // named import works in ESM

export default function ProtectedRoute({ children, user }) {
  const token = localStorage.getItem("duka2_token");

  // If no user prop or no token, redirect to login
  if (!user || !token) return <Navigate to="/" replace />;

  try {
    const decoded = jwtDecode(token);

    // Token expiration check
    if (decoded.exp * 1000 < Date.now()) {
      console.warn("❌ Token expired");
      localStorage.removeItem("duka2_token");
      localStorage.removeItem("duka2_current_user");
      return <Navigate to="/login" replace />;
    }
  } catch (err) {
    console.error("❌ Invalid token", err);
    localStorage.removeItem("duka2_token");
    localStorage.removeItem("duka2_current_user");
    return <Navigate to="/login" replace />;
  }

  // All good → render children
  return children;
}