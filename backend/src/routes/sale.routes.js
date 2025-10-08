import { Router } from "express";
import {
  getSales,
  getSale,
  createSale,
} from "../controllers/sale.controller.js";
import {
  handleValidationErrors,
  validateStock,
} from "../middlewares/validator.middleware.js";
import { validateRoleCajero } from "../middlewares/validateRole.middleware.js";

const router = Router();

// Todos requieren autenticación
router.get("/", handleValidationErrors, getSales);
router.get("/:id", handleValidationErrors, getSale);

// Crear venta (controlador valida rol cajero/admin)
router.post(
  "/",
  handleValidationErrors,
  validateRoleCajero,
  validateStock,
  createSale
);

export default router;
