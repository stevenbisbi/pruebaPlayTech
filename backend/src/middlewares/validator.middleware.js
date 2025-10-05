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
  for (const item of products) {
    const productFound = await Product.findById(item.product);
    if (!productFound) {
      return res
        .status(404)
        .json({ message: `Product with ID ${item.id} not found` });
    }
    if (item.quantity > productFound.stock) {
      return res
        .status(400)
        .json({ message: `Invalid quantity for product ${productFound.name}` });
    }
  }
  next();
};
