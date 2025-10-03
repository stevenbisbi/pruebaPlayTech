import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext.jsx";
import { useEffect } from "react";

import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signup, isAuthenticated, errors: registerErrors } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated]);

  const onSubmit = handleSubmit(async (data) => {
    signup(data);
  });
  return (
    <div>
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Usuario"
            {...register("username", { required: true, minLength: 3 })}
          />
          {errors.username && (
            <p className="text-danger">
              Usuario es requerido y debe tener al menos 3 caracteres
            </p>
          )}
          {registerErrors.map((error, i) => (
            <p key={i} className="text-danger m-2">
              {error}
            </p>
          ))}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Password"
            {...register("password", { required: true, minLength: 6 })}
          />
          {errors.password && (
            <p className="text-danger">
              la contraseña es requerido y debe tener al menos 3 caracteres
            </p>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Group className="mb-3">
            <Form.Select
              {...register("role", { required: true })}
              defaultValue="cajero"
            >
              <option value="administrador">Administrador</option>
              <option value="cajero">Cajero</option>
            </Form.Select>
          </Form.Group>
        </Form.Group>
        <Button variant="primary" type="submit">
          Registrar
        </Button>
      </Form>
    </div>
  );
}
