// App.jsx
import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard";

// IMPORT ALL PAGES YOUR SIDEBAR LINKS TO
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Settings from "./pages/Settings";

import AppLayout from "./layout/AppLayout";

export default function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("duka2_current_user");
    return stored ? JSON.parse(stored) : null;
  });

  const handleLogin = (userData, token) => {
    localStorage.setItem("duka2_current_user", JSON.stringify(userData));
    localStorage.setItem("duka2_token", token);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("duka2_current_user");
    localStorage.removeItem("duka2_token");
    setUser(null);
  };

  return (
    <Routes>
      {/* LOGIN */}
      <Route
        path="/login"
        element={
          user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />
        }
      />

      {/* APP (WITH LAYOUT) */}
      <Route
        path="/"
        element={
          user ? (
            <AppLayout user={user} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        {/* DEFAULT */}
        <Route index element={<Dashboard />} />

        {/* ADD THESE ROUTES */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="customers" element={<Customers />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}