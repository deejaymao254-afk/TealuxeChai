// src/pages/Products.jsx
import { useState, useEffect } from "react";
import { fetchProducts } from "../api/products";
import "./products.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetchProducts();
        const data = Array.isArray(res.data) ? res.data : res.data.products || [];
        setProducts(data);
      } catch (err) {
        console.error("TEALUXE LOAD ERROR:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) return <h2 className="products-status">Loading products...</h2>;
  if (error) return <h2 className="products-error">{error}</h2>;

  return (
    <div className="products-container">
      <h1 className="products-title">Products</h1>
      <table className="products-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price (KES)</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 && (
            <tr>
              <td colSpan={6}>No products found</td>
            </tr>
          )}
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td className="product-name">{product.name}</td>
              <td>{product.category || "-"}</td>
              <td>{product.price}</td>
              <td>{product.stock}</td>
              <td className="actions">
                <button className="edit-btn" onClick={() => alert(`Edit ${product.name}`)}>Edit</button>
                <button className="delete-btn" onClick={() => alert(`Delete ${product.name}`)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}