import mongoose from "mongoose";

const LogSesionSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    isAutenticated: {
      type: Boolean,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const LogSesion = mongoose.model("logSesionSchema", LogSesionSchema);

export default LogSesion;
