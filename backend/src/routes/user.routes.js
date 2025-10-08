import { Router } from "express";
import { handleValidationErrors } from "../middlewares/validator.middleware.js";
import {
  getUsers,
  getUser,
  deleteUser,
  updateUser,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/", handleValidationErrors, getUsers);
router.get("/:id", handleValidationErrors, getUser);
router.delete("/:id", handleValidationErrors, deleteUser);
router.put("/:id", handleValidationErrors, updateUser);

export default router;
