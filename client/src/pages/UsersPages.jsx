import { useState } from "react";
import { deleteUser, getAllUsers } from "../services/auth.api.js";
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
import { UserCard } from "../components/Users/UserCard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { toast } from "react-hot-toast";
import { Header } from "../components/common/Header.jsx";

export function UsersPages() {
  const userFetch = useFetch(getAllUsers);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Estados para el modal de confirmación
  const [showConfirm, setShowConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Abrir modal al eliminar
  const onDelete = (User) => {
    setUserToDelete(User);
    setShowConfirm(true);
  };

  // Confirmar eliminación
  const confirmDelete = async () => {
    setShowConfirm(false);
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete._id);
      toast.success("Usuario eliminado");
      userFetch.triggerReload();
      setUserToDelete(null);
    } catch (error) {
      console.error(error);
      toast.error("Error al eliminar el usuario");
    }
  };

  const onEdit = (user) => {
    navigate(`/admin/user/edit/${user._id}`);
  };

  if (userFetch.loading) {
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

  if (userFetch.error) {
    return (
      <div className="text-center mt-5">
        <Alert variant="danger">{userFetch.error}</Alert>
      </div>
    );
  }

  return (
    <>
      <Header title="Usuarios" />
      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Button variant="success" onClick={() => navigate("/admin/register")}>
            Registrar usuario
          </Button>
        </div>

        <Row className="g-4">
          {userFetch.data.map((item) => (
            <Col xs={12} sm={6} md={4} lg={3} key={item._id}>
              <UserCard userItem={item} onEdit={onEdit} onDelete={onDelete} />
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
          ¿Seguro que quieres eliminar a{" "}
          <strong>{userToDelete?.username}</strong>?
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
