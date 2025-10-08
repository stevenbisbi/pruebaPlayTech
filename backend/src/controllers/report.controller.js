import Sale from "../models/sale.model.js";
import { Parser } from "json2csv";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateDailyReport = async (req, res) => {
  try {
    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0));
    const end = new Date(today.setHours(23, 59, 59, 999));

    const sales = await Sale.find({
      createdAt: { $gte: start, $lte: end },
    }).populate("products.product user");

    if (!sales.length) {
      return res.status(404).json({ message: "No hay ventas registradas hoy" });
    }

    const totalTransactions = sales.length;

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
    const totalRevenue = sales.reduce((acc, s) => acc + s.totalGeneral, 0);

    const { format } = req.query;

    // CSV sigue igual
    if (format === "csv") {
      const fields = ["producto", "cantidadVendida", "totalVendido"];
      const parser = new Parser({ fields });
      const csv = parser.parse(summaryArray);

      res.header("Content-Type", "text/csv");
      res.attachment("reporte_diario.csv");
      return res.send(csv);
    }

    // PDF Mejorado
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const filePath = path.resolve("reporte_diario.pdf");
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // 🌟 Encabezado profesional
    doc
      .fontSize(22)
      .fillColor("#333")
      .text("Reporte Diario de Ventas", { align: "center" });

    doc.moveDown(0.5);
    doc
      .fontSize(12)
      .fillColor("#555")
      .text(`Fecha: ${new Date().toLocaleDateString()}`, { align: "right" });

    doc.moveDown();
    doc
      .fontSize(14)
      .fillColor("#333")
      .text(`Resumen General:`, { underline: true });

    doc.moveDown(0.3);
    doc
      .fontSize(12)
      .fillColor("#000")
      .text(`Número de transacciones: ${totalTransactions}`);
    doc.text(
      `Total general de ingresos: $${totalRevenue.toLocaleString("es-CO")}`
    );

    doc.moveDown();

    // 🌟 Tabla de productos vendidos
    doc
      .fontSize(14)
      .fillColor("#333")
      .text("Productos Vendidos", { underline: true });

    doc.moveDown(0.5);

    const tableTop = doc.y;
    const itemX = 50;
    const qtyX = 300;
    const totalX = 400;

    // Encabezados
    doc
      .fontSize(12)
      .fillColor("#000")
      .text("Producto", itemX, tableTop, { bold: true })
      .text("Cantidad", qtyX, tableTop)
      .text("Total", totalX, tableTop);

    doc.moveDown(0.3);
    doc
      .strokeColor("#aaaaaa")
      .lineWidth(1)
      .moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .stroke();

    // Filas de productos
    let y = doc.y + 5;
    summaryArray.forEach((p) => {
      doc
        .fontSize(12)
        .fillColor("#000")
        .text(p.producto, itemX, y)
        .text(p.cantidadVendida, qtyX, y)
        .text(`$${p.totalVendido.toLocaleString("es-CO")}`, totalX, y);
      y += 20;
    });

    // Footer
    doc.moveDown(2);
    doc
      .fontSize(10)
      .fillColor("#999")
      .text("Reporte generado automáticamente por el sistema de ventas", {
        align: "center",
      });

    doc.end();

    stream.on("finish", () => {
      res.download(filePath, "reporte_diario.pdf", () =>
        fs.unlinkSync(filePath)
      );
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generando el reporte" });
  }
};
