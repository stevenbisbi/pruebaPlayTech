import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 text-center">
      <h1 className="display-1 fw-bold">404</h1>
      <p className="fs-3">😕 Página no encontrada</p>
      <p className="lead">La ruta que estás buscando no existe.</p>
      <Link to="/" className="btn btn-primary">
        Volver al inicio
      </Link>
    </div>
  );
};

export default NotFound;
