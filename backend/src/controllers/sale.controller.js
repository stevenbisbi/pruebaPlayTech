import Sale from "../models/sale.model.js";
import Product from "../models/product.model.js";

export const getSales = async (req, res) => {
  try {
    const user = req.user;

    if (user.role == "cajero") {
      const sales = await Sale.find({ user: user.id });
      return res.json(sales);
    }

    const sales = await Sale.find();
    res.json(sales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las ventas" });
  }
};

// 🔍 Obtener venta por ID
export const getSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    res.json(sale);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener la venta" });
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

    res.json(saleSaved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear la venta" });
  }
};
