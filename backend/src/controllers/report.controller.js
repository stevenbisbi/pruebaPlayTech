import Sale from "../models/sale.model.js";
import { Parser } from "json2csv";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

// 🧾 Generar reporte diario en CSV o PDF
export const generateDailyReport = async (req, res) => {
  try {
    // (Opcional) Solo administradores
    if (req.user.role !== "administrador") {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    // 🕒 Fecha actual (inicio y fin del día)
    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0));
    const end = new Date(today.setHours(23, 59, 59, 999));

    // 📦 Ventas del día
    const sales = await Sale.find({
      createdAt: { $gte: start, $lte: end },
    }).populate("products.product user");

    if (!sales.length) {
      return res.status(404).json({ message: "No hay ventas registradas hoy" });
    }

    // 1️⃣ Número de transacciones
    const totalTransactions = sales.length;

    // 2️⃣ Resumen de productos vendidos
    const productSummary = {};

    sales.forEach((sale) => {
      sale.products.forEach((item) => {
        const productName = item.product?.name || "Producto desconocido";
        if (!productSummary[productName]) {
          productSummary[productName] = {
            producto: productName,
            cantidadVendida: 0,
            totalVendido: 0,
          };
        }
        productSummary[productName].cantidadVendida += item.quantity;
        productSummary[productName].totalVendido += item.total;
      });
    });

    const summaryArray = Object.values(productSummary);

    // 3️⃣ Total general del día
    const totalRevenue = sales.reduce((acc, s) => acc + s.totalGeneral, 0);

    // Tipo de formato (csv o pdf)
    const { format } = req.query; // /daily-report?format=csv o pdf

    // ======================
    // 📊 Exportar en CSV
    // ======================
    if (format === "csv") {
      const fields = ["producto", "cantidadVendida", "totalVendido"];
      const parser = new Parser({ fields });
      const csv = parser.parse(summaryArray);

      res.header("Content-Type", "text/csv");
      res.attachment("reporte_diario.csv");
      return res.send(csv);
    }

    // ======================
    // 📄 Exportar en PDF
    // ======================
    const doc = new PDFDocument();
    const filePath = path.resolve("reporte_diario.pdf");
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(18).text(" Reporte Diario de Ventas", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Fecha: ${new Date().toLocaleDateString()}`);
    doc.text(`Transacciones: ${totalTransactions}`);
    doc.text(`Total general de ingresos: $${totalRevenue.toFixed(2)}`);
    doc.moveDown();

    doc.fontSize(14).text("Productos Vendidos:", { underline: true });
    doc.moveDown(0.5);

    summaryArray.forEach((p) => {
      doc
        .fontSize(12)
        .text(
          `- ${p.producto}: ${
            p.cantidadVendida
          } unidades  ($${p.totalVendido.toFixed(2)})`
        );
    });

    doc.end();

    stream.on("finish", () => {
      res.download(filePath, "reporte_diario.pdf", () => {
        fs.unlinkSync(filePath); // Eliminar después de enviar
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generando el reporte" });
  }
};
