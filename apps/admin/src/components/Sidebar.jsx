import { NavLink } from "react-router-dom";
import "./sidebar.css";

export default function Sidebar() {
  const linkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <aside className="sidebar">


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

        <NavLink to="/inventory" className={linkClass}>
          Inventory
        </NavLink>

        <div className="divider" />

        {/* INSIGHTS */}
        <NavLink to="/analytics" className={linkClass}>
          Analytics
        </NavLink>

        <NavLink to="/settings" className={linkClass}>
          Settings
        </NavLink>

      </nav>
    </aside>
  );
}