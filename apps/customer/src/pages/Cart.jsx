import { useNavigate, useOutletContext } from "react-router-dom";
import "./Cart.css";

export default function Cart() {
  const navigate = useNavigate();
  const context = useOutletContext() || {};
  const cart = Array.isArray(context.cart) ? context.cart : [];
  const setCart = context.setCart || (() => {}); // fallback if context not provided

  // Ensure each cart item has a unique id
  const updateQuantity = (index, change) => {
    const updated = [...cart];
    updated[index] = {
      ...updated[index],
      quantity: Math.max(1, (updated[index].quantity || 1) + change)
    };
    setCart(updated);
  };

  const removeItem = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity * 48,
    0
  );
  const deliveryFee = cart.length > 0 ? 150 : 0;
  const total = subtotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="cart-container">
        <h1>Your Cart</h1>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>

      {cart.map((item, index) => (
        <div key={index} className="cart-item">
          <div className="cart-details">
            <h3>{item.name}</h3>
            <p>Flavour: {item.flavour}</p>
            <p>Weight: {item.weight}</p>

            <div className="quantity-control">
              <button onClick={() => updateQuantity(index, -1)}>-</button>
              <span>{item.quantity || 1}</span>
              <button onClick={() => updateQuantity(index, 1)}>+</button>
            </div>

            <button className="remove-btn" onClick={() => removeItem(index)}>
              Remove
            </button>
          </div>

          <div className="item-total">
            KES {(item.unitPrice * item.quantity * 48).toLocaleString()}
          </div>
        </div>
      ))}

      <div className="cart-summary">
        <div className="summary-row">
          <span>Subtotal</span>
          <span>KES {subtotal.toLocaleString()}</span>
        </div>

        <div className="summary-row">
          <span>Delivery</span>
          <span>KES {deliveryFee.toLocaleString()}</span>
        </div>

        <div className="summary-row total">
          <span>Total</span>
          <span>KES {total.toLocaleString()}</span>
        </div>

        <button
          className="checkout-btn"
          onClick={() => navigate("/checkout")}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}