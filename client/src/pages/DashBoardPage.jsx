// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Spinner,
} from "react-bootstrap";
import { toast } from "react-hot-toast";

import { downloadDailyReport } from "../services/report.api"; // importa la nueva función

import { getAllProducts } from "../services/product.api";
import { getAllSales } from "../services/sale.api";
import { useAuth } from "../context/AuthContext";

export const DashBoardPage = () => {
  const { user, logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    lowStock: 0,
    todaySales: 0,
    todayRevenue: 0,
    weekRevenue: 0,
    monthRevenue: 0,
  });
  const [recentSales, setRecentSales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

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
      toast.error("Error al generar el reporte");
      console.error(err);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [productsRes, salesRes] = await Promise.all([
        getAllProducts(),
        getAllSales(),
      ]);

      // Asegurar que siempre sean arrays
      const products = Array.isArray(productsRes.data?.data)
        ? productsRes.data.data
        : [];
      const allSales = Array.isArray(salesRes.data?.data)
        ? salesRes.data.data
        : [];

      const lowStockItems = products.filter((p) => p.stock < 20 && p.isActive);
      const activeProducts = products.filter((p) => p.isActive);

      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const weekSales = allSales.filter((s) => new Date(s.saleDate) >= weekAgo);
      const monthSales = allSales.filter(
        (s) => new Date(s.saleDate) >= monthAgo
      );

      const weekRevenue = weekSales.reduce((sum, s) => sum + s.totalAmount, 0);
      const monthRevenue = monthSales.reduce(
        (sum, s) => sum + s.totalAmount,
        0
      );

      const recent = allSales.slice(0, 5);

      const topSelling = allSales
        .flatMap((s) => s.items)
        .reduce((acc, item) => {
          acc[item.sku] = acc[item.sku] || {
            name: item.name,
            quantity: 0,
            revenue: 0,
          };
          acc[item.sku].quantity += item.quantity;
          acc[item.sku].revenue += item.price * item.quantity;
          return acc;
        }, {});

      const topProductsSorted = Object.values(topSelling)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

      setStats({
        totalProducts: products.length,
        activeProducts: activeProducts.length,
        lowStock: lowStockItems.length,
        todaySales: allSales.length,
        todayRevenue: allSales.reduce((sum, s) => sum + s.totalAmount, 0),
        weekRevenue,
        monthRevenue,
      });

      setRecentSales(recent);
      setTopProducts(topProductsSorted);
      setLowStockProducts(lowStockItems);
    } catch (error) {
      console.error("Error al cargar dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Cargando dashboard...</p>
        </div>
      </Container>
    );
  }

  const handleLogout = () => {
    logout(); // limpia el contexto
    localStorage.removeItem("user"); // borra el usuario almacenado
    navigate("/", { replace: true }); // redirige al login
    toast.success("Sesión cerrada exitosamente");
  };

  return (
    <Container fluid className="py-4">
      <Card className="mb-4 border-0 shadow-sm bg-primary text-white">
        <Card.Body className="p-4 d-flex justify-content-between align-items-end">
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
          <div className=" gap-4">
            <Button variant="danger" size="sm" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </div>
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
                  <small className="text-muted">
                    {stats.activeProducts} activos
                  </small>
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
                <div style={{ fontSize: "3rem" }}>⚠️</div>
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
                    Ventas Hoy
                  </Card.Subtitle>
                  <h2 className="mb-0 text-success">{stats.todaySales}</h2>
                  <small className="text-muted">Transacciones</small>
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
                    ${stats.todayRevenue.toFixed(2)}
                  </h2>
                  <small className="text-muted">Efectivo recaudado</small>
                </div>
                <div style={{ fontSize: "3rem" }}>💰</div>
              </div>
              <div className="d-flex gap-2 mt-2">
                <Button
                  variant="outline-success"
                  size="sm"
                  onClick={() => handleDownloadReport("pdf")}
                >
                  Descargar PDF
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
