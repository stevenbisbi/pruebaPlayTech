import axiosClient from "./axiosClient";

export const getDailyReport = async () => {
  return axiosClient.get("/reports/daily");
};

// Descargar reporte en formato CSV o PDF
export const downloadDailyReport = async (format = "pdf") => {
  return axiosClient.get(`/reports/daily?format=${format}`, {
    responseType: "blob", // ✅ necesario para descargar el archivo
  });
};
