import { Card, Button, ListGroup } from "react-bootstrap";

export function SaleCard({ sale, isAdmin, onEdit, onDelete }) {
  return (
    <Card style={{ width: "18rem" }} className="shadow-sm mb-3">
      <Card.Body>
        <Card.Title>Venta #{sale._id}</Card.Title>
        <Card.Text>
          <strong>Cajero:</strong>{" "}
          {sale.user?.username || sale.user?.username || "N/A"}
        </Card.Text>

        <Card.Text>
          <strong>Fecha:</strong>{" "}
          {new Date(sale.createdAt).toLocaleString("es-CO")}
        </Card.Text>

        <hr />

        <Card.Subtitle className="mb-2 text-muted">Productos</Card.Subtitle>
        <ListGroup variant="flush">
          {sale.products?.length > 0 ? (
            sale.products.map((item, idx) => (
              <ListGroup.Item key={idx}>
                <div className="d-flex justify-content-between">
                  <span>
                    {item.product?.name || "Producto"} x{item.quantity}
                  </span>
                  <span>${item.total?.toLocaleString("es-CO")}</span>
                </div>
              </ListGroup.Item>
            ))
          ) : (
            <ListGroup.Item>Sin productos</ListGroup.Item>
          )}
        </ListGroup>

        <hr />
        <Card.Text className="fw-bold">
          Total: ${sale.totalGeneral?.toLocaleString("es-CO")}
        </Card.Text>

        {isAdmin && (
          <div className="d-flex justify-content-between mt-2">
            <Button variant="warning" size="sm" onClick={() => onEdit?.(sale)}>
              Editar
            </Button>
            <Button variant="danger" size="sm" onClick={() => onDelete?.(sale)}>
              Eliminar
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
