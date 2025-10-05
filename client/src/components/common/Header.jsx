import { Container, Navbar, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export function Header({ title }) {
  const navigate = useNavigate();

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm mb-4">
      <Container>
        <h5 className="mb-0">{title}</h5>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => navigate("/admin/dashboard")}
        >
          ← Volver al Dashboard
        </Button>
      </Container>
    </Navbar>
  );
}
