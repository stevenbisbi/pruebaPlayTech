import { getAllProducts, deleteProduct } from "../services/product.api.js";
import { useFetch } from "../hooks/useFetch.js";
import { Spinner, Alert, Row, Col, Button, Container } from "react-bootstrap";
import { ProductCard } from "../components/products/ProductCard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export function ProductsPage() {
  const productFetch = useFetch(getAllProducts);
  const navigate = useNavigate();
  const { user } = useAuth();

  const onDelete = async (product) => {
    const confirmDelete = window.confirm(
      `¿Seguro que quieres eliminar "${product.name}"?`
    );
    if (!confirmDelete) return;

    try {
      await deleteProduct(product._id, { user: user._id });
      alert("Producto eliminado");
      productFetch.triggerReload();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar el producto");
    }
  };

  const onEdit = (product) => {
    navigate(`/admin/product/edit/${product._id}`);
  };

  if (productFetch.loading) {
    return (
      <div className="text-center mt-5">
        <Spinner
          animation="grow"
          role="status"
          variant="warning"
          style={{ width: 80, height: 80 }}
        />
      </div>
    );
  }

  if (productFetch.error) {
    return (
      <div className="text-center mt-5">
        <Alert variant="danger">{productFetch.error}</Alert>
      </div>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Inventario</h1>
        <Button
          variant="success"
          onClick={() => navigate("/admin/product/create")}
        >
          Crear producto
        </Button>
      </div>

      <Row className="g-4">
        {productFetch.data.map((item) => (
          <Col xs={12} sm={6} md={4} lg={3} key={item._id}>
            <ProductCard item={item} onEdit={onEdit} onDelete={onDelete} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
