import { Router } from "express";
import { generateDailyReport } from "../controllers/report.controller.js";

const router = Router();

// 📅 Ruta del reporte diario
router.get("/daily", generateDailyReport);

export default router;
