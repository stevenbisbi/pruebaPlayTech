import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/product.controller.js";

const router = Router();

router.get("/products", authRequired, getProducts);
router.get("/products/:id", authRequired, getProduct);
router.post("/products", authRequired, createProduct);
router.delete("/products", authRequired, deleteProduct);
router.put("/products", authRequired, updateProduct);

export default router;
