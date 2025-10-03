import axiosClient from "./axiosClient";

export const getAllUsers = () => axiosClient.get("/users/");

export const getUser = (id) => axiosClient.get(`/users/${id}/`);

export const createUser = (user) => axiosClient.post("/register", user);

export const loginUser = (data) => axiosClient.post("/users/login/", data);

export const deleteUser = (id) => axiosClient.delete(`/users/${id}/`);

export const updateUser = (id, user) => axiosClient.put(`/users/${id}/`, user);
