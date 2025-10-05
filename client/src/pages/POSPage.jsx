import "../POS.css";

import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Badge,
  ListGroup,
  InputGroup,
  Alert,
  Spinner,
  Modal,
} from "react-bootstrap";
import { toast } from "react-hot-toast";
import { getAllProducts } from "../services/product.api";
import { createSale } from "../services/sale.api";
import { useAuth } from "../context/AuthContext";

const POSPage = () => {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showClearCartModal, setShowClearCartModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts();
      setProducts(response.data);
    } catch (error) {
      toast.error("Error al cargar productos");
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("user");
    navigate("/", { replace: true });
    toast.success("Sesión cerrada exitosamente");
  };

  // Agregar producto al carrito
  const addToCart = (product) => {
    const existing = cart.find((item) => item._id === product._id);

    if (existing) {
      if (existing.quantity >= product.stock) {
        toast.warning(
          `Stock insuficiente. Solo hay ${product.stock} unidades disponibles`
        );
        return;
      }
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
      toast.success(`${product.name} agregado (+1)`, { autoClose: 1000 });
    } else {
      if (product.stock === 0) {
        toast.error("Producto sin stock");
        return;
      }
      setCart([...cart, { ...product, quantity: 1 }]);
      toast.success(`${product.name} agregado al carrito`);
    }
  };

  // Remover producto del carrito
  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item._id !== productId));
    toast.info("Producto eliminado del carrito");
  };

  const cop = (number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(number);

  // Actualizar cantidad
  const updateQuantity = (productId, newQuantity) => {
    const product = products.find((p) => p._id === productId);

    if (newQuantity > product.stock) {
      toast.warning(`Stock insuficiente. Solo hay ${product.stock} unidades`);
      return;
    }

    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(
      cart.map((item) =>
        item._id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Calcular totales
  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal();
  };

  const clearCart = () => {
    if (cart.length > 0) {
      setShowClearCartModal(true);
    }
  };

  const confirmClearCart = () => {
    setCart([]);
    setShowClearCartModal(false);
    toast.info("Carrito vaciado");
  };

  // Procesar pago
  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.warning("El carrito está vacío");
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmCheckout = async () => {
    setShowConfirmModal(false);
    setProcessingPayment(true);

    try {
      const response = await createSale({
        user: user._id, // id del cajero logueado
        products: cart.map((item) => ({
          product: item._id,
          quantity: item.quantity,
          total: item.price * item.quantity,
        })),
        totalGeneral: calculateTotal(),
      });

      toast.success("¡Venta completada exitosamente!", { autoClose: 3000 });

      // Limpiar carrito y recargar productos
      setCart([]);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al procesar venta");
    } finally {
      setProcessingPayment(false);
    }
  };

  // Filtrar productos
  const filteredProducts =
    products?.filter((p) => {
      const name = p?.name?.toLowerCase() || "";
      const code = p?.code?.toLowerCase() || "";
      return (
        name.includes(searchTerm.toLowerCase()) ||
        code.includes(searchTerm.toLowerCase())
      );
    }) || [];

  return (
    <Container fluid className="mt-5">
      <Row>
        {/* Panel de Productos */}
        <Col lg={8} className="mb-4">
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">🛍️ Productos Disponibles</h5>
            </Card.Header>
            <Card.Body>
              {/* Barra de búsqueda */}
              <InputGroup className="mb-3">
                <InputGroup.Text>🔍</InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Buscar por nombre o sku..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
                {searchTerm && (
                  <Button
                    variant="outline-secondary"
                    onClick={() => setSearchTerm("")}
                  >
                    ✕
                  </Button>
                )}
              </InputGroup>

              {/* Información de búsqueda */}
              {searchTerm && (
                <Alert variant="info" className="py-2">
                  <small>
                    Se encontraron {filteredProducts.length} producto(s) que
                    coinciden con "{searchTerm}"
                  </small>
                </Alert>
              )}

              {/* Grid de productos */}
              <div
                style={{
                  maxHeight: "600px",
                  overflowY: "auto",
                  paddingRight: "10px",
                }}
              >
                <Row xs={2} md={3} lg={4} className="g-3">
                  {filteredProducts.map((product) => (
                    <Col key={product._id}>
                      <Card
                        className={`h-100 product-card ${
                          product.stock === 0 ? "border-danger" : "border"
                        } hover-shadow`}
                        style={{
                          cursor: product.stock > 0 ? "pointer" : "not-allowed",
                          opacity: product.stock === 0 ? 0.6 : 1,
                          transition: "all 0.2s",
                        }}
                        onClick={() => product.stock > 0 && addToCart(product)}
                      >
                        <Card.Body className="p-3">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="mb-0 small">{product.name}</h6>
                            {product.stock < 10 && product.stock > 0 && (
                              <Badge bg="warning" text="dark" pill>
                                <small>¡Bajo!</small>
                              </Badge>
                            )}
                            {product.stock === 0 && (
                              <Badge bg="danger" pill>
                                <small>Agotado</small>
                              </Badge>
                            )}
                          </div>

                          <small className="text-muted d-block mb-2">
                            {product.code}
                          </small>

                          <div className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 text-primary">
                              {cop(product.price)}
                            </h5>
                            <Badge
                              bg={
                                product.stock > 10
                                  ? "success"
                                  : product.stock > 0
                                  ? "warning"
                                  : "secondary"
                              }
                              pill
                            >
                              {product.stock}
                            </Badge>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-5 text-muted">
                    <div style={{ fontSize: "4rem" }}>🔍</div>
                    <h5 className="mt-3">No se encontraron productos</h5>
                    <p>Intenta con otro término de búsqueda</p>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Panel del Carrito */}
        <Col lg={4}>
          <Card
            className="shadow-sm border-0 sticky-top"
            style={{ top: "20px" }}
          >
            <Card.Header className="bg-success text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">🛒 Carrito de Compra</h5>
                <Badge bg="light" text="dark" pill>
                  {cart.reduce((sum, item) => sum + item.quantity, 0)} items
                </Badge>
              </div>
            </Card.Header>

            <Card.Body className="p-0">
              {/* Lista de productos en el carrito */}
              <div
                style={{
                  maxHeight: "400px",
                  overflowY: "auto",
                }}
              >
                {cart.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <div style={{ fontSize: "4rem" }}>🛒</div>
                    <p className="mt-3">Carrito vacío</p>
                    <small>Selecciona productos para agregar</small>
                  </div>
                ) : (
                  <ListGroup variant="flush">
                    {cart.map((item) => (
                      <ListGroup.Item key={item._id}>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div className="flex-grow-1">
                            <h6 className="mb-1">{item.name}</h6>
                            <small className="text-muted">
                              {cop(item.price)}
                            </small>
                          </div>
                          <Button
                            variant="link"
                            size="sm"
                            className="text-danger p-0"
                            onClick={() => removeFromCart(item._id)}
                          >
                            ✕
                          </Button>
                        </div>

                        <div className="d-flex align-items-center justify-content-between">
                          <InputGroup size="sm" style={{ maxWidth: "130px" }}>
                            <Button
                              variant="outline-secondary"
                              onClick={() =>
                                updateQuantity(item._id, item.quantity - 1)
                              }
                            >
                              −
                            </Button>
                            <Form.Control
                              type="number"
                              value={item.quantity}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 0;
                                updateQuantity(item._id, val);
                              }}
                              className="text-center"
                              min="1"
                              max={item.stock}
                            />
                            <Button
                              variant="outline-secondary"
                              onClick={() =>
                                updateQuantity(item._id, item.quantity + 1)
                              }
                              disabled={item.quantity >= item.stock}
                            >
                              +
                            </Button>
                          </InputGroup>

                          <h6 className="mb-0 text-success">
                            {cop(item.price * item.quantity)}
                          </h6>
                        </div>

                        {item.quantity >= item.stock && (
                          <small className="text-danger d-block mt-1">
                            ⚠️ Cantidad máxima alcanzada
                          </small>
                        )}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </div>

              {/* Resumen de totales */}
              {cart.length > 0 && (
                <>
                  <div className="border-top p-3 bg-light">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal:</span>
                      <strong>{cop(calculateSubtotal())}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Items:</span>
                      <strong>
                        {cart.reduce((sum, item) => sum + item.quantity, 0)}
                      </strong>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between">
                      <h5 className="mb-0">TOTAL:</h5>
                      <h4 className="mb-0 text-success">
                        {cop(calculateTotal())}
                      </h4>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="p-3 border-top">
                    <Button
                      variant="success"
                      size="lg"
                      className="w-100 mb-2"
                      onClick={handleCheckout}
                      disabled={processingPayment || cart.length === 0}
                    >
                      {processingPayment ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            className="me-2"
                          />
                          Procesando...
                        </>
                      ) : (
                        <>💳 Finalizar Venta</>
                      )}
                    </Button>

                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="w-100"
                      onClick={clearCart}
                      disabled={processingPayment}
                    >
                      🗑️ Vaciar Carrito
                    </Button>
                  </div>
                </>
              )}
            </Card.Body>

            {/* Info del cajero */}
            <Card.Footer className="text-muted small">
              {/* Primera fila: cajero y hora */}
              <div className="d-flex justify-content-between mb-1">
                <span>
                  👤 Cajero: <strong>{user?.username}</strong>
                </span>
                <span>
                  {new Date().toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {/* Segunda fila: botón logout a la derecha */}
              <div className="d-flex justify-content-end">
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </Button>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>

      {/* Modal de Confirmación */}
      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
      >
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>Confirmar Venta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5 className="mb-3">Resumen de la Compra</h5>

          <ListGroup variant="flush" className="mb-3">
            {cart.map((item) => (
              <ListGroup.Item
                key={item._id}
                className="d-flex justify-content-between"
              >
                <div>
                  <strong>{item.name}</strong>
                  <br />
                  <small className="text-muted">
                    {item.quantity} x {cop(item.price)}
                  </small>
                </div>
                <strong className="text-success">
                  {cop(item.quantity * item.price)}
                </strong>
              </ListGroup.Item>
            ))}
          </ListGroup>

          <div className="bg-light p-3 rounded">
            <div className="d-flex justify-content-between mb-2">
              <span>Total Items:</span>
              <strong>
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </strong>
            </div>
            <div className="d-flex justify-content-between">
              <h5 className="mb-0">Total a Pagar:</h5>
              <h4 className="mb-0 text-success">
                {new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                  maximumFractionDigits: 0,
                }).format(calculateTotal())}
              </h4>
            </div>
          </div>

          <Alert variant="info" className="mt-3 mb-0">
            <small>
              ℹ️ Esta acción registrará la venta y actualizará el inventario
              automáticamente.
            </small>
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            Cancelar
          </Button>
          <Button variant="success" onClick={confirmCheckout}>
            ✓ Confirmar Venta
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showClearCartModal}
        onHide={() => setShowClearCartModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Vaciar Carrito</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Deseas vaciar todo el carrito de compras?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowClearCartModal(false)}
          >
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmClearCart}>
            Vaciar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default POSPage;
