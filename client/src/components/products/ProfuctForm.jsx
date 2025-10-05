// ProductForm.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import {
  createProduct,
  updateProduct,
  getProduct,
} from "../../services/product.api.js";

export function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // si existe id, es edición
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
      <div className="text-center m-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <Container className="p-4">
      <Row className="justify-content-center">
        <Col md={6}>
          <h3 className="mb-4">
            {isEdit ? "Editar Producto" : "Nuevo Producto"}
          </h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="code">
              <Form.Label>Código</Form.Label>
              <Form.Control
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="Código del producto"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nombre del producto"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descripción del producto"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="price">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Precio del producto"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="stock">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Cantidad en stock"
                required
              />
            </Form.Group>

            <div className="d-grid mt-3">
              <Button type="submit" variant="primary">
                {isEdit ? "Actualizar Producto" : "Crear Producto"}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
