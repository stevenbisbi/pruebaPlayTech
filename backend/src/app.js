import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import { authRequired } from "./middlewares/validationToken.middleware.js";
import { validateRoleAdmin } from "./middlewares/validateRole.middleware.js";
import productRoutes from "./routes/product.routes.js";
import saleRoutes from "./routes/sale.routes.js";
import userRoutes from "./routes/user.routes.js";
import logSesionRoutes from "./routes/logSesion.routes.js";
import reportRoutes from "./routes/report.routes.js";

const corsOptions = {
  origin: "http://localhost:5173", // frontend
  credentials: true, // muy importante
};

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", authRequired, productRoutes);
app.use("/api/v1/users", authRequired, validateRoleAdmin, userRoutes);
app.use("/api/v1/sales", authRequired, saleRoutes);
app.use("/api/v1/logSesions", authRequired, logSesionRoutes);
app.use("/api/v1/reports", authRequired, validateRoleAdmin, reportRoutes);

export default app;
