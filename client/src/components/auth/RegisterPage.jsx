import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext.jsx";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card, Container, Alert } from "react-bootstrap";

export function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { signup, user, registerErrors } = useAuth();
  const navigate = useNavigate();

  // Si el usuario ya está logueado, lo redirigimos
  useEffect(() => {
    if (user) {
      if (user.role === "administrador") {
        navigate("/admin/dashboard");
      } else {
        navigate("/cajero/dashboard");
      }
    }
  }, [user, navigate]);

  const onSubmit = handleSubmit(async (data) => {
    await signup(data);
  });

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 shadow-lg border-0" style={{ width: "380px" }}>
        <h3 className="text-center mb-4 fw-bold">Crear cuenta</h3>

        {/* Mostrar errores globales del registro */}
        {registerErrors &&
          registerErrors.map((error, i) => (
            <Alert key={i} variant="danger" className="py-2">
              {error}
            </Alert>
          ))}

        <Form onSubmit={onSubmit}>
          {/* Usuario */}
          <Form.Group className="mb-3">
            <Form.Label>Usuario</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese un nombre de usuario"
              {...register("username", { required: true, minLength: 3 })}
            />
            {errors.username && (
              <small className="text-danger">
                Usuario es requerido y debe tener al menos 3 caracteres
              </small>
            )}
          </Form.Group>

          {/* Contraseña */}
          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Ingrese una contraseña"
              {...register("password", { required: true, minLength: 6 })}
            />
            {errors.password && (
              <small className="text-danger">
                La contraseña es requerida y debe tener al menos 6 caracteres
              </small>
            )}
          </Form.Group>

          {/* Rol */}
          <Form.Group className="mb-4">
            <Form.Label>Rol</Form.Label>
            <Form.Select {...register("role", { required: true })}>
              <option value="administrador">Administrador</option>
              <option value="cajero">Cajero</option>
            </Form.Select>
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100">
            Registrar
          </Button>
        </Form>
      </Card>
    </Container>
  );
}
