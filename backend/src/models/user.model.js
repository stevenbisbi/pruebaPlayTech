import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: [3, "El codigo deber ser de almenos 3 caracteres"],
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: [3, "El usuario debe tener al menos 3 caracteres"],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
    },
    role: {
      type: String,
      enum: ["administrador", "cajero"],
      default: "cajero",
      required: true,
    },
    loginAttempts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
