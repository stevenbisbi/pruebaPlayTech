import { Routes, Route } from "react-router-dom";

import { ProtectedRoute } from "./ProtectedRoute";
import POSPage from "../pages/PosPage.jsx";

export default function staffRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute roles={["cajero", "administrador"]} />}>
        <Route path="dashboard" element={<POSPage />} />
      </Route>
    </Routes>
  );
}
