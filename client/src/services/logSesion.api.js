import axiosClient from "./axiosClient";

export const getAllLogs = () => axiosClient.get("/logSesions/");
