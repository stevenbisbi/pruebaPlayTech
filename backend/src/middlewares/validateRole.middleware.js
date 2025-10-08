export const validateRoleAdmin = (req, res, next) => {
  console.log("Validating admin role");
  console.log(req.user);
  if (req.user.role !== "administrador") {
    return res
      .status(403)
      .json({ message: "Acceso denegado, necesita permisos de admin" });
  }

  next();
};

export const validateRoleCajero = (req, res, next) => {
  console.log("Validating cajero role");

  if (req.user.role !== "cajero") {
    return res
      .status(403)
      .json({ message: "Acceso denegado, necesita credenciales de cajero" });
  }

  next();
};
