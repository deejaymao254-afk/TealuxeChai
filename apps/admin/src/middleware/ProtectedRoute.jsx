import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, user }) {
  const token = localStorage.getItem("duka2_token");

  if (!user || !token) return <Navigate to="/login" replace />;

  // Placeholder: no JWT decoding yet
  return children;
}