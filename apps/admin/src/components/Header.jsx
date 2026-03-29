import { useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "../App.css";
import "./header.css";

export default function Header({ user, toggleSidebar, onLogout }) {
  const location = useLocation();
  const [showNotif, setShowNotif] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const notifRef = useRef(null);
  const menuRef = useRef(null);

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
        return "Duka2";
    }
  };

  // Close notifications on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="app-header">
      <div className="header-left">
        {/* Hamburger for mobile */}
        <button className="menu-toggle" onClick={toggleSidebar}>
          ☰
        </button>

        {/* Duka2 Logo */}
        <h1 className="logo">
          <span className="logo-black">Duka</span>
          <span className="logo-orange">2</span>
        </h1>

        {/* Page title (desktop only) */}
        <h2 className="page-title">{getTitle()}</h2>
      </div>

      <div className="header-right">
        {/* Notification Icon */}
        <div className="notif-wrapper">
          <button className="btn icon" onClick={() => setShowNotif(!showNotif)}>
            🔔
          </button>
          {showNotif && (
            <div className="dropdown" ref={notifRef}>
              <p>No new notifications</p>
            </div>
          )}
        </div>

        {/* Hamburger menu for mobile options */}
        <div className="menu-wrapper" ref={menuRef}>
          <button className="btn icon" onClick={() => setShowMenu(!showMenu)}>
            ⋮
          </button>
          {showMenu && (
            <div className="dropdown menu-dropdown">
              <div className="menu-item user-info">
                <span>{user?.name || "Admin"}</span>
              </div>
              <div className="menu-item logout" onClick={onLogout}>
                Sign Out
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}