// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import {
  verifyToken,
  logout as logoutApi,
  loginUser,
} from "../services/auth.api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔹 Cerrar sesión
  // ✅ login debe encargarse de hacer la petición a la API y guardar la respuesta
  const login = async (credentials) => {
    const res = await loginUser(credentials);
    const data = res.data;
    console.log(data);
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
