import { Routes, Route } from "react-router-dom";

import { ProtectedRoute } from "./ProtectedRoute";
import { DashBoardPage } from "../pages/DashBoardPage.jsx";
import { RegisterPage } from "../components/auth/RegisterPage.jsx";
import { ProductsPage } from "../pages/ProductsPage.jsx";
import { ProductForm } from "../components/products/ProfuctForm.jsx";
import { SalesPage } from "../pages/SalesPage.jsx";
import { UsersPages } from "../pages/UsersPages.jsx";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute roles={["administrador"]} />}>
        <Route path="dashboard" element={<DashBoardPage />} />
      </Route>
      <Route element={<ProtectedRoute roles={["administrador"]} />}>
        <Route path="register" element={<RegisterPage />} />
      </Route>
      <Route element={<ProtectedRoute roles={["administrador"]} />}>
        <Route path="products" element={<ProductsPage />} />
      </Route>
      <Route element={<ProtectedRoute roles={["administrador"]} />}>
        <Route path="product/create" element={<ProductForm />} />
      </Route>
      <Route element={<ProtectedRoute roles={["administrador"]} />}>
        <Route path="product/edit/:id" element={<ProductForm />} />
      </Route>
      <Route element={<ProtectedRoute roles={["administrador"]} />}>
        <Route path="reports" element={<SalesPage />} />
      </Route>
      <Route element={<ProtectedRoute roles={["administrador"]} />}>
        <Route path="users" element={<UsersPages />} />
      </Route>
    </Routes>
  );
}
