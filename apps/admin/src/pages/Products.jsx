import { useState } from "react";
import "./products.css";

export default function ProductsMock() {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  // MOCK DATA
  const products = [
    {
      id: 1,
      name: "Choco Cookies",
      category: "Snacks",
      active: true,
      image: "",
      variations: [
        {
          id: 101,
          flavour: "Milk Chocolate",
          weights: [
            { id: 1001, weight: "100g", price: 120 },
            { id: 1002, weight: "200g", price: 220 }
          ]
        },
        {
          id: 102,
          flavour: "Dark Chocolate",
          weights: [{ id: 1003, weight: "150g", price: 180 }]
        }
      ]
    },
    {
      id: 2,
      name: "Green Tea",
      category: "Beverages",
      active: false,
      image: "",
      variations: []
    },
    {
      id: 3,
      name: "Almond Nuts",
      category: "Snacks",
      active: true,
      image: "",
      variations: [
        { id: 103, flavour: "Roasted", weights: [{ id: 1004, weight: "50g", price: 60 }] }
      ]
    }
  ];

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="products-page">
      <h2>Products Mockup</h2>
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: 10, padding: 5, width: "100%" }}
      />

      {filtered.map(product => (
        <div key={product.id} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 50, height: 50, background: "#eee", display: "flex", alignItems: "center", justifyContent: "center" }}>
              IMG
            </div>
            <span style={{ fontWeight: "bold" }}>{product.name}</span>
            <span>{product.category}</span>
            <span>{product.active ? "Active" : "Inactive"}</span>
            <button onClick={() => setExpandedId(expandedId === product.id ? null : product.id)}>
              {expandedId === product.id ? "Close" : "Manage"}
            </button>
          </div>

          {expandedId === product.id && (
            <div style={{ marginTop: 10, paddingLeft: 20 }}>
              {product.variations.length > 0 ? product.variations.map(v => (
                <div key={v.id} style={{ border: "1px dashed #aaa", padding: 5, marginBottom: 5 }}>
                  <span>{v.flavour}</span>
                  {(v.weights || []).map(w => (
                    <div key={w.id} style={{ display: "flex", gap: 5, marginTop: 5 }}>
                      <span>{w.weight}</span>
                      <span>{w.price}</span>
                    </div>
                  ))}
                </div>
              )) : <p style={{ fontSize: 12, color: "#888" }}>No variations</p>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}