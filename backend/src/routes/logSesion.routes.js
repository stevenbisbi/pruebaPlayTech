import { Router } from "express";
import { handleValidationErrors } from "../middlewares/validator.middleware.js";

const router = Router();

// Solo autenticados, controlador valida rol admin
router.get("/", handleValidationErrors);

export default router;
