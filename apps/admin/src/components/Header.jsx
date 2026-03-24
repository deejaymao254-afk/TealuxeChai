import { useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function Header({ user, onLogout }) {
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
      default:
        return "Admin Panel";
    }
  };

  // Close dropdown when clicking outside
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
        <h2>{getTitle()}</h2>
      </div>

      <div className="header-right">
        {/* Notifications */}
        <div className="notif-wrapper" ref={notifRef}>
          <button
            className="btn icon"
            onClick={() => setShowNotif(!showNotif)}
            aria-label="Notifications"
          >
            🔔
          </button>

          {showNotif && (
            <div className="dropdown">
              <p>No new notifications</p>
            </div>
          )}
        </div>

        {/* User */}
        <div className="user-info">
          <span className="user-name">{user?.name || "Admin"}</span>
        </div>

        {/* Logout */}
        <button className="btn danger" onClick={onLogout}>
          Sign Out
        </button>
      </div>
    </header>
  );
}