// src/components/admin/ProductModal.jsx
import { Modal, Button, Row } from "react-bootstrap";
import { useState, useEffect } from "react";

export function ProductModal({ selectedItem, show, handleClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState([]);

  // Reset state cuando cambia el producto
  useEffect(() => {
    setQuantity(1);
    setSelectedOptions([]);
  }, [selectedItem]);

  if (!selectedItem) return null; // Evita crash si no hay producto seleccionado

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const toggleOption = (option) => {
    setSelectedOptions((prev) => {
      const exists = prev.find((opt) => opt.id === option.id);
      return exists
        ? prev.filter((opt) => opt.id !== option.id)
        : [...prev, option];
    });
  };

  const price = selectedItem.is_promotion
    ? selectedItem.price * 0.75 * quantity
    : selectedItem.price * quantity;

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-center">
          {selectedItem.name}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="container-fluid p-2">
        <div className="row">
          <div className="col-md-12 d-flex justify-content-center mb-3">
            <img
              src={selectedItem.image || ""}
              alt={selectedItem.name}
              className="img-fluid rounded"
              style={{ width: "100%", height: "200px", objectFit: "cover" }}
            />
          </div>

          <div
            className="col-12 p-3 text-center overflow-auto"
            style={{ maxHeight: "60vh" }}
          >
            <p>
              <strong>Descripción:</strong>
            </p>
            <p className="text-muted">
              {selectedItem.description || "Sin descripción"}
            </p>

            {Array.isArray(selectedItem.options) &&
            selectedItem.options.length > 0 ? (
              <>
                <p>
                  <strong>Adiciones</strong>
                </p>
                <div className="d-flex flex-wrap justify-content-center">
                  {selectedItem.options.map((opt) => (
                    <Button
                      key={opt.id}
                      onClick={() => toggleOption(opt)}
                      variant={
                        selectedOptions.some((o) => o.id === opt.id)
                          ? "primary"
                          : "outline-secondary"
                      }
                      className="m-1 d-flex align-items-center"
                    >
                      {opt.image_url && (
                        <img
                          src={opt.image_url}
                          alt={opt.name}
                          className="me-2"
                          style={{ width: "30px" }}
                        />
                      )}
                      {opt.name}
                    </Button>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-muted">Sin opciones</p>
            )}
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-3">
          {selectedItem.is_promotion && (
            <s className="text-dark my-auto">
              $ {selectedItem.price * quantity}
            </s>
          )}
          <p className="text-danger fs-5 my-auto">
            $ {price.toLocaleString("es-CO")}
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <Button
            variant="light"
            className="rounded-circle shadow-sm"
            style={{ width: "40px", height: "40px" }}
            onClick={handleDecrement}
          >
            <strong>-</strong>
          </Button>
          <span className="fs-5">{quantity}</span>
          <Button
            variant="light"
            className="rounded-circle shadow-sm"
            style={{ width: "40px", height: "40px" }}
            onClick={handleIncrement}
          >
            <strong>+</strong>
          </Button>
          <Button
            variant="warning"
            onClick={() => {
              onAddToCart?.({ item: selectedItem, quantity, selectedOptions });
              handleClose();
            }}
          >
            Agregar al carrito
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
