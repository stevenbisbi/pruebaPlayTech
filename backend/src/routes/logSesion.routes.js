import { Router } from "express";
import { handleValidationErrors } from "../middlewares/validator.middleware.js";
import {
  getAllLogs,
  getLogsUser,
} from "../../../client/src/services/logSesion.api.js";

const router = Router();

// Solo autenticados, controlador valida rol admin
router.get("/", handleValidationErrors, getAllLogs);
router.get("/:id", handleValidationErrors, getLogsUser);

export default router;
