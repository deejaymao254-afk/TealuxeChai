import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../App.css";
import "./orders.css";

export default function Orders() {
  const context = useOutletContext() || {};
  const user = context.user;

  const [searchTerm, setSearchTerm] = useState("");
  const [hotOffers] = useState([
    { id: 1, name: "Krispii Salted 50g", price: 35, stock: 120 },
    { id: 2, name: "Ola Classic 100g", price: 65, stock: 8 },
    { id: 3, name: "Krackles BBQ 150g", price: 95, stock: 0 },
  ]);
  const [previousOrders, setPreviousOrders] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        setPreviousOrders(
          data.map((order) => ({
            id: order.id,
            items: order.items
              ? JSON.stringify(order.items)
              : "No items",
            total: order.amount,
            date: new Date(order.created_at).toLocaleDateString(
              "en-GB",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            ),
          }))
        );
      } catch (err) {
        console.error("Failed to fetch previous orders", err);
      }
    }

    fetchOrders();
  }, [user]);

  const filteredOffers = hotOffers.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <div className="search-wrapper">
        <input
          type="text"
          placeholder="Search hot offers..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <section className="orders-panel">
        <h2>🔥 Hot Offers</h2>

        <div className="orders-grid">
          {filteredOffers.map((p) => (
            <div key={p.id} className="order-card shadow-light">
              <div>
                <h4>{p.name}</h4>
                <div className="order-meta">
                  <span className="price">KES {p.price}</span>
                  <span
                    className={`stock-badge ${
                      p.stock === 0
                        ? "out"
                        : p.stock < 10
                        ? "low"
                        : "ok"
                    }`}
                  >
                    {p.stock === 0
                      ? "Out of Stock"
                      : `${p.stock} in stock`}
                  </span>
                </div>
              </div>

              <button
                className="order-action"
                disabled={p.stock === 0}
              >
                {p.stock === 0 ? "Unavailable" : "Order"}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="orders-panel">
        <h2>Your Previous Orders</h2>

        <div className="previous-orders">
          {previousOrders.length === 0 ? (
            <p>No orders yet.</p>
          ) : (
            previousOrders.map((order) => (
              <div key={order.id} className="previous-card">
                <div>
                  <strong>Order #{order.id}</strong>
                  <div className="prev-meta">{order.items}</div>
                </div>

                <div className="prev-right">
                  <div className="prev-total">
                    KES {order.total}
                  </div>
                  <small>{order.date}</small>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}