import { Routes, Route } from "react-router-dom";

import { LoginPage } from "../components/auth/LoginPage";
import { UnauthorizedPage } from "../pages/UnauthorizedPage";
import NotFound from "../components/common/NotFound";
import AdminRoutes from "./AdminRoutes";
import StaffRoutes from "./StaffRoutes";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/staff/*" element={<StaffRoutes />} />

      {/* Si no se encuentra ninguna ruta válida */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
