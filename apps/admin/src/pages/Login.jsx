import { supabaseAdmin } from "../lib/supabaseAdmin";
import bcrypt from "bcryptjs";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showPin, setShowPin] = useState(false);
  const [form, setForm] = useState({ phone: "", pin: "" });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const normalizePhone = (phone) => {
    let p = phone.replace(/\D/g, "");
    if (p.startsWith("0")) p = "254" + p.slice(1);
    else if (!p.startsWith("254")) p = "254" + p;
    return p;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const phone = normalizePhone(form.phone);

      const { data: user, error } = await supabaseAdmin
        .from("users")
        .select("*")
        .eq("phone", phone)
        .eq("role", "admin")
        .single();

      if (error || !user) throw new Error("Admin not found");

      const validPin = await bcrypt.compare(form.pin, user.pin_hash);
      if (!validPin) throw new Error("Invalid PIN");

      localStorage.setItem("duka2_current_user", JSON.stringify(user));
      if (onLogin) onLogin(user);

      navigate("/admin/dashboard");
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="splash-screen">
      <div className="floating-logo">
        <span>Tealuxe</span>
        <span className="logo-orange">Chai</span>
      </div>
    </div>
  );

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="app-title">Tealuxe Chai</h1>
        <form onSubmit={handleLogin}>
          <div className="form-row">
            <label>Phone</label>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <label>PIN</label>
            <div className="pin-field">
              <input type={showPin ? "text" : "password"} name="pin" value={form.pin} onChange={handleChange} required />
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