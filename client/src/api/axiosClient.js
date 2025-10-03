import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/v1";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export default axiosClient;
