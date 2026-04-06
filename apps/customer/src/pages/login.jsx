import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

import "./login.css";

export default function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("login");
  const [showPin, setShowPin] = useState(false);

  const [form, setForm] = useState({
    phone: "",
    pin: "",
    firstName: "",
    lastName: "",
    idNo: "",
    shopName: "",
    shopAddress: "",
    confirmPin: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
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
    if (typeof window === "undefined") return; 
    setLoading(true);

    try {
      const phone = normalizePhone(form.phone);

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("phone", phone)
        .single();

      if (error || !data) throw new Error("User not found");
      if (data.password_hash !== form.pin) throw new Error("Invalid PIN");

      localStorage.setItem("duka2_current_user", JSON.stringify(data));
      navigate("/app/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (typeof window === "undefined") return;

    if (form.pin !== form.confirmPin) {
      alert("PINs do not match");
      return;
    }

    setLoading(true);
    try {
      const phone = normalizePhone(form.phone);

      // Check if user exists
      const { data: existing, error: checkError } = await supabase
        .from("users")
        .select("id")
        .eq("phone", phone)
        .single();

      if (checkError && checkError.code !== "PGRST116") throw checkError;
      if (existing) throw new Error("User already exists");

      // Register user in Supabase Auth
      const { error } = await supabase.auth.signUp({
        email: `${phone}@duka2.local`,
        password: form.pin,
        options: {
          data: {
            phone,
            full_name: `${form.firstName} ${form.lastName}`,
            id_no: form.idNo,
            shop_name: form.shopName,
            shop_address: form.shopAddress,
            role: "user",
          },
        },
      });

      if (error) throw error;

      alert("Registered successfully");
      setMode("login");
    } catch (err) {
      console.error(err);
      alert(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="app-title">Tealuxe</h1>

        {mode === "login" && (
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

            <div className="pin-field">
              <input
                type={showPin ? "text" : "password"}
                name="pin"
                maxLength="4"
                placeholder="4-digit PIN"
                value={form.pin}
                onChange={handleChange}
                required
              />
              <span
                className="pin-toggle"
                onClick={() => setShowPin(!showPin)}
              >
                {showPin ? "🙈" : "👁"}
              </span>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <div className="auth-links">
              <span onClick={() => setMode("register")}>Create account</span>
            </div>
          </form>
        )}

        {mode === "register" && (
          <form onSubmit={handleRegister}>
            <div className="form-row">
              <label>First Name</label>
              <input name="firstName" onChange={handleChange} required />
            </div>

            <div className="form-row">
              <label>Last Name</label>
              <input name="lastName" onChange={handleChange} />
            </div>

            <div className="form-row">
              <label>ID Number</label>
              <input name="idNo" onChange={handleChange} required />
            </div>

            <div className="form-row">
              <label>Phone</label>
              <input name="phone" onChange={handleChange} required />
            </div>

            <div className="form-row">
              <label>Shop Name</label>
              <input name="shopName" onChange={handleChange} />
            </div>

            <div className="form-row">
              <label>Shop Address</label>
              <input name="shopAddress" onChange={handleChange} />
            </div>

            <div className="form-row">
              <label>PIN</label>
              <div className="pin-field">
                <input
                  type={showPin ? "text" : "password"}
                  name="pin"
                  maxLength="4"
                  value={form.pin}
                  onChange={handleChange}
                  required
                />
                <span
                  className="pin-toggle"
                  onClick={() => setShowPin(!showPin)}
                >
                  {showPin ? "🙈" : "👁"}
                </span>
              </div>
            </div>

            <div className="form-row">
              <label>Confirm PIN</label>
              <input
                type="password"
                name="confirmPin"
                maxLength="4"
                value={form.confirmPin}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Creating..." : "Register"}
            </button>

            <div className="auth-links">
              <span onClick={() => setMode("login")}>Back to Sign In</span>
            </div>
          </form>
        )}

        <footer className="app-footer">
          <p>Made by ByteForge</p>
          <span>© 2026</span>
        </footer>
      </div>
    </div>
  );
}