import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// Get token from localStorage consistently
const getToken = () => localStorage.getItem("duka2_token") || "";

// Axios instance
const api = axios.create({
  baseURL: BASE_URL,
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Products
export const fetchProducts = () => api.get("/products");
export const createProduct = (data) => api.post("/products", data);
export const updateProduct = (id, data, isMultipart = false) => {
  if (isMultipart) {
    return api.put(`/products/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  return api.put(`/products/${id}`, data);
};
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Variations
export const addVariation = (data) => api.post("/variations", data);
export const updateVariation = (id, data) => api.put(`/variations/${id}`, data);
export const deleteVariation = (id) => api.delete(`/variations/${id}`);

// Weights
export const addWeight = (data) => api.post("/weights", data);
export const updateWeight = (id, data) => api.put(`/weights/${id}`, data);
export const deleteWeight = (id) => api.delete(`/weights/${id}`);

export default api;