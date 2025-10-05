import { useState } from "react";
import { getAllProducts, deleteProduct } from "../services/product.api.js";
import { useFetch } from "../hooks/useFetch.js";
import {
  Spinner,
  Alert,
  Row,
  Col,
  Button,
  Container,
  Modal,
} from "react-bootstrap";
import { ProductCard } from "../components/products/ProductCard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { toast } from "react-hot-toast";
import { Header } from "../components/common/Header.jsx";

export function ProductsPage() {
  const productFetch = useFetch(getAllProducts);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Modal de confirmación
  const [showConfirm, setShowConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const onDelete = (product) => {
    setProductToDelete(product);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    setShowConfirm(false);
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete._id, { user: user._id });
      toast.success("Producto eliminado");
      productFetch.triggerReload();
      setProductToDelete(null);
    } catch (error) {
      console.error(error);
      toast.error("Error al eliminar el producto");
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
    <>
      <Header title="Inventario" />
      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
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

      {/* Modal de Confirmación */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Seguro que quieres eliminar <strong>{productToDelete?.name}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
