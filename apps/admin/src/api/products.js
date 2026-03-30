import api from "./client";
import axios from "axios";


// GET ALL
export const fetchProducts = () => api.get("/products/full");

// PRODUCT
export const createProduct = (data) => api.post("/products", data);
export const updateProduct = (id, data) =>
  api.put(`/products/${id}`, data);

// VARIATIONS
export const addVariation = (data) =>
  api.post("/products/variation", data);

export const deleteVariation = (id) =>
  api.delete(`/products/variation/${id}`);

export const updateVariation = (id, data) =>
  axios.put(`/api/products/variation/${id}`, data);

// WEIGHTS
export const addWeight = (data) =>
  api.post("/products/weight", data);

export const deleteWeight = (id) =>
  api.delete(`/products/weight/${id}`);

export const updateWeight = (id, data) =>
  axios.put(`/api/products/weight/${id}`, data);