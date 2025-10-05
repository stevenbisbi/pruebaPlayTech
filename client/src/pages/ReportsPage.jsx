import { useEffect, useState } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import { getDailyReport } from "../services/report.api"; // tu endpoint para el reporte diario

export function ReportsPage() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await getDailyReport();
        setReport(res.data);
      } catch (error) {
        console.error("Error al obtener el reporte diario", error);
      }
    }
    fetchReport();
  }, []);

  if (!report) return <p className="text-center mt-5">Cargando reporte...</p>;

  const { totalVentas, productosVendidos, ingresosTotales } = report;

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4 fw-bold">📊 Reporte Diario</h2>

      <Row className="g-4">
        {/* Card 1: Número de transacciones */}
        <Col md={4}>
          <Card className="text-center shadow-sm p-3 rounded-4">
            <h5 className="text-muted mb-2">Transacciones Hoy</h5>
            <h2 className="fw-bold text-primary">{totalVentas}</h2>
          </Card>
        </Col>

        {/* Card 2: Ingresos Hoy */}
        <Col md={4}>
          <Card className="text-center shadow-sm p-3 rounded-4 bg-light">
            <h5 className="text-muted mb-2">Ingresos Hoy</h5>
            <h2 className="fw-bold text-success">
              ${ingresosTotales.toLocaleString()}
            </h2>
            <p className="text-secondary mb-0">
              Total generado por ventas del día
            </p>
          </Card>
        </Col>

        {/* Card 3: Productos vendidos */}
        <Col md={4}>
          <Card className="text-center shadow-sm p-3 rounded-4">
            <h5 className="text-muted mb-2">Productos Vendidos</h5>
            <h2 className="fw-bold text-warning">{productosVendidos.length}</h2>
          </Card>
        </Col>
      </Row>

      <hr className="my-5" />

      {/* Tabla de detalle */}
      <h4 className="fw-semibold mb-3">📦 Detalle de Productos Vendidos</h4>
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>Producto</th>
            <th>Cantidad Vendida</th>
            <th>Total ($)</th>
          </tr>
        </thead>
        <tbody>
          {productosVendidos.map((item) => (
            <tr key={item.productoId}>
              <td>{item.nombre}</td>
              <td>{item.cantidadTotal}</td>
              <td>${item.totalProducto.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  );
}
