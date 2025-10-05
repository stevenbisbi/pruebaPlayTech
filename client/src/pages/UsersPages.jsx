import { deleteUser, getAllUsers } from "../services/auth.api.js";
import { useFetch } from "../hooks/useFetch.js";
import { Spinner, Alert, Row, Col, Button, Container } from "react-bootstrap";
import { UserCard } from "../components/Users/UserCard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export function UsersPages() {
  console.log("estoy en pageSale");
  const userFetch = useFetch(getAllUsers);
  const navigate = useNavigate();
  const { user } = useAuth();

  const onDelete = async (User) => {
    const confirmDelete = window.confirm(
      `¿Seguro que quieres eliminar "${User.username}"?`
    );
    if (!confirmDelete) return;

    try {
      await deleteUser(User._id);
      alert("Usuario eliminado");
      userFetch.triggerReload();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar el usuario");
    }
  };

  const onEdit = (user) => {
    navigate(`/admin/User/edit/${user._id}`);
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
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Usuarios</h1>
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
  );
}
