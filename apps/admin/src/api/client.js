// src/api/client.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
});

// Wrapper
export const getProducts = async () => {
  const res = await api.get("/products");
  return res.data;
};

export default api;