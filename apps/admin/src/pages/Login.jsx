import { useEffect, useState } from "react";
import "./login.css";

export default function Login({ onLogin }) {
  const [loading, setLoading] = useState(true);
  const [showPin, setShowPin] = useState(false);
  const [form, setForm] = useState({ phone: "", pin: "" });

  /* ===================== */
  /* SPLASH */
  /* ===================== */
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  /* ===================== */
  /* INPUT HANDLER */
  /* ===================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ===================== */
  /* PHONE NORMALIZER */
  /* ===================== */
  const normalizePhone = (phone) => {
    let p = phone.replace(/\D/g, "");
    if (p.startsWith("0")) p = "254" + p.slice(1);
    if (!p.startsWith("254")) p = "254" + p;
    return p;
  };

  /* ===================== */
  /* LOGIN */
  /* ===================== */
  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    const phone = normalizePhone(form.phone);
    const API_URL = import.meta.env.VITE_API_URL;

    try {
      const res = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, pin: form.pin })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("duka2_current_user", JSON.stringify(data.user));
      localStorage.setItem("duka2_token", data.token);

      if (typeof onLogin === "function") onLogin(data.user, data.token);

    } catch (err) {
      console.error("LOGIN ERROR:", err);
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* ===================== */
  /* SPLASH UI */
  /* ===================== */
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

  /* ===================== */
  /* MAIN UI */
  /* ===================== */
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

const API_URL = import.meta.env.VITE_API_URL;
console.log("API URL:", API_URL);