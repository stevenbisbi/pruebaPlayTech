// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { verifyToken, logout as logoutApi } from "../services/auth.api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔹 Llamar esto cuando el usuario hace login
  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  // 🔹 Cerrar sesión
  const logout = async () => {
    await logoutApi();
    setUser(null);
    setIsAuthenticated(false);
  };

  // 🔹 Verificar token cuando se recarga la página
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await verifyToken(); // hace GET /profile
        setUser(res.data);
        setIsAuthenticated(true);
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
