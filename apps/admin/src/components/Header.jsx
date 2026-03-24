import { useLocation } from "react-router-dom";
import { useState } from "react";

export default function Header({ user, onLogout }) {
  const location = useLocation();
  const [showNotif, setShowNotif] = useState(false);

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

  return (
    <header className="app-header">
      <div className="left">
        <h2>{getTitle()}</h2>
      </div>

      <div className="right">
        <button
          className="icon-btn"
          onClick={() => setShowNotif(!showNotif)}
        >
          🔔
        </button>

        {showNotif && (
          <div className="dropdown">
            <p>No new notifications</p>
          </div>
        )}

        <span className="user">
          {user?.name || "Admin"}
        </span>

        <button className="logout-btn" onClick={onLogout}>
          Sign Out
        </button>
      </div>
    </header>
  );
}