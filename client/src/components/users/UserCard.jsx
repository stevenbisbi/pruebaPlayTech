import { Card, Button, Badge } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext.jsx";

export function UserCard({ userItem, onEdit, onDelete }) {
  const { user } = useAuth();
  if (!userItem) return null;

  const isAdmin = user?.role === "administrador";

  return (
    <Card className="h-100 shadow-sm border-0" style={{ minWidth: "14rem" }}>
      <Card.Body className="d-flex flex-column">
        <Card.Title className="mb-2">{userItem.username}</Card.Title>

        <div className="mb-2">
          <Badge bg="primary" className="me-1">
            Rol: {userItem.role}
          </Badge>
          <Badge bg="secondary">Login: {userItem.loginAttempts || 0}</Badge>
        </div>

        <Card.Text className="text-truncate mb-3" title={userItem.updatedAt}>
          Último login:{" "}
          {userItem.updatedAt
            ? new Date(userItem.updatedAt).toLocaleString()
            : "N/A"}
        </Card.Text>

        {isAdmin && (
          <div className="mt-auto d-flex justify-content-between">
            <Button
              variant="warning"
              size="sm"
              onClick={() => onEdit?.(userItem)}
              className="me-1 flex-fill"
            >
              Editar
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete?.(userItem)}
              className="flex-fill"
            >
              Eliminar
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
