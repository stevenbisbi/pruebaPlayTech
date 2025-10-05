// src/components/dashboard/DashboardHeader.jsx
import { useAuth } from "../../context/AuthContext";
import { Button } from "react-bootstrap";

export default function DashboardHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h2 className="font-bold">Panel de Administración</h2>
      <div className="flex items-center gap-4">
        <span className="text-gray-600">👤 {user?.username}</span>
        <Button variant="danger" size="sm" onClick={logout}>
          Cerrar sesión
        </Button>
      </div>
    </header>
  );
}
