import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  getSales,
  getSale,
  createSale,
  deleteSale,
  updateSale,
} from "../controllers/sale.controller.js";

const router = Router();

router.get("/sales", authRequired, getSales);
router.get("/sale/:id", authRequired, getSale);
router.post("/sales", authRequired, createSale);
router.delete("/sales", authRequired, deleteSale);
router.put("/sales", authRequired, updateSale);

export default router;
