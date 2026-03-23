import { useNavigate, useLocation } from "react-router-dom";
import "../App.css";

export default function BottomNav({ cartCount }) {
  const navigate = useNavigate();
  const location = useLocation();

  const goHome = () => navigate("/dashboard");
  const goOrders = () => navigate("/orders");
  const goCart = () => navigate("/cart");
  const goProfile = () => navigate("/profile");

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bottom-nav">

      <button
        onClick={goHome}
        className={`bottom-nav__item ${isActive("/dashboard") ? "bottom-nav__item--active" : ""}`}
      >
        <p>Shop</p>
      </button>

      <button
        onClick={goOrders}
        className={`bottom-nav__item ${isActive("/orders") ? "bottom-nav__item--active" : ""}`}
      >
        <p>My Orders</p>
      </button>

      <button
        onClick={goCart}
        className={`bottom-nav__item ${isActive("/cart") ? "bottom-nav__item--active" : ""}`}
      >
        <span className="bottom-nav__icon">
          {cartCount > 0 && (
            <span className="bottom-nav__badge">{cartCount}</span>
          )}
        </span>
        <p>Cart</p> 
        
      </button>

      <button
        onClick={goProfile}
        className={`bottom-nav__item ${isActive("/profile") ? "bottom-nav__item--active" : ""}`}
      >
        <p>Profile</p>
      </button>

    </nav>
  );
}