import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Card, Container, Alert } from "react-bootstrap";
import {
  register as registerUser,
  updateUser,
  getUser,
} from "../../services/auth.api.js";

export function RegisterPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
      role: "cajero",
    },
  });

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const res = await getUser(id);
          reset({
            username: res.data.username,
            password: "",
            role: res.data.role,
          });
        } catch (error) {
          console.error("Error al cargar usuario:", error);
        }
      })();
    }
  }, [id, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (id) await updateUser(id, data);
      else await registerUser(data);
      navigate("/admin/users");
    } catch (error) {
      console.error(error);
      <Alert>
        {error.response?.data?.message || "Error al guardar usuario"}
      </Alert>;
    }
  });

  return (
    <Container className="d-flex justify-content-center align-items-start py-4">
      <Card
        className="p-4 shadow-lg border-0 w-100"
        style={{ maxWidth: "400px" }}
      >
        <h3 className="text-center mb-4">
          {id ? "Actualizar usuario" : "Crear usuario"}
        </h3>
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Usuario</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese un nombre de usuario"
              {...register("username", { required: true, minLength: 3 })}
            />
            {errors.username && (
              <small className="text-danger">
                Usuario requerido (min 3 caracteres)
              </small>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Ingrese una contraseña"
              {...register("password", { minLength: 6 })}
            />
            {errors.password && (
              <small className="text-danger">Contraseña min 6 caracteres</small>
            )}
            {id && (
              <small className="text-muted d-block mt-1">
                Dejar en blanco si no desea cambiarla
              </small>
            )}
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Rol</Form.Label>
            <Form.Select {...register("role", { required: true })}>
              <option value="administrador">Administrador</option>
              <option value="cajero">Cajero</option>
            </Form.Select>
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100">
            {id ? "Actualizar" : "Registrar"}
          </Button>
        </Form>
      </Card>
    </Container>
  );
}
