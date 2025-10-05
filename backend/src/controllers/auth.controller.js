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
    const token = await createJwtToken({
      id: userSaved._id,
      role: userSaved.role,
    });

    res.cookie("token", token, {
      httpOnly: true, // el frontend no puede acceder directamente
      secure: process.env.NODE_ENV === "production", // solo HTTPS en producción
      sameSite: "none", // necesario si tu frontend y backend están en dominios distintos
    });

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
  const { username, password } = req.body;

  try {
    const userFound = await User.findOne({ username });

    // Si el usuario no existe → registrar intento fallido
    if (!userFound) {
      await LogSesion.create({
        username,
        isAutenticated: false,
      });
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, userFound.password);

    // Si la contraseña no coincide → registrar intento fallido
    if (!isMatch) {
      await LogSesion.create({
        username,
        isAutenticated: false,
      });
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // Si el login es exitoso → registrar intento exitoso
    await LogSesion.create({
      username: userFound.username,
      isAutenticated: true,
    });

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
  const userFound = await User.findById(req.user.id);
  if (!userFound)
    return res.sendStatus(400).json({ message: "User not found" });
  res.send("profile");
};
