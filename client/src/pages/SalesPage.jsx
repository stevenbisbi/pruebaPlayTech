// SalesPage.jsx
import { Spinner, Col, Alert, Card } from "react-bootstrap";
import { useFetch } from "../hooks/useFetch.js";
import { getAllSales } from "../services/sale.api.js";

export function SalesPage() {
  const salesFetch = useFetch(getAllSales);

  if (salesFetch.loading) {
    return (
      <div className="text-center m-5">
        <Spinner
          animation="grow"
          role="status"
          variant="warning"
          style={{ width: 80, height: 80 }}
        />
      </div>
    );
  }

  if (salesFetch.error) {
    return (
      <div className="text-center m-5">
        <Alert variant="danger">{salesFetch.error}</Alert>
      </div>
    );
  }

  for (let item of salesFetch.data) {
    return (
      <Col xs={12} md={6} lg={3} className="mb-3">
        <Card className="h-100 border-0 shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <Card.Subtitle className="text-muted mb-2">
                  Ingresos Hoy
                </Card.Subtitle>
                <h2 className="mb-0" style={{ color: "#6f42c1" }}></h2>
                <small className="text-muted">Efectivo recaudado</small>
              </div>
              <div style={{ fontSize: "3rem" }}>💰</div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    );
  }
}
