import { NavLink } from "react-router-dom";
import "./sidebar.css";

export default function Sidebar() {
  const linkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <aside className="sidebar">

      {/* LOGO */}
      <div className="logo">
        Duka<span>2</span>
      </div>

      {/* NAV */}
      <nav>

        {/* MAIN */}
        <NavLink to="/" end className={linkClass}>
          Overview
        </NavLink>

        <NavLink to="/orders" className={linkClass}>
          Orders
        </NavLink>

        <NavLink to="/products" className={linkClass}>
          Products
        </NavLink>

        <NavLink to="/customers" className={linkClass}>
          Customers
        </NavLink>

        <NavLink to="/transactions" className={linkClass}>
          Transactions
        </NavLink>

        <div className="divider" />

        {/* OPERATIONS */}
        <NavLink to="/live-feed" className={linkClass}>
          Live Feed
        </NavLink>

        <NavLink to="/dispatch" className={linkClass}>
          Dispatch
        </NavLink>

        <NavLink to="/inventory" className={linkClass}>
          Inventory
        </NavLink>

        <div className="divider" />

        {/* INSIGHTS */}
        <NavLink to="/analytics" className={linkClass}>
          Analytics
        </NavLink>

        <NavLink to="/reports" className={linkClass}>
          Reports
        </NavLink>

        <div className="divider" />

        {/* SYSTEM */}
        <NavLink to="/network" className={linkClass}>
          Network
        </NavLink>

        <NavLink to="/alerts" className={linkClass}>
          Alerts
        </NavLink>

        <NavLink to="/settings" className={linkClass}>
          Settings
        </NavLink>

      </nav>
    </aside>
  );
}