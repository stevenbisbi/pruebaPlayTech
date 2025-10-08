import axiosClient from "./axiosClient.js";

export const register = (user) => axiosClient.post("/auth/register", user);

export const loginUser = (data) =>
  axiosClient.post("/auth/login", data, { withCredentials: true });

export const verifyToken = () =>
  axiosClient.get("/auth/profile", { withCredentials: true });

export const logout = () => axiosClient.post("/auth/logout");

export const getAllUsers = () => axiosClient.get("/users");

export const getUser = (id) => axiosClient.get(`/users/${id}`);

export const deleteUser = (id) => axiosClient.delete(`/users/${id}`);

export const updateUser = (id, user) => axiosClient.put(`/users/${id}`, user);
