// src/pages/Products.jsx
import { useState } from "react";
import "../App.css";
import "./products.css";

export default function Products() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [expandedId, setExpandedId] = useState(null);

  // 🔹 PLACEHOLDER PRODUCTS (replace with API later)
  const [products] = useState([
    {
      id: "PRD-1001",
      name: "Kripsii - BBQ",
      category: "Snacks",
      basePrice: 200,
      variations: [
        { flavour: "BBQ", weights: [{ weight: "50g", price: 200 }] },
        { flavour: "Chilli", weights: [{ weight: "50g", price: 210 }] }
      ],
      active: true,
    },
    {
      id: "PRD-1002",
      name: "Kripsii - Salted",
      category: "Snacks",
      basePrice: 200,
      variations: [
        { flavour: "Salted", weights: [{ weight: "50g", price: 200 }] }
      ],
      active: true,
    }
  ]);

  // Filtered products based on search and category
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "ALL" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="products-page">
      {/* HEADER */}
      <div className="orders-header">
        <h2>Products</h2>

        <div className="filters">
          <input
            type="text"
            placeholder="Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="ALL">All Categories</option>
            <option value="Snacks">Snacks</option>
            {/* Add more categories as needed */}
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="orders-table">
        <div className="table-header">
          <span>ID</span>
          <span>Product</span>
          <span>Base Price</span>
          <span>Category</span>
          <span>Actions</span>
        </div>

        {filteredProducts.map((p) => (
          <div key={p.id} className="table-row">
            <span>{p.id}</span>
            <span>{p.name}</span>
            <span>KES {p.basePrice}</span>
            <span>{p.category}</span>

            <span className="actions">
              <button onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}>
                View
              </button>
              <button>Edit</button>
            </span>
          </div>
        ))}
      </div>

      {/* EXPANDED VIEW */}
      {expandedId && (
        <div className="order-details">
          {products
            .filter((p) => p.id === expandedId)
            .map((p) => (
              <div key={p.id}>
                <h3>Product Details</h3>

                <p><strong>Name:</strong> {p.name}</p>
                <p><strong>Category:</strong> {p.category}</p>
                <p><strong>Base Price:</strong> KES {p.basePrice}</p>

                <h4>Variations</h4>
                <ul>
                  {p.variations.map((v, idx) => (
                    <li key={idx}>
                      <strong>{v.flavour}</strong> —{" "}
                      {v.weights.map((w, i) => (
                        <span key={i}>{w.weight}: KES {w.price} </span>
                      ))}
                    </li>
                  ))}
                </ul>

                <div className="detail-actions">
                  <button>Activate</button>
                  <button>Deactivate</button>
                  <button className="danger">Delete</button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}