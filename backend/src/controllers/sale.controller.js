import Sale from "../models/sale.model.js";
import Product from "../models/product.model.js";

export const getSales = async (req, res) => {
  try {
    const user = req.user; // viene de authRequired

    // Filtro según el rol
    const filter = user.role === "cajero" ? { user: user.id } : {};

    // Solo admin o cajero pueden consultar
    if (!["cajero", "administrador"].includes(user.role)) {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    // Buscar ventas (ya no necesitamos poblar products.product)
    const sales = await Sale.find(filter).populate("user", "username role");

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

    // Crear nueva venta con snapshots
    const saleProducts = [];
    for (const item of req.body.products) {
      const productFound = await Product.findById(item.product);
      if (!productFound) continue;

      // Guardar snapshot
      saleProducts.push({
        product: productFound._id,
        productName: productFound.name,
        productPrice: productFound.price,
        quantity: item.quantity,
        total: productFound.price * item.quantity,
      });

      // Descontar stock
      productFound.stock -= item.quantity;
      await productFound.save();
    }

    const totalGeneral = saleProducts.reduce((sum, p) => sum + p.total, 0);

    const newSale = new Sale({
      user: user.id,
      products: saleProducts,
      totalGeneral,
    });

    const saleSaved = await newSale.save();

    // Solo populamos usuario, no productos
    await saleSaved.populate("user", "username role");

    res.json(saleSaved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear la venta" });
  }
};

// 🔍 Obtener venta por ID
export const getSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate(
      "user",
      "username role"
    );

    if (!sale) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    res.json(sale);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener la venta" });
  }
};
