import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // must match login
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ getProducts always returns array of products
export const getProducts = async () => {
  try {
    const res = await api.get("/products");
    if (Array.isArray(res.data)) return res.data;
    if (res.data?.products) return res.data.products;
    return [];
  } catch (err) {
    console.error("API getProducts error:", err.message);
    return [];
  }
};

export default api;