import LogSesion from "../models/logSesion.model.js";

export const getLogSesions = async (req, res) => {
  const logSesions = await LogSesion.find();
  res.json(logSesions);
};
