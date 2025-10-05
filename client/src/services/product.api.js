import axiosClient from "./axiosClient";

export const getAllProducts = () => axiosClient.get("products");
export const getProduct = (id) => axiosClient.get(`products/${id}`);
export const createProduct = (product) => axiosClient.post("products", product);
export const deleteProduct = (id) => axiosClient.delete(`products/${id}`); // sin user
export const updateProduct = (id, data) =>
  axiosClient.put(`products/${id}`, data);
