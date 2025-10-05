import { Router } from "express";
import { validateRoleAdmin } from "../middlewares/validateRole.middleware.js";
import { handleValidationErrors } from "../middlewares/validator.middleware.js";
import {
  getUsers,
  getUser,
  deleteUser,
  updateUser,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/users", handleValidationErrors, validateRoleAdmin, getUsers);
router.get("/user/:id", handleValidationErrors, validateRoleAdmin, getUser);
router.delete(
  "/user/:id",
  handleValidationErrors,
  validateRoleAdmin,
  deleteUser
);
router.put("/user/:id", handleValidationErrors, validateRoleAdmin, updateUser);

export default router;
