// src/api/client.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
});

// ✅ getProducts always returns array of products
export const getProducts = async () => {
  try {
    const res = await api.get("/products");

    // handle response shapes
    if (Array.isArray(res.data)) return res.data;
    if (res.data?.products) return res.data.products;

    // fallback empty array
    return [];
  } catch (err) {
    console.error("API getProducts error:", err.message);
    return [];
  }
};

export default api;