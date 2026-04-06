// src/api/products.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// Products
export const fetchProducts = () => axios.get(`${BASE_URL}/products`);
export const createProduct = (data) => axios.post(`${BASE_URL}/products`, data);
export const updateProduct = (id, data, isMultipart = false) => {
  if (isMultipart) {
    return axios.put(`${BASE_URL}/products/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  }
  return axios.put(`${BASE_URL}/products/${id}`, data);
};
export const deleteProduct = (id) => axios.delete(`${BASE_URL}/products/${id}`);

// Variations
export const addVariation = (data) => axios.post(`${BASE_URL}/variations`, data);
export const updateVariation = (id, data) => axios.put(`${BASE_URL}/variations/${id}`, data);
export const deleteVariation = (id) => axios.delete(`${BASE_URL}/variations/${id}`);

// Weights
export const addWeight = (data) => axios.post(`${BASE_URL}/weights`, data);
export const updateWeight = (id, data) => axios.put(`${BASE_URL}/weights/${id}`, data);
export const deleteWeight = (id) => axios.delete(`${BASE_URL}/weights/${id}`);