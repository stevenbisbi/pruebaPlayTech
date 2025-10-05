import axiosClient from "./axiosClient.js";

export const getAllUsers = () => axiosClient.get("/users");

export const getUser = (id) => axiosClient.get(`/users/${id}`);

export const register = (user) => axiosClient.post("/register", user);

export const loginUser = (data) =>
  axiosClient.post("/login", data, { withCredentials: true });

export const deleteUser = (id) => axiosClient.delete(`/user/${id}`);

export const updateUser = (id, user) => axiosClient.put(`/user/${id}`, user);

export const verifyToken = () =>
  axiosClient.get("/profile", { withCredentials: true });
export const logout = () => axiosClient.post("/logout");
