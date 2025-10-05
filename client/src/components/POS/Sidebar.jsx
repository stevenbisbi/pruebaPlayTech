// src/components/dashboard/Sidebar.jsx
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-md">
      <nav className="p-4">
        <ul className="space-y-4">
          <li>
            <Link
              to="/admin/dashboard"
              className="block hover:text-blue-600 font-medium"
            >
              Inicio
            </Link>
          </li>
          <li>
            <Link
              to="/admin/users"
              className="block hover:text-blue-600 font-medium"
            >
              Usuarios
            </Link>
          </li>
          <li>
            <Link
              to="/admin/settings"
              className="block hover:text-blue-600 font-medium"
            >
              Configuración
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
