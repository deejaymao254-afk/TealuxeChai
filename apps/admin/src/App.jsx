// App.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AppLayout from "./layout/AppLayout";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard";

import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
import Transactions from "./pages/Transactions";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Inventory from "./pages/Inventory";

import ProtectedRoute from "./middleware/ProtectedRoute";

import "./App.css";

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

  const handleLogout = useCallback(() => {
    localStorage.removeItem("duka2_current_user");
    localStorage.removeItem("duka2_token");
    setUser(null);
  }, []);

  // ===================== IDLE TIMER =====================
  const timeoutRef = useRef(null);
  const IDLE_TIME = 10 * 60 * 1000; // 10 minutes

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      handleLogout();
      // Use safe alert + navigation
      setTimeout(() => alert("Session expired. Please log in again."), 50);
    }, IDLE_TIME);
  }, [handleLogout]);

  useEffect(() => {
    if (!user) return;

    const events = ["mousemove", "keydown", "click", "scroll"];
    const handleActivity = () => resetTimer();

    events.forEach((event) => window.addEventListener(event, handleActivity));
    resetTimer();

    return () => {
      events.forEach((event) => window.removeEventListener(event, handleActivity));
      clearTimeout(timeoutRef.current);
    };
  }, [user, resetTimer]);

  // ===================== ROUTES =====================
  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />}
      />

      <Route
        path="/"
        element={
          <ProtectedRoute user={user}>
            <AppLayout user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard user={user} />} />
        <Route path="orders" element={<Orders />} />
        <Route path="products" element={<Products />} />
        <Route path="customers" element={<Customers />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}