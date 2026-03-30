import { useState, useEffect } from "react";
import "../App.css";
import "./products.css";

// ✅ API
import {
  fetchProducts,
  createProduct,
  updateProduct,
  addVariation as apiAddVariation,
  deleteVariation as apiDeleteVariation,
  addWeight as apiAddWeight,
  deleteWeight as apiDeleteWeight
} from "../api/products";

export default function Products() {
  // =========================
  // STATE
  // =========================
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  // =========================
  // EFFECTS
  // =========================
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetchProducts();
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to load products", err);
      }
    };

    loadProducts();
  }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // =========================
  // PRODUCT ACTIONS (API)
  // =========================
  const toggleActive = async (product) => {
    try {
      await updateProduct(product.id, {
        name: product.name,
        active: !product.active
      });
      const res = await fetchProducts();
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateProductName = async (product, value) => {
    try {
      await updateProduct(product.id, {
        name: value,
        active: product.active
      });
      const res = await fetchProducts();
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddProduct = async () => {
    try {
      await createProduct({
        name: "New Product",
        category: "Snacks"
      });
      const res = await fetchProducts();
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // VARIATIONS (API)
  // =========================
  const addVariation = async (productId) => {
    try {
      await apiAddVariation({
        product_id: productId,
        flavour: "New Flavour",
        image_url: ""
      });
      const res = await fetchProducts();
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateVariation = (productId, varId, field, value) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === productId
          ? {
              ...p,
              variations: p.variations.map(v =>
                v.id === varId ? { ...v, [field]: value } : v
              )
            }
          : p
      )
    );
  };

  const deleteVariation = async (varId) => {
    try {
      await apiDeleteVariation(varId);
      const res = await fetchProducts();
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // WEIGHTS (API)
  // =========================
  const addWeight = async (variationId) => {
    try {
      await apiAddWeight({
        variation_id: variationId,
        weight: "10g",
        price: 10
      });
      const res = await fetchProducts();
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateWeight = (productId, varId, weightId, field, value) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === productId
          ? {
              ...p,
              variations: p.variations.map(v =>
                v.id === varId
                  ? {
                      ...v,
                      weights: v.weights.map(w =>
                        w.id === weightId ? { ...w, [field]: value } : w
                      )
                    }
                  : v
              )
            }
          : p
      )
    );
  };

  const deleteWeight = async (weightId) => {
    try {
      await apiDeleteWeight(weightId);
      const res = await fetchProducts();
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="products-page">
      <div className="orders-header">
        <h2>Products</h2>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="product-list">
        {filtered.map(product => (
          <div key={product.id} className="product-row">
            {/* IMAGE */}
            <div className="product-left">
              <img src={product.image} alt="" />
            </div>

            {/* INFO */}
            <div className="product-center">
              <input
                value={product.name}
                onBlur={(e) => updateProductName(product, e.target.value)}
              />
              <span>{product.category}</span>
            </div>

            {/* ACTIONS */}
            <div className="product-actions">
              <button onClick={() =>
                setExpandedId(expandedId === product.id ? null : product.id)
              }>
                Manage
              </button>

              <button
                className={product.active ? "active" : "inactive"}
                onClick={() => toggleActive(product)}
              >
                {product.active ? "Active" : "Inactive"}
              </button>
            </div>

            {/* EXPAND */}
            {expandedId === product.id && (
              <div className="product-expand">
                {product.variations.map(v => (
                  <div key={v.id} className="variation-block">
                    <div className="variation-header">
                      <input
                        value={v.flavour}
                        onChange={(e) =>
                          updateVariation(product.id, v.id, "flavour", e.target.value)
                        }
                      />
                      <button className="danger" onClick={() => deleteVariation(v.id)}>
                        Delete
                      </button>
                    </div>

                    <div className="weights">
                      {v.weights.map(w => (
                        <div key={w.id} className="weight-row">
                          <input
                            value={w.weight}
                            onChange={(e) =>
                              updateWeight(product.id, v.id, w.id, "weight", e.target.value)
                            }
                          />
                          <input
                            value={w.price}
                            onChange={(e) =>
                              updateWeight(product.id, v.id, w.id, "price", e.target.value)
                            }
                          />
                          <button onClick={() => deleteWeight(w.id)}>x</button>
                        </div>
                      ))}
                      <button onClick={() => addWeight(v.id)}>+ Add Weight</button>
                    </div>
                  </div>
                ))}
                <button onClick={() => addVariation(product.id)}>+ Add Variation</button>
              </div>
            )}
          </div>
        ))}
        <button className="add-product" onClick={handleAddProduct}>
          + Add Product
        </button>
      </div>
    </div>
  );
}