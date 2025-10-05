// src/components/admin/ProductCard.jsx
import { Card, Button } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext.jsx";

export function ProductCard({ item, onEdit, onDelete }) {
  const { user } = useAuth();

  if (!item) return null;

  // Solo el administrador puede ver los botones
  const isAdmin = user?.role === "administrador";

  return (
    <Card style={{ width: "15rem" }} className="shadow-sm">
      <Card.Body>
        <Card.Title>{item.name}</Card.Title>
        <Card.Text>Code: {item.code || "N/A"}</Card.Text>
        <Card.Text>Description: {item.description || "N/A"}</Card.Text>
        <Card.Text>Stock: {item.stock || "N/A"}</Card.Text>

        {isAdmin && (
          <div className="d-flex justify-content-between mt-2">
            <Button variant="warning" size="sm" onClick={() => onEdit?.(item)}>
              Editar
            </Button>
            <Button variant="danger" size="sm" onClick={() => onDelete?.(item)}>
              Eliminar
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
