import { createJwtToken } from "../common/jwt.js";
import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import LogSesion from "../models/logSesion.model.js";

export const register = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const userFound = await User.findOne({ username });
    if (userFound)
      return res.status(400).json({ message: ["el usuario ya existe"] });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role });

    const userSaved = await newUser.save();
    res.json({
      id: userSaved._id,
      username: userSaved.username,
      role: userSaved.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const userFound = await User.findOne({ username });

    if (!userFound) {
      await LogSesion.create({
        username,
        isAutenticated: false,
      });
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(password, userFound.password);

    if (!isMatch) {
      await LogSesion.create({
        username,
        isAutenticated: false,
      });
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }
    // Crear token
    const token = await createJwtToken({
      id: userFound._id,
      role: userFound.role,
    });

    res.cookie("token", token);
    res.json({
      id: userFound._id,
      username: userFound.username,
      role: userFound.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const logout = (req, res) => {
  res.cookie("token", "", { expires: new Date(0) });
  return res.sendStatus(200);
};
export const profile = async (req, res) => {
  try {
    const userFound = await User.findById(req.user.id);
    if (!userFound)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({
      id: userFound._id,
      username: userFound.username,
      role: userFound.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};
