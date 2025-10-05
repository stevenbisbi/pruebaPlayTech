import Sale from "../models/sale.model.js";
import Product from "../models/product.model.js";

// 📦 Obtener ventas según rol del usuario en el token
export const getSales = async (req, res) => {
  try {
    const user = req.user; // viene de authRequired

    // Filtro según el rol
    const filter = user.role === "cajero" ? { user: user.id } : {};

    // Solo admin o cajero pueden consultar
    if (!["cajero", "administrador"].includes(user.role)) {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    // Buscar ventas y poblar referencias
    const sales = await Sale.find(filter)
      .populate("user", "username role") // 🔹 Cajero y rol
      .populate("products.product", "name price"); // 🔹 Nombre y precio de producto

    res.json(sales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las ventas" });
  }
};

// 🧾 Crear venta y actualizar stock de productos
export const createSale = async (req, res) => {
  try {
    const user = req.user;

    // Crear nueva venta con el usuario asociado
    const newSale = new Sale({
      ...req.body,
      user: user.id,
    });

    // Actualizar stock de cada producto vendido
    for (const item of newSale.products) {
      const productFound = await Product.findById(item.product);
      if (!productFound) {
        return res
          .status(404)
          .json({ message: `Producto ${item.product} no encontrado` });
      }

      if (productFound.stock < item.quantity) {
        return res.status(400).json({
          message: `Stock insuficiente para ${productFound.name}`,
        });
      }

      productFound.stock -= item.quantity;
      await productFound.save();
    }

    // Guardar venta
    let saleSaved = await newSale.save();

    // 🔹 Poblamos la venta antes de devolverla
    saleSaved = await saleSaved.populate("user", "username role");
    saleSaved = await saleSaved.populate("products.product", "name price");

    res.json(saleSaved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear la venta" });
  }
};

// 🔍 Obtener venta por ID
export const getSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate("user", "username role")
      .populate("products.product", "name price");

    if (!sale) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    res.json(sale);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener la venta" });
  }
};
