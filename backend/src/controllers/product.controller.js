import Product from "../models/product.model.js";

// Obtener todos los productos (cualquiera)
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener producto por ID (cualquiera)
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Producto no encontrado" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear producto (solo admin)
export const createProduct = async (req, res) => {
  try {
    if (req.user.role !== "administrador")
      return res.status(403).json({ message: "Acceso denegado" });

    const { code, name, description, price, stock } = req.body;
    const newProduct = new Product({ code, name, description, price, stock });
    const productSaved = await newProduct.save();
    res.json(productSaved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar producto (solo admin)
export const updateProduct = async (req, res) => {
  try {
    if (req.user.role !== "administrador")
      return res.status(403).json({ message: "Acceso denegado" });

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product)
      return res.status(404).json({ message: "Producto no encontrado" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar producto (solo admin)
export const deleteProduct = async (req, res) => {
  try {
    if (req.user.role !== "administrador")
      return res.status(403).json({ message: "Acceso denegado" });

    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Producto no encontrado" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
