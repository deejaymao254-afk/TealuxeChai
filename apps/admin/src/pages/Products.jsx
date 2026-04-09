// src/pages/Products.jsx
import { useState } from "react";
import "../App.css";
import "./products.css";

export default function Products() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [expandedId, setExpandedId] = useState(null);

  // 🔹 TEA PRODUCTS
  const [products] = useState([
    {
      id: "TEA-001",
      name: "Black Tea",
      category: "Black",
      basePrice: 250,
      variations: [
        { flavour: "Classic Black", weights: [{ weight: "100g", price: 250 }] }
      ],
      active: true,
    },
    {
      id: "TEA-002",
      name: "Ginger Tea",
      category: "Ginger",
      basePrice: 300,
      variations: [
        { flavour: "Ginger", weights: [{ weight: "100g", price: 300 }] }
      ],
      active: true,
    },
    {
      id: "TEA-003",
      name: "Cardamom Tea",
      category: "Cardamom",
      basePrice: 350,
      variations: [
        { flavour: "Cardamom", weights: [{ weight: "100g", price: 350 }] }
      ],
      active: true,
    },
    {
      id: "TEA-004",
      name: "Peppermint Tea",
      category: "Peppermint",
      basePrice: 320,
      variations: [
        { flavour: "Peppermint", weights: [{ weight: "100g", price: 320 }] }
      ],
      active: true,
    },
    {
      id: "TEA-005",
      name: "Hibiscus Tea",
      category: "Hibiscus",
      basePrice: 280,
      variations: [
        { flavour: "Hibiscus", weights: [{ weight: "100g", price: 280 }] }
      ],
      active: true,
    },
    {
      id: "TEA-006",
      name: "Lemon Balm Tea",
      category: "Lemon Balm",
      basePrice: 300,
      variations: [
        { flavour: "Lemon Balm", weights: [{ weight: "100g", price: 300 }] }
      ],
      active: true,
    },
    {
      id: "TEA-007",
      name: "Cinnamon Tea",
      category: "Cinnamon",
      basePrice: 310,
      variations: [
        { flavour: "Cinnamon", weights: [{ weight: "100g", price: 310 }] }
      ],
      active: true,
    },
    {
      id: "TEA-008",
      name: "Rosemary Tea",
      category: "Rosemary",
      basePrice: 330,
      variations: [
        { flavour: "Rosemary", weights: [{ weight: "100g", price: 330 }] }
      ],
      active: true,
    },
    {
      id: "TEA-009",
      name: "Chamomile Tea",
      category: "Chamomile",
      basePrice: 400,
      variations: [
        { flavour: "Chamomile", weights: [{ weight: "50g", price: 400 }] }
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
            {products.map((p) => (
              <option key={p.id} value={p.category}>{p.category}</option>
            ))}
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