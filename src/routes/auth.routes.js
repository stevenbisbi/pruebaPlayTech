import { Router } from "express";
import {
  login,
  logout,
  profile,
  register,
} from "../controllers/auth.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { handleValidationErrors } from "../middlewares/validator.middleware.js";
import { body } from "express-validator";

const router = Router();

router.post(
  "/register",
  [
    body("username").isString().notEmpty().withMessage("Username is required"),
    body("password")
      .isString()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("role")
      .isIn(["administrador", "cajero"])
      .withMessage("Role must be either administrador or cajero"),
    handleValidationErrors,
  ],
  register
);

//router.post("/login", validateSchema(loginSchema), login);
router.post("/logout", logout);
router.get("/profile", authRequired, profile);

export default router;
