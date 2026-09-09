import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function ProtectedRoute({ children }) {
  const user = supabase.auth.user();

  // If user not logged in, redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // Otherwise render children
  return children;
}