import axiosClient from "./axiosClient.js";

export const getAllUsers = () => axiosClient.get("/users");

export const getUser = (id) => axiosClient.get(`/users/${id}`);

export const register = (user) => axiosClient.post("/register", user);

export const loginUser = (data) => axiosClient.post("/login", data);

export const deleteUser = (id) => axiosClient.delete(`/users/${id}`);

export const updateUser = (id, user) => axiosClient.put(`/users/${id}`, user);
