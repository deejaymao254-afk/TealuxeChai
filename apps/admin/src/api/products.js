import api from "./client";

// GET ALL
export const fetchProducts = () => api.get("/products/products");

// PRODUCT
export const createProduct = (data) => api.post("/products", data);
export const updateProduct = (id, data) =>
  api.put(`/products/${id}`, data);

// VARIATIONS
export const addVariation = (data) =>
  api.post("/products/variation", data);

export const deleteVariation = (id) =>
  api.delete(`/products/variation/${id}`);

// WEIGHTS
export const addWeight = (data) =>
  api.post("/products/weight", data);

export const deleteWeight = (id) =>
  api.delete(`/products/weight/${id}`);