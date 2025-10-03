import { createJwtToken } from "../common/jwt.js";
import bcrypt from "bcryptjs";

import User from "../models/user.model.js";

export const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const userFound = await User.findOne({ username });
    if (userFound)
      return res.status(400).json({ message: ["el usuario ya existe"] });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });

    const userSaved = await newUser.save();
    const token = await createJwtToken({ id: userSaved._id });
    res.cookie("token", token);
    res.json({ id: userSaved._id, username: userSaved.username });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const userFound = await User.findOne({ username });
    if (!userFound) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, userFound.password);

    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = await createJwtToken({ id: userFound._id });
    res.cookie("token", token);
    res.json({ id: userFound._id, username: userFound.username });
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

export const product = (req, res) => {
  res.send("product");
};
