import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Adjust the path to match your project structure
import { supabase } from "../lib/supabase";
import { createClient } from "@supabase/supabase-js"; 
import bcrypt from "bcryptjs";

import "./login.css";

// ----------------------
// Supabase client setup
// ----------------------
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showPin, setShowPin] = useState(false);
  const [form, setForm] = useState({ phone: "", pin: "" });

  // --------------------
  // Splash screen
  // --------------------
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // --------------------
  // Input handler
  // --------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // --------------------
  // Normalize phone
  // --------------------
  const normalizePhone = (phone) => {
    let p = phone.replace(/\D/g, "");
    if (p.startsWith("0")) p = "254" + p.slice(1);
    else if (!p.startsWith("254")) p = "254" + p;
    return p;
  };

  // --------------------
  // Login
  // --------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    const phone = normalizePhone(form.phone);

    try {
      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("phone", phone)
        .in("role", ["admin", "superadmin"]) // allow both admin and superadmin
        .single();

      if (error || !user) throw new Error("Admin not found");

      const validPin = await bcrypt.compare(form.pin, user.pin_hash);
      if (!validPin) throw new Error("Invalid PIN");

      localStorage.setItem("duka2_current_user", JSON.stringify(user));

      if (typeof onLogin === "function") onLogin(user);

      // navigate based on role
      navigate(user.role === "superadmin" ? "/superadmin/dashboard" : "/admin/dashboard");
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // --------------------
  // Splash UI
  // --------------------
  if (loading) {
    return (
      <div className="splash-screen">
        <div className="floating-logo">
          <span>Tealuxe</span>
          <span className="logo-orange">Chai</span>
        </div>
      </div>
    );
  }

  // --------------------
  // Main UI
  // --------------------
  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="app-title">Tealuxe Chai</h1>
        <form onSubmit={handleLogin}>
          <div className="form-row">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <label>PIN</label>
            <div className="pin-field">
              <input
                type={showPin ? "text" : "password"}
                name="pin"
                value={form.pin}
                onChange={handleChange}
                required
              />
              <span className="pin-toggle" onClick={() => setShowPin(!showPin)}>
                {showPin ? "🙈" : "👁"}
              </span>
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <footer className="app-footer">
          <p>Made by ByteForge</p>
          <span>© 2026</span>
        </footer>
      </div>
    </div>
  );
}