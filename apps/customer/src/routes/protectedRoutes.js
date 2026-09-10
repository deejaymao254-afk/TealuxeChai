import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  // Check localStorage for user data (app uses localStorage for auth)
  const user = JSON.parse(localStorage.getItem("duka2_current_user"));

  // If user not logged in, redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // Otherwise render children
  return children;
}