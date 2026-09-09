import { useNavigate, useOutletContext } from "react-router-dom";
import { useState } from "react";
import "./Profile.css";

export default function Profile() {
  const { setCart } = useOutletContext(); // optional if you want to clear cart on sign out
  const navigate = useNavigate();
  const [username] = useState("User"); // placeholder, could be dynamic

  const handleSignOut = () => {
    // clear user session / cart if needed
    setCart([]); 
    navigate("/"); // redirect to home/login
  };

  return (
    <div className="profile-page">
      <header className="profile-header">
        <h1>Welcome, {username}</h1>
        <p>Manage your account and preferences</p>
      </header>

      <section className="profile-links">
        <button onClick={() => navigate("/settings")}>Settings</button>
        <button onClick={() => navigate("/analytics")}>Analytics</button>
        <button onClick={() => navigate("/orders")}>Orders</button>
        <button onClick={() => navigate("/wishlist")}>Wishlist</button>
        <button className="signout-btn" onClick={handleSignOut}>
          Sign Out
        </button>
      </section>
    </div>
  );
}
