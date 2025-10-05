import { Card, ListGroup, Badge } from "react-bootstrap";

export function SaleCard({ sale }) {
  if (!sale) return null;

  return (
    <Card
      className="shadow-sm mb-3 border-0 sale-card"
      style={{ transition: "transform 0.2s" }}
    >
      <Card.Body>
        <Card.Title className="mb-3 text-warning fw-bold">
          Venta #{sale._id || sale.id}
        </Card.Title>
        <Card.Text>
          <strong>Cajero:</strong> {sale.user?.username || "N/A"}
        </Card.Text>

        <Card.Text>
          <strong>Fecha:</strong>{" "}
          {new Date(sale.createdAt).toLocaleString("es-CO")}
        </Card.Text>

        <hr />

        <Card.Subtitle className="mb-2 text-muted fw-semibold">
          Productos
          {console.log(sale)}
        </Card.Subtitle>
        <ListGroup variant="flush">
          {(sale.products || []).length > 0 ? (
            (sale.products || []).map((p, idx) => (
              <ListGroup.Item
                key={idx}
                className="d-flex justify-content-between align-items-center px-0"
              >
                <span>
                  {p.productName || p.product?.name || "Producto Eliminado"} x{" "}
                  {p.quantity}
                </span>
                <Badge bg="success" pill>
                  ${p.total?.toLocaleString("es-CO") || 0}
                </Badge>
              </ListGroup.Item>
            ))
          ) : (
            <ListGroup.Item className="px-0">Sin productos</ListGroup.Item>
          )}
        </ListGroup>

        <hr />
        <Card.Text className="fw-bold fs-5 text-end">
          Total:{" "}
          <Badge bg="warning" text="dark">
            ${sale.totalGeneral?.toLocaleString("es-CO")}
          </Badge>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
