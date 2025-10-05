import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

export function UnauthorizedPage() {
  useEffect(() => {
    toast.error("No tienes permiso para acceder a esta página");
  }, []);

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center vh-100 text-center">
      <h2>Acceso denegado 🚫</h2>{" "}
      <Link to="/" className="btn btn-primary">
        Volver al inicio
      </Link>
    </Container>
  );
}
