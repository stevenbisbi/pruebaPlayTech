import User from "../models/user.model.js";

// Todos los usuarios (solo admin)
export const getUsers = async (req, res) => {
  try {
    if (req.user.role !== "administrador")
      return res.status(403).json({ message: "Acceso denegado" });

    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener usuario por ID
export const getUser = async (req, res) => {
  try {
    // Admin puede ver cualquier usuario, otro usuario solo puede ver su propio perfil
    if (req.user.role !== "administrador" && req.user.id !== req.params.id)
      return res.status(403).json({ message: "Acceso denegado" });

    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar usuario
export const updateUser = async (req, res) => {
  try {
    if (req.user.role !== "administrador" && req.user.id !== req.params.id)
      return res.status(403).json({ message: "Acceso denegado" });

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar usuario
export const deleteUser = async (req, res) => {
  try {
    if (req.user.role !== "administrador" && req.user.id !== req.params.id)
      return res.status(403).json({ message: "Acceso denegado" });

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
