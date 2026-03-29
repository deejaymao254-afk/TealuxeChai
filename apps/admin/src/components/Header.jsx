import { useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "../App.css";
import "./header.css";

export default function Header({ user, onLogout, toggleSidebar }) {
  const location = useLocation();
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef(null);

  const getTitle = () => {
    switch (location.pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/orders":
        return "Orders";
      case "/customers":
        return "Customers";
      case "/products":
        return "Products";
      case "/analytics":
        return "Analytics";
      case "/settings":
        return "Settings";
      default:
        return "Admin Panel";
    }
  };

  // Close notifications on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="app-header">
      <div className="header-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          ☰
        </button>
        <h2 className="page-title">{getTitle()}</h2>
      </div>

      <div className="header-right">
        <div className="header-actions">
          <button
            className="btn icon"
            onClick={() => setShowNotif((prev) => !prev)}
          >
            🔔
          </button>

          {showNotif && (
            <div className="dropdown" ref={notifRef}>
              <p>No new notifications</p>
            </div>
          )}

          <button className="btn danger" onClick={onLogout}>
            Sign Out
          </button>
        </div>

        <div className="user-info">
          <span className="user-name">{user?.name || "Admin"}</span>
          <span className="user-role">Preview</span>
        </div>
      </div>
    </header>
  );
}