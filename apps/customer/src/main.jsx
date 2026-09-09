import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import App from "./App";
import Dashboard from "./pages/Dashboard";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import CRM from "./pages/CRM";
import Analytics from "./pages/Analytics";
import Login from "./pages/login";
import Checkout from "./pages/Checkout";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      {/* Public route */}
      <Route path="/" element={<Login />} />

      {/* Protected App */}
      <Route path="/app" element={<App />}>
        {/* Redirect /app to /app/dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={<Dashboard />} />
        <Route path="orders" element={<Orders />} />
        <Route path="cart" element={<Cart />} />
        <Route path="profile" element={<Profile />} />
        <Route path="crm" element={<CRM />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="checkout" element={<Checkout />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);