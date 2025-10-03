import Sale from "../models/sale.model.js";

export const getSales = async (req, res) => {
  const sales = await Sale.find();
  res.json(sales);
};

export const createSale = async (req, res) => {
  const { user, products, totalGeneral } = req.body;

  const newSale = new Sale({ user, products, totalGeneral });
  const saleSaved = await newSale.save();
  res.json(saleSaved);
};

export const getSale = async (req, res) => {
  const sale = await Sale.findById(req.params.id);
  if (!sale) return res.status(404).json({ message: "Sale not found" });
  res.json(sale);
};
export const deleteSale = async (req, res) => {
  const sale = await Sale.findByIdAndDelete(req.params.id);
  if (!sale) return res.status(404).json({ message: "Sale not found" });
  res.json(sale);
};

export const updateSale = async (req, res) => {
  const sale = await Sale.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!sale) return res.status(404).json({ message: "Sale not found" });
  res.json(sale);
};
