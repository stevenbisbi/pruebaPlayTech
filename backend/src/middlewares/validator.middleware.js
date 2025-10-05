import { validationResult } from "express-validator";
import Product from "../models/product.model.js";

export const handleValidationErrors = (req, res, next) => {
  console.log("Validating request...");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  console.log("Validation passed.");
  next();
};

export const validateStock = async (req, res, next) => {
  const products = req.body.products;

  if (!products || !Array.isArray(products) || products.length === 0) {
    return res.status(400).json({
      message: "La venta debe incluir al menos un producto",
    });
  }

  try {
    for (const item of products) {
      const productFound = await Product.findById(item.product);

      if (!productFound) {
        return res.status(404).json({
          message: `Producto con ID ${item.product} no encontrado`,
        });
      }

      if (item.quantity > productFound.stock) {
        return res.status(400).json({
          message: `Stock insuficiente para ${productFound.name}. Disponible: ${productFound.stock}, Solicitado: ${item.quantity}`,
        });
      }
    }
    next();
  } catch (error) {
    console.error("Error en validateStock:", error);
    res.status(500).json({
      message: "Error al validar el stock",
    });
  }
};
