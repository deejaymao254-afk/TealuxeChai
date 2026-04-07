// src/pages/Dashboard.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard({ user }) {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Dashboard mounted");
    console.log("User received:", user);

    if (!user) {
      console.warn("No user found, redirecting to login");
      navigate("/login", { replace: true });
    }

    return () => console.log("Dashboard unmounted");
  }, [user, navigate]);

  if (!user) {
    return (
      <div style={{ padding: 40, color: "#ff0000" }}>
        <h2>No user detected. Redirecting...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>Welcome, {user.name || user.phone || "Admin"}!</h1>
      <p>This is your placeholder admin dashboard.</p>

      <div style={{ marginTop: 20, padding: 20, border: "1px solid #ccc" }}>
        <h3>Debug Info</h3>
        <pre>{JSON.stringify(user, null, 2)}</pre>
        <p>LocalStorage token: {localStorage.getItem("duka2_token") || "none"}</p>
        <p>
          Current timestamp: {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
}