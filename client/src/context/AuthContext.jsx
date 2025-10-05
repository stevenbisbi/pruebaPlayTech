import { createContext, useState, useContext } from "react";
import { register } from "../services/auth.api";
import PropTypes from "prop-types";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // aquí guardaremos username, id y role
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);

  const signup = async (userData) => {
    try {
      const res = await register(userData); // backend debería devolver id, username y role
      console.log(res.data);
      // guardar el usuario completo con role
      setUser({
        id: res.data.id,
        username: res.data.username,
        role: res.data.role, // <--- asegurarse de que venga del backend
      });
      setIsAuthenticated(true);
    } catch (error) {
      console.log(error);
      console.log(error.response?.data?.message);
      setErrors(error.response?.data?.message || ["Error en el registro"]);
    }
  };

  // ✅ Función de login
  const login = (userData) => {
    setUser({
      id: userData.id,
      username: userData.username,
      role: userData.role,
    });
    setIsAuthenticated(true);
  };

  return (
    <AuthContext.Provider
      value={{
        signup,
        login,
        user,
        isAuthenticated,
        errors,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
