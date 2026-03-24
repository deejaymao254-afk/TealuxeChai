import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import gsap from "gsap";
import "../App.css";
import "./Dashboard.css";

import saltedImg from "../assets/kripsii-salted.png"; // use only this

const products = [
  {
    id: 1,
    name: "Kripsii",
    category: "Snacks",
    image: saltedImg,
    flavour: "Salted",
    weight: "20g",
    price: 16
  }
];

const categories = ["All", "Snacks"];

export default function Dashboard() {
  const { cart, setCart } = useOutletContext();
  const [darkMode, setDarkMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");

  const [searchTerm, setSearchTerm] = useState("");

  const unitPrice = selectedProduct?.price || 0;
  const totalPrice = unitPrice * quantity * 12; // 12 packs per carton

  useEffect(() => {
    const refreshLayout = () => {
      window.dispatchEvent(new Event("resize"));
    };

    const timer = setTimeout(refreshLayout, 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    gsap.from(".product-card", {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1
    });
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.setAttribute(
      "data-theme",
      !darkMode ? "dark" : "light"
    );
  };

  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((p) =>
      activeCategory === "All" ? true : p.category === activeCategory
    );

  const openProductPopup = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  const confirmAddToCart = () => {
    setCart((prev) => [
      ...prev,
      {
        productId: selectedProduct.id,
        name: selectedProduct.name,
        flavour: selectedProduct.flavour,
        weight: selectedProduct.weight,
        unitPrice,
        quantity,
        total: totalPrice
      }
    ]);

    setSelectedProduct(null);
  };

  return (
    <div className="dashboard-container">
      {/* ORDER HERO */}
      <section className="panel order-now">
        <div className="order-bg">
          <div className="order-overlay"></div>
          <div className="order-content">
            <h2>Order Your Products Fast</h2>
            <p>Get what you need delivered to your shop with just a click.</p>
            <button className="order-btn">
              Order Now
            </button>
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <div className="search-wrapper">
        <input
          type="text"
          placeholder="Search products..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* CATEGORIES */}
      <section className="categories">
        <div className="categories-scroll">
          {categories.map((c, i) => (
            <button
              key={i}
              className={`category-btn ${activeCategory === c ? "active" : ""}`}
              onClick={() => setActiveCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="panel products">
        <h2>Order Now</h2>

        <div className="product-grid">
          {filteredProducts.map((p) => (
            <div key={p.id} className="product-card">
              <img src={p.image} alt={p.name} loading="lazy" />

              <span className="product-name">{p.name}</span>

              <span className="product-price">
                KES {p.price.toLocaleString()} / pack
              </span>

              <button
                className="add-cart"
                onClick={() => openProductPopup(p)}
              >
                Order
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FLOATING CART */}
      {cart.length > 0 && (
        <div className="floating-cart" onClick={() => navigate("/cart")}>
          🛒 {cart.length}
        </div>
      )}

      {/* THEME */}
      <button className="theme-switch" onClick={toggleTheme}>
        {darkMode ? "☀️" : "🌙"}
      </button>

      {/* MODAL */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div
            className="product-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-image-wrapper">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="modal-product-image"
              />
            </div>

            <div className="modal-header-row">
              <h3>{selectedProduct.name}</h3>
            </div>

            {/* FIXED INFO */}
            <div className="modal-section">
              <p><strong>Flavour:</strong> Salted</p>
              <p><strong>Weight:</strong> 20g</p>
              <p><strong>Price per pack:</strong> KES {selectedProduct.price}</p>
              <p><strong>Carton:</strong> 12 packs</p>
            </div>

            {/* QUANTITY */}
            <div className="modal-section">
              <label>Quantity (Cartons)</label>

              <div className="qty-controls">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                  -
                </button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)}>
                  +
                </button>
              </div>

              <div style={{ marginTop: "10px", textAlign: "right" }}>
                <span style={{ fontWeight: 600 }}>
                  Total Packs: {quantity * 12}
                </span>
                <br />
                <span
                  style={{
                    fontWeight: 700,
                    color: "var(--accent-color)"
                  }}
                >
                  Total: KES {totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            <button className="confirm-btn" onClick={confirmAddToCart}>
              Add Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}