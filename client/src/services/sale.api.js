import axiosClient from "./axiosClient";

export const getAllSales = () => axiosClient.get("/sales");

export const getSale = (id) => axiosClient.get(`/sales/${id}`);

export const createSale = (Sale) => axiosClient.post("/sales", Sale);
