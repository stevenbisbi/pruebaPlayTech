export const validateRoleAdmin = (req, res, next) => {
  console.log("Validating admin role");

  if (!req.user) {
    return res.status(401).json({ message: "Autenticación requerida" });
  }

  if (req.user.role !== "administrador") {
    return res.status(403).json({ message: "Acceso denegado" });
  }

  next();
};

export const validateRoleCajero = (req, res, next) => {
  console.log("Validating cajero role");

  if (!req.user) {
    return res.status(401).json({ message: "Autenticación requerida" });
  }

  if (req.user.role !== "cajero") {
    return res.status(403).json({ message: "Acceso denegado" });
  }

  next();
};
