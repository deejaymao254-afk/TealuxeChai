import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { lipaNaMpesaOnline } from "../services/MpesaStkService";
import { MpesaConfig } from "../services/mpesaConfig";
import "./Checkout.css";

export default function Checkout() {
  const navigate = useNavigate();
  const context = useOutletContext();
  const cart = Array.isArray(context?.cart) ? context.cart : [];
  const stableContext = useMemo(() => context || {}, [context]);

  const [popup, setPopup] = useState(null);
  const [orderRef, setOrderRef] = useState(null);
  const [polling, setPolling] = useState(false);
  const intervalRef = useRef(null); // to store interval id

  const currentUser = JSON.parse(localStorage.getItem("duka2_current_user")) || {};
  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity * 48, 0);
  const deliveryFee = 150;
  const total = subtotal + deliveryFee;

  const logEvent = async (level, message, data = null) => {
    try {
      await fetch(`${MpesaConfig.backendUrl}/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level, message, data }),
      });
    } catch (err) {
      console.log(`[Logger fallback] ${level}: ${message}`, data, err);
    }
  };

  const handleConfirmOrder = async () => {
    try {
      setPopup({
        icon: "$",
        title: "M-PESA Payment",
        message: "Sending payment request to your phone...",
        type: "info",
      });

      let phone = currentUser.phone || "";
      if (phone.startsWith("07")) phone = "254" + phone.slice(1);
      else if (phone.startsWith("+")) phone = phone.replace("+", "");

// 1. Create order FIRST
const orderRes = await fetch(`${MpesaConfig.backendUrl}/api/orders`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    userId: currentUser.id,
    items: cart,
    amount: total
  })
});

const order = await orderRes.json();

// 2. Then trigger payment
const stk = await lipaNaMpesaOnline(phone, total, order.id);

// 3. Save reference
setOrderRef(stk.CheckoutRequestID);


      setPopup({
        icon: "...",
        title: "Waiting for Payment",
        message: "Check your phone and enter your M-PESA PIN...",
        type: "info",
      });

      setPolling(true);
    } catch (error) {
      console.error("[ERROR] STK Push:", error);
      await logEvent("error", "M-PESA STK Push Failed", error.message || error);

      setPopup({
        icon: ":(",
        title: "Payment Unsuccessful",
        message: "Please try again.",
        type: "error",
      });

      setTimeout(() => setPopup(null), 4000);
    }
  };

  useEffect(() => {
    if (!orderRef || !polling) return;

    intervalRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${MpesaConfig.backendUrl}/orders/${orderRef}`);
        const data = await res.json();

        if (data.status === "SUCCESS") {
          setPopup({
            icon: ":)",
            title: "ASANTE!",
            message: data.message || "Your order is being processed!",
            type: "success",
          });

          await logEvent("info", "Order successful", { orderRef, data });

          setTimeout(() => {
            stableContext.setCart?.([]);
            setPopup(null);
            setPolling(false);
            navigate("/signin", { replace: true });
          }, 4000);

          clearInterval(intervalRef.current);

        } else if (data.status === "FAILED" || data.status === "CANCELLED") {
          setPopup({
            icon: ":(",
            title: "Payment Unsuccessful",
            message: data.message || "Payment could not be completed. Please try again.",
            type: "error",
          });

          await logEvent("error", "Order failed/cancelled", { orderRef, data });

          setTimeout(() => {
            setPopup(null);
            setPolling(false);
          }, 4000);

          clearInterval(intervalRef.current);

        } else if (data.status === "PENDING") {
          // Only update "waiting" popup if no popup is showing to avoid flicker
          setPopup((prev) => prev?.type === "info" ? prev : {
            icon: "...",
            title: "Waiting for Payment",
            message: "Please complete the payment on your phone...",
            type: "info",
          });

          await logEvent("info", "Order pending", { orderRef });
        }
      } catch (err) {
        console.error("[ERROR] Order status poll:", err);
        await logEvent("error", "Order status poll error", {
          orderRef,
          error: err.message || err,
        });
      }
    }, 5000);

    return () => clearInterval(intervalRef.current);
  }, [orderRef, polling, stableContext, navigate]);

  return (
    <div className="checkout-container">
      <h1>Confirm Your Order</h1>

      {cart.length === 0 ? (
        <h2>Your cart is empty.</h2>
      ) : (
        <div className="checkout-summary">
          <h3>Order Details</h3>

          {cart.map((item) => (
            <div key={item.id} className="checkout-item">
              <span>{item.name} ({item.flavour})</span>
              <span>Qty: {item.quantity} cartons</span>
              <span>KES {(item.unitPrice * item.quantity * 48).toLocaleString()}</span>
            </div>
          ))}

          <h3>Delivery Info</h3>
          <p>Name: {currentUser.firstName} {currentUser.lastName}</p>
          <p>Phone: {currentUser.phone}</p>
          <p>Shop / Address: {currentUser.shopAddress || "Your Shop"}</p>
          <p>Area: {currentUser.area || "Nairobi"}</p>
          <p>City: Nairobi</p>

          <div className="checkout-totals">
            <p>Subtotal: KES {subtotal.toLocaleString()}</p>
            <p>Delivery Fee: KES {deliveryFee}</p>
            <p className="total">Total: KES {total.toLocaleString()}</p>
          </div>

          <button className="confirm-order-btn" onClick={handleConfirmOrder}>
            Confirm & Pay
          </button>
        </div>
      )}

      {popup && (
        <div className={`floating-popup-overlay ${popup.type || "info"}`}>
          <div className="floating-popup">
            <div className="popup-icon">{popup.icon}</div>
            <h3>{popup.title}</h3>
            <p>{popup.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}