import { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import profileIcon from "./assets/profile.png";
import "./App.css";

export default function App() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [cart, setCart] = useState([]);

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("duka2_current_user");

    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser);
    } catch (err) {
      console.error("Invalid user data in storage", err);
      localStorage.removeItem("duka2_current_user");
      return null;
    }
  });

  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  // Prevent dropdown flash
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(timer);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    setOpen(false);

    if (window.confirm("Are you sure you want to sign out?")) {
      localStorage.removeItem("duka2_current_user");
      setUser(null);
      navigate("/");
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo">
          <span className="logo-black">Tealuxe</span>
          <span className="logo-orange">Chai</span>
        </div>

        <div className="profile-wrapper" ref={wrapperRef}>
          <img
            src={profileIcon}
            alt="Profile"
            className="profile-icon"
            onClick={() => setOpen((o) => !o)}
          />

          {mounted && (
            <div
              className={`profile-dropdown ${open ? "open" : "closed"}`}
              style={{
                opacity: open ? 1 : 0,
                transform: open ? "translateY(0)" : "translateY(-10px)",
                transition: "opacity 0.25s ease, transform 0.25s ease",
              }}
            >
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/profile");
                }}
              >
                My Profile
              </button>

              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/orders");
                }}
              >
                Orders
              </button>

              <button className="logout" onClick={handleSignOut}>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="page-content">
        <Outlet context={{ cart, setCart, user }} />
      </main>

      <BottomNav cartCount={cart.length} />
    </div>
  );
}