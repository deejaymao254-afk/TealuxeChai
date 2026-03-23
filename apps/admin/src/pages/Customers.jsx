import { useState } from "react";
import "../App.css";
import "./customers.css";

export default function Customers() {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  // 🔹 PLACEHOLDER DATA
  const [customers] = useState([
    {
      id: 1,
      name: "Michael Odada",
      phone: "0712345678",
      email: "john@example.com",
      orders: 5,
      totalSpent: 5400,
      status: "ACTIVE",
      joined: "2026-03-10",
      ordersList: [
        { id: "ORD-1001", amount: 1200, status: "PENDING" },
        { id: "ORD-1005", amount: 800, status: "DELIVERED" }
      ]
    },
    {
      id: 2,
      name: "Mary Wanjiku",
      phone: "0700123456",
      email: "mary@example.com",
      orders: 2,
      totalSpent: 1600,
      status: "ACTIVE",
      joined: "2026-03-15",
      ordersList: [
        { id: "ORD-1002", amount: 800, status: "CONFIRMED" }
      ]
    }
  ]);

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusClass = (status) => {
    return status === "ACTIVE" ? "status active" : "status inactive";
  };

  return (
    <div className="customers-page">
      {/* HEADER */}
      <div className="customers-header">
        <h2>Customers</h2>

        <div className="filters">
          <input
            type="text"
            placeholder="Search customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="customers-table">
        <div className="table-header">
          <span>Name</span>
          <span>Contact</span>
          <span>Orders</span>
          <span>Total Spent</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {filtered.map((customer) => (
          <div key={customer.id} className="table-row">
            <span>{customer.name}</span>

            <span>
              {customer.phone}
              <br />
              <small>{customer.phone}</small>
            </span>

            <span>{customer.orders}</span>

            <span>KES {customer.totalSpent}</span>

            <span className={getStatusClass(customer.status)}>
              {customer.status}
            </span>

            <span className="actions">
              <button
                onClick={() =>
                  setExpandedId(
                    expandedId === customer.id ? null : customer.id
                  )
                }
              >
                View
              </button>

              <button>Edit</button>
            </span>
          </div>
        ))}
      </div>

      {/* EXPANDED VIEW */}
      {expandedId && (
        <div className="customer-details">
          {customers
            .filter((c) => c.id === expandedId)
            .map((customer) => (
              <div key={customer.id}>
                <h3>{customer.name}</h3>

                <p><strong>Phone:</strong> {customer.phone}</p>
                <p><strong>Email:</strong> {customer.email}</p>
                <p><strong>Total Orders:</strong> {customer.orders}</p>
                <p><strong>Total Spent:</strong> KES {customer.totalSpent}</p>
                <p><strong>Joined:</strong> {customer.joined}</p>

                <h4>Orders</h4>

                {customer.ordersList.map((order) => (
                  <div key={order.id} className="order-card">
                    <span>{order.id}</span>
                    <span>KES {order.amount}</span>
                    <span className={`status ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                ))}

                <div className="detail-actions">
                  <button>View Full History</button>
                  <button className="danger">Deactivate</button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}