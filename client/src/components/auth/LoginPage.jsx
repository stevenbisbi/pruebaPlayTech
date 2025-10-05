// src/components/auth/LoginPage.jsx
import { useState, useEffect } from "react";
import { Form, Button, Container, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/auth.api";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { login, isAuthenticated, user, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      if (user.role === "administrador") navigate("/admin/dashboard");
      else if (user.role === "cajero") navigate("/staff/dashboard");
      else navigate("/");
    }
  }, [isAuthenticated, user, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await loginUser({ username, password });
      const data = res.data;
      login(data);
      toast.success("Inicio de sesión exitoso");

      if (data.role === "administrador") navigate("/admin/dashboard");
      else if (data.role === "cajero") navigate("/staff/dashboard");
      else navigate("/");
    } catch (err) {
      const message =
        err.response?.data?.message || "Error en el inicio de sesión";
      setError(message);
      toast.error(message);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Verificando sesión...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "20px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <Card.Body>
          <h3 className="text-center mb-4">Iniciar Sesión</h3>

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

            <Button variant="primary" type="submit" className="w-100">
              Iniciar Sesión
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
