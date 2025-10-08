import { Router } from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/product.controller.js";
import { handleValidationErrors } from "../middlewares/validator.middleware.js";
import { validateRoleAdmin } from "../middlewares/validateRole.middleware.js";

const router = Router();

// Todos necesitan estar autenticados
router.get("/", getProducts);
router.get("/:id", getProduct);

// Solo admin (el controlador valida rol)
router.post("/", validateRoleAdmin, handleValidationErrors, createProduct);

router.put("/:id", validateRoleAdmin, handleValidationErrors, updateProduct);
router.delete("/:id", validateRoleAdmin, handleValidationErrors, deleteProduct);

export default router;
