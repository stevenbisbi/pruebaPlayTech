import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ roles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" replace />;

  // Si hay roles específicos y el rol del usuario no está incluido
  if (roles && (!user.role || !roles.includes(user.role)))
    return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
}
