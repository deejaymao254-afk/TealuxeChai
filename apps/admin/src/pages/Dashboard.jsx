import { useEffect, useState } from "react";
import { getProducts } from "../api/client";
import "../theme.css";

export default function Dashboard({ user, onLogout }) {
  const [products, setProducts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  // KPI COUNTER ANIMATION
  useEffect(() => {
    const counters = document.querySelectorAll(".value");

    counters.forEach((counter) => {
      const raw = counter.innerText;
      const target = parseFloat(raw.replace(/[^\d.]/g, "")) || 0;
      let count = 0;

      const update = () => {
        count += Math.ceil(target / 40);

        if (count < target) {
          counter.innerText = raw.includes("%")
            ? count + "%"
            : raw.includes("h")
            ? count + "h"
            : count;
          requestAnimationFrame(update);
        } else {
          counter.innerText = raw;
        }
      };

      update();
    });
  }, []);

  // FAKE LIVE ORDER STREAM
  useEffect(() => {
    const feed = document.querySelector(".order-feed");
    if (!feed) return;

    const locations = ["Kilimani", "Westlands", "Embakasi", "Rongai"];
    const statuses = ["processing", "dispatched", "delivered"];

    const interval = setInterval(() => {
      const id = Math.floor(Math.random() * 9000 + 1000);
      const loc = locations[Math.floor(Math.random() * locations.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      const li = document.createElement("li");
      li.innerHTML = `
        <strong>#${id}</strong> · ${loc}
        <span class="status ${status}">${status.toUpperCase()}</span>
      `;
      feed.prepend(li);

      if (feed.children.length > 6) {
        feed.removeChild(feed.lastChild);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`app ${sidebarOpen ? "sidebar-open" : ""}`}>
      <main className="main">
        {/* HEADER */}
        <header className="header">
          <div className="header-left">
            <button className="menu-toggle" onClick={toggleSidebar}>
              ☰
            </button>
            <div className="sys">
              <span className="dot online"></span>
              <span>Network Online</span>
              <span className="sep"></span>
              <span>
                Sync: <strong>2s ago</strong>
              </span>
            </div>
          </div>

          <div className="header-right">
            <div className="user">
              <span className="user-name">{user?.name || "Admin"}</span>
              <span className="user-role">Preview</span>
            </div>

            <button className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
        </header>

        {/* KPI STRIP */}
        <section className="kpis">
          <div className="kpi">
            <span className="label">Active Orders</span>
            <span className="value">1248</span>
          </div>
          <div className="kpi">
            <span className="label">Nodes Online</span>
            <span className="value">98%</span>
          </div>
          <div className="kpi">
            <span className="label">Fulfillment</span>
            <span className="value">94%</span>
          </div>
          <div className="kpi">
            <span className="label">Avg Delivery</span>
            <span className="value">2.4h</span>
          </div>
        </section>

        {/* GRID */}
        <section className="grid">
          {/* LIVE ORDERS */}
          <div className="panel feed">
            <h3>Live Orders</h3>
            <ul className="order-feed">
              {products.slice(0, 6).map((product) => (
                <li key={product.id}>
                  <strong>#{product.id}</strong> · {product.name}
                  <span className="status processing">
                    {product.status || "ACTIVE"}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* NETWORK */}
          <div className="panel network">
            <h3>Network Health</h3>
            <div className="metric">
              Regions Active <strong>12 / 14</strong>
            </div>
            <div className="metric">
              Latency <strong>LOW</strong>
            </div>
            <div className="metric">
              Sync State <span className="sync live">STABLE</span>
            </div>
          </div>

          {/* ALERTS */}
          <div className="panel alerts">
            <h3>System Alerts</h3>
            <ul>
              <li>✔ Inventory sync completed</li>
              <li>⚠ Route delay detected · Kisumu</li>
              <li>⟳ Reconciliation running</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}