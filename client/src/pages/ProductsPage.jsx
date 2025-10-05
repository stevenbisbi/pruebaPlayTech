import {
  getAllProducts,
  updateProduct,
  deleteProduct,
} from "../services/product.api.js";
import { useFetch } from "../hooks/useFetch.js";
import { Spinner, Alert, Row, Col, Button } from "react-bootstrap";
import { ProductCard } from "../components/products/ProductCard";
import { ProductModal } from "../components/products/ProductModal.jsx";
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
      console.log(product._id);
      await deleteProduct(product._id, { user: user._id });
      alert("Producto eliminado");
      productFetch.triggerReload(); // Refresca la lista
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
      <div className="text-center  m-5">
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
      <div className="text-center m-5">
        <Alert variant="danger">{productFetch.error}</Alert>;
      </div>
    );
  }
  return (
    <div className="container-fluid p-4">
      <h1 className="text-center mb-4">Inventario</h1>
      <Button
        variant="success"
        size="sm"
        onClick={() => navigate("/admin/product/create")}
      >
        crear producto
      </Button>
      <Row className="g-4">
        {productFetch.data.map((item) => {
          return (
            <Col xs={6} sm={4} md={2} key={item._id}>
              <ProductCard item={item} onEdit={onEdit} onDelete={onDelete} />
            </Col>
          );
        })}
      </Row>

      <ProductModal
        selectedItem={productFetch.data.find(
          (p) => p._id === productFetch.selectedDataId
        )}
        show={!!productFetch.selectedDataId}
        handleClose={() => productFetch.setSelectedDataId(null)}
        onAddToCart={(cartItem) => console.log(cartItem)}
      />
      {/* Puedes usar selectedDataId para un modal */}
    </div>
  );
}
