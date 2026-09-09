import { useState } from "react";
import "../App.css";
import "./orders.css";

export default function Orders() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [expandedId, setExpandedId] = useState(null);

  // 🔹 PLACEHOLDER DATA (replace with API later)
  const [orders] = useState([
    {
      id: "ORD-1001",
      customer: "John Doe",
      phone: "0712345678",
      amount: 1200,
      status: "PENDING",
      created_at: "2026-03-22",
      items: [
        { name: "Kripsii - BBQ", qty: 2, price: 200 },
        { name: "Kripsii - Chilli", qty: 1, price: 300 }
      ]
    },
    {
      id: "ORD-1002",
      customer: "Mary Wanjiku",
      phone: "0700123456",
      amount: 800,
      status: "CONFIRMED",
      created_at: "2026-03-21",
      items: [
        { name: "Kripsii - Salted", qty: 4, price: 200 }
      ]
    }
  ]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.phone.includes(search);

    const matchesStatus =
      statusFilter === "ALL" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return "status pending";
      case "CONFIRMED":
        return "status confirmed";
      case "DELIVERED":
        return "status delivered";
      case "CANCELLED":
        return "status cancelled";
      default:
        return "status";
    }
  };

  return (
    <div className="orders-page">
      {/* HEADER */}
      <div className="orders-header">
        <h2>Orders</h2>

        <div className="filters">
          <input
            type="text"
            placeholder="Search order, customer, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="orders-table">
        <div className="table-header">
          <span>Order</span>
          <span>Customer</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Date</span>
          <span>Actions</span>
        </div>

        {filteredOrders.map((order) => (
          <div key={order.id} className="table-row">
            <span>{order.id}</span>
            <span>
              {order.customer}
              <br />
              <small>{order.phone}</small>
            </span>
            <span>KES {order.amount}</span>

            <span className={getStatusClass(order.status)}>
              {order.status}
            </span>

            <span>{order.created_at}</span>

            <span className="actions">
              <button onClick={() => setExpandedId(
                expandedId === order.id ? null : order.id
              )}>
                View
              </button>

              <button>Update</button>
            </span>
          </div>
        ))}
      </div>

      {/* EXPANDED VIEW */}
      {expandedId && (
        <div className="order-details">
          {orders
            .filter((o) => o.id === expandedId)
            .map((order) => (
              <div key={order.id}>
                <h3>Order Details</h3>

                <p><strong>Customer:</strong> {order.customer}</p>
                <p><strong>Phone:</strong> {order.phone}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Total:</strong> KES {order.amount}</p>

                <h4>Items</h4>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.name} x {item.qty} — KES {item.price}
                    </li>
                  ))}
                </ul>

                <div className="detail-actions">
                  <button>Mark Confirmed</button>
                  <button>Mark Delivered</button>
                  <button className="danger">Cancel</button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}