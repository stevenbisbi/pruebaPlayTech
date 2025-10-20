import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";

const applySystemTheme = () => {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const setTheme = () => {
    document.documentElement.setAttribute(
      "data-bs-theme",
      mediaQuery.matches ? "dark" : "light"
    );
  };

  // Aplicar el tema inicial
  setTheme();
};

applySystemTheme();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
