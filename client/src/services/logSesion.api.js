import axiosClient from "./axiosClient.js";

export const getAllLogs = () => axiosClient.get("/logSesions/");

export const getLogsUser = (id) => axiosClient.get(`/logSesions/${id}`);
