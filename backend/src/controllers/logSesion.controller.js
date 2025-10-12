import LogSesion from "../models/logSesion.model.js";
import LogSesion from "../models/logSesion.model.js";

export const getLogSesions = async (req, res) => {
  try {
    const logSesions = await LogSesion.find();
    res.json(logSesions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLogsUser = async (req, res) => {
  try {
    const LogSesion = await LogSesion.findById(req.params.id);
    res.json(LogSesion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
