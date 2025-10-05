// src/components/auth/LoginPage.jsx
import { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/auth.api"; // tu API de login
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await loginUser({ username, password });

      // Backend devuelve directamente el usuario con su rol
      const data = res.data;
      console.log("Respuesta login backend:", data);

      // Guardamos el usuario en el contexto
      login(data);

      toast.success("Inicio de sesión exitoso");

      // Redirigir según rol
      if (data.role === "administrador") navigate("/admin/dashboard");
      else if (data.role === "cajero") navigate("/staff/dashboard");
      else navigate("/"); // fallback
    } catch (err) {
      console.error("Error durante el inicio de sesión:", err);
      const message =
        err.response?.data?.message || "Error en el inicio de sesión";
      setError(message);
      toast.error(message);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }}>
          <h2 className="text-center mb-4">Iniciar Sesión</h2>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label>Usuario</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </Form.Group>

            <div className="d-grid">
              <Button variant="primary" type="submit">
                Iniciar Sesión
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
