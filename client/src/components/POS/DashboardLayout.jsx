// src/components/dashboard/DashboardLayout.jsx
import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
