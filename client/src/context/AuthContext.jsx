// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import {
  verifyToken,
  logout as logoutApi,
  loginUser,
} from "../services/auth.api";
import { useLocation } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  const login = async (credentials) => {
    const res = await loginUser(credentials);
    const data = res.data;
    setUser(data);
    setIsAuthenticated(true);
    return data; // para que el componente pueda usar la info del usuario
  };

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
        if (!res) return;
        setUser(res.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error verifying token:", error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    // ❌ No hacemos check en la página de login
    if (location.pathname !== "/") {
      checkLogin();
    } else {
      setLoading(false); // Si estamos en login, ya no estamos cargando
    }
  }, [location.pathname]);

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
