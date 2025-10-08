import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const userFound = await User.findById(req.params.id);
    if (!userFound)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(userFound);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Solo actualizar contraseña si viene no vacía
    if (updateData.password) {
      const hashedPassword = await bcrypt.hash(updateData.password, 10);
      updateData.password = hashedPassword;
    } else {
      delete updateData.password;
    }

    const userFound = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!userFound)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.json(userFound);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Eliminar usuario
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
