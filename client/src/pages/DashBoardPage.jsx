import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { toast } from "react-hot-toast";

import { downloadDailyReport } from "../services/report.api";
import { getAllProducts } from "../services/product.api";
import { getAllSales } from "../services/sale.api";
import { useAuth } from "../context/AuthContext";

export const DashBoardPage = () => {
  const { user, logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    todaySales: 0,
    todayRevenue: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [productsRes, salesRes] = await Promise.all([
        getAllProducts(),
        getAllSales(),
      ]);
      const products = productsRes.data;
      const sales = salesRes.data;

      const today = new Date();
      const start = new Date(today.setHours(0, 0, 0, 0));
      const end = new Date(today.setHours(23, 59, 59, 999));

      const todaySalesArr = sales.filter((s) => {
        const saleDate = new Date(s.createdAt); // <--- usar createdAt
        return saleDate >= start && saleDate <= end;
      });

      const todayRevenue = todaySalesArr.reduce(
        (sum, s) => sum + (s.totalGeneral || 0),
        0
      );

      setStats({
        totalProducts: products.length,
        todaySales: todaySalesArr.length,
        todayRevenue,
      });
    } catch (error) {
      console.error("Error al cargar dashboard:", error);
      toast.error("Error cargando datos del dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async (format) => {
    try {
      const res = await downloadDailyReport(format);
      const file = new Blob([res.data], {
        type: format === "csv" ? "text/csv" : "application/pdf",
      });
      const url = window.URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.download =
        format === "csv" ? "reporte_diario.csv" : "reporte_diario.pdf";
      link.click();
      toast.success(`Reporte ${format.toUpperCase()} descargado`);
    } catch (err) {
      console.error(err);
      toast.error("Error al generar el reporte");
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("user");
    navigate("/", { replace: true });
    toast.success("Sesión cerrada exitosamente");
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando dashboard...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Card className="mb-4 border-0 shadow-sm bg-primary text-white">
        <Card.Body className="d-flex justify-content-between align-items-end">
          <div>
            <h1 className="display-5 mb-2">
              ¡Bienvenido, {user?.username}! 👋
            </h1>
            <p className="mb-1 opacity-75">
              {user?.role === "administrador"
                ? "Panel de administración completo"
                : "Panel de cajero - Sistema de punto de venta"}
            </p>
            <small className="opacity-75">
              {new Date().toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </small>
          </div>
          <Button variant="danger" size="sm" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </Card.Body>
      </Card>

      <Row className="mb-4">
        <Col xs={12} md={6} lg={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <Card.Subtitle className="text-muted mb-2">
                    Inventario
                  </Card.Subtitle>
                  <h2 className="mb-0 text-primary">{stats.totalProducts}</h2>
                  <small className="text-muted">Total de productos</small>
                </div>
                <div style={{ fontSize: "3rem" }}>📦</div>
              </div>
              <Button
                as={Link}
                to="/admin/products"
                variant="link"
                size="sm"
                className="p-0 text-decoration-none"
              >
                Ver inventario →
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={6} lg={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <Card.Subtitle className="text-muted mb-2">
                    Usuarios
                  </Card.Subtitle>
                  <Button
                    as={Link}
                    to="/admin/users"
                    variant="link"
                    size="sm"
                    className="p-0 text-decoration-none"
                    style={{ color: "#6f42c1" }}
                  >
                    Ver usuarios →
                  </Button>
                </div>
                <div style={{ fontSize: "3rem" }}>👥</div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={6} lg={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm card-bg">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <Card.Subtitle className="text-muted mb-2">
                    Ventas
                  </Card.Subtitle>
                  <h2 className="mb-0 text-success">{stats.todaySales}</h2>
                  <small className="text-muted">Transacciones hoy</small>
                </div>
                <div style={{ fontSize: "3rem" }}>🛒</div>
              </div>
              <Button
                as={Link}
                to="/admin/reports"
                variant="link"
                size="sm"
                className="p-0 text-decoration-none text-success"
              >
                Ir a caja →
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={6} lg={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <Card.Subtitle className="text-muted mb-2">
                    Ingresos Hoy
                  </Card.Subtitle>
                  <h2 className="mb-0" style={{ color: "#6f42c1" }}>
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      maximumFractionDigits: 0,
                    }).format(stats.todayRevenue)}
                  </h2>
                </div>
                <div style={{ fontSize: "3rem" }}>💰</div>
              </div>
              <Button
                variant="outline-success"
                size="sm"
                onClick={() => handleDownloadReport("pdf")}
              >
                Descargar PDF
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
