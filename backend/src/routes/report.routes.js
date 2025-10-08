import { Router } from "express";
import { generateDailyReport } from "../controllers/report.controller.js";

const router = Router();

router.get("/daily", generateDailyReport);

export default router;
