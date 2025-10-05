import { Routes, Route } from "react-router-dom";

import { ProtectedRoute } from "./ProtectedRoute";
import { RegisterPage } from "../components/auth/RegisterPage.jsx";
import POSPage from "../pages/PosPage.jsx";

export default function staffRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute roles={["cajero", "administrador"]} />}>
        <Route path="dashboard" element={<POSPage />} />
      </Route>
      <Route element={<ProtectedRoute roles={["cajero"]} />}>
        <Route path="register" element={<RegisterPage />} />
      </Route>

      {/* <Route path="user" element={<UsersPages />} />
      <Route path="user/edit/:id" element={<MenuAdminForm />} />
      <Route path="products" element={<ProductsPage />} />
      <Route path="products/create" element={<ItemAdminForm />} />
      <Route path="product/edit/:id" element={<ItemAdminForm />} />
      <Route path="sales" element={<SalePage />} />
      <Route path="sales/create" element={<TableAdminForm />} />
      <Route path="sale/edit/:id" element={<TableAdminForm />} />
      <Route path="reports" element={<ReportsPage />} />
      <Route path="reports/day" element={<UserAdminForm />} />
      <Route path="users/edit/:id" element={<UserAdminForm />} />
      <Route path="logs" element={<OrderAdminPage />} /> */}
    </Routes>
  );
}
