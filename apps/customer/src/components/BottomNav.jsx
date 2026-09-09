import { useNavigate, useLocation } from "react-router-dom";
import "../App.css";

export default function BottomNav({ cartCount, isAuthenticated }) {
  const navigate = useNavigate();
  const location = useLocation();

  const goTo = (path, requiresAuth = false) => {
    if (requiresAuth && !isAuthenticated) {
      navigate("/");
    } else {
      // Prefix with /app
      const fullPath = path.startsWith("/app") ? path : `/app${path}`;
      if (location.pathname !== fullPath) navigate(fullPath);
    }
  };

  const isActive = (path) => location.pathname === `/app${path}`;

  return (
    <nav className="bottom-nav">
      <button
        onClick={() => goTo("/dashboard")}
        className={`bottom-nav__item ${isActive("/dashboard") ? "bottom-nav__item--active" : ""}`}
      >
        <p>Shop</p>
      </button>

      <button
        onClick={() => goTo("/orders", true)}
        className={`bottom-nav__item ${isActive("/orders") ? "bottom-nav__item--active" : ""}`}
      >
        <p>My Orders</p>
      </button>

      <button
        onClick={() => goTo("/cart")}
        className={`bottom-nav__item ${isActive("/cart") ? "bottom-nav__item--active" : ""}`}
      >
        <span className="bottom-nav__icon">
          {cartCount > 0 && <span className="bottom-nav__badge">{cartCount}</span>}
        </span>
        <p>Cart</p>
      </button>

      <button
        onClick={() => goTo("/profile", true)}
        className={`bottom-nav__item ${isActive("/profile") ? "bottom-nav__item--active" : ""}`}
      >
        <p>Profile</p>
      </button>
    </nav>
  );
}