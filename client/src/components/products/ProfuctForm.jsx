import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Container, Card, Spinner } from "react-bootstrap";
import {
  createProduct,
  updateProduct,
  getProduct,
} from "../../services/product.api.js";

export function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    price: "",
    stock: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      getProduct(id)
        .then((res) => setFormData(res.data))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateProduct(id, formData);
      } else {
        await createProduct(formData);
      }
      navigate("/admin/products");
    } catch (error) {
      console.error(error);
      alert("Error al guardar el producto");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner
          animation="border"
          variant="warning"
          style={{ width: 80, height: 80 }}
        />
      </div>
    );
  }

  return (
    <Container className="d-flex justify-content-center align-items-start py-4">
      <Card
        className="p-4 shadow-lg border-0 w-100"
        style={{ maxWidth: "500px" }}
      >
        <h3 className="text-center mb-4">
          {isEdit ? "Editar Producto" : "Nuevo Producto"}
        </h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Código</Form.Label>
            <Form.Control
              type="text"
              name="code"
              placeholder="Código del producto"
              value={formData.code}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Nombre del producto"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              placeholder="Descripción del producto"
              value={formData.description}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Precio</Form.Label>
            <Form.Control
              type="number"
              name="price"
              placeholder="Precio del producto"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              name="stock"
              placeholder="Cantidad en stock"
              value={formData.stock}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100">
            {isEdit ? "Actualizar Producto" : "Crear Producto"}
          </Button>
        </Form>
      </Card>
    </Container>
  );
}
