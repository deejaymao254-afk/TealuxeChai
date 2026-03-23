import { useState } from "react";
import "./ProductsAdmin.css";

export default function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);

  const emptyVariation = {
    flavour: "",
    image: "",
    weights: [{ weight: "", price: "" }]
  };

  const emptyProduct = {
    name: "",
    category: "",
    image_url: "",
    variations: [emptyVariation]
  };

  const [form, setForm] = useState(emptyProduct);

  // =====================
  // HANDLE BASIC FIELDS
  // =====================
  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  // =====================
  // VARIATIONS
  // =====================
  const updateVariation = (index, key, value) => {
    const updated = [...form.variations];
    updated[index][key] = value;
    setForm({ ...form, variations: updated });
  };

  const updateWeight = (vIndex, wIndex, key, value) => {
    const updated = [...form.variations];
    updated[vIndex].weights[wIndex][key] = value;
    setForm({ ...form, variations: updated });
  };

  const addVariation = () => {
    setForm(prev => ({
      ...prev,
      variations: [...prev.variations, emptyVariation]
    }));
  };

  const addWeight = (vIndex) => {
    const updated = [...form.variations];
    updated[vIndex].weights.push({ weight: "", price: "" });
    setForm({ ...form, variations: updated });
  };

  // =====================
  // SAVE PRODUCT
  // =====================
  const saveProduct = () => {
    if (!form.name) return alert("Name required");

    if (editing !== null) {
      const updated = [...products];
      updated[editing] = form;
      setProducts(updated);
    } else {
      setProducts(prev => [...prev, form]);
    }

    setForm(emptyProduct);
    setEditing(null);
  };

  // =====================
  // EDIT
  // =====================
  const editProduct = (index) => {
    setForm(products[index]);
    setEditing(index);
  };

  // =====================
  // DELETE
  // =====================
  const deleteProduct = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  return (
    <div className="admin-container">

      <h2>Products Admin</h2>

      {/* ================= FORM ================= */}
      <div className="form">

        <input
          placeholder="Product Name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />

        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) => handleChange("category", e.target.value)}
        />

        <input
          placeholder="Main Image URL (from folder)"
          value={form.image_url}
          onChange={(e) => handleChange("image_url", e.target.value)}
        />

        {/* VARIATIONS */}
        <h4>Variations</h4>

        {form.variations.map((v, vIndex) => (
          <div key={vIndex} className="variation">

            <input
              placeholder="Flavour"
              value={v.flavour}
              onChange={(e) =>
                updateVariation(vIndex, "flavour", e.target.value)
              }
            />

            <input
              placeholder="Image URL"
              value={v.image}
              onChange={(e) =>
                updateVariation(vIndex, "image", e.target.value)
              }
            />

            {/* WEIGHTS */}
            <h5>Weights</h5>

            {v.weights.map((w, wIndex) => (
              <div key={wIndex} className="weight">
                <input
                  placeholder="Weight"
                  value={w.weight}
                  onChange={(e) =>
                    updateWeight(vIndex, wIndex, "weight", e.target.value)
                  }
                />

                <input
                  placeholder="Price"
                  type="number"
                  value={w.price}
                  onChange={(e) =>
                    updateWeight(vIndex, wIndex, "price", e.target.value)
                  }
                />
              </div>
            ))}

            <button onClick={() => addWeight(vIndex)}>
              + Add Weight
            </button>

          </div>
        ))}

        <button onClick={addVariation}>
          + Add Variation
        </button>

        <button onClick={saveProduct}>
          {editing !== null ? "Update Product" : "Save Product"}
        </button>

      </div>

      {/* ================= LIST ================= */}
      <div className="list">

        {products.map((p, i) => (
          <div key={i} className="product-item">

            <h3>{p.name}</h3>
            <p>{p.category}</p>

            <button onClick={() => editProduct(i)}>Edit</button>
            <button onClick={() => deleteProduct(i)}>Delete</button>

          </div>
        ))}

      </div>

    </div>
  );
}