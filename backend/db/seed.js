// db/seed.js
import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import User from "../src/models/user.model.js";
import Product from "../src/models/product.model.js";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/inventario_ventas";

const seedDatabase = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Conectado a MongoDB");

    // Limpiar colecciones existentes
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log("🗑️  Colecciones limpiadas");

    // Crear usuarios
    const hashedPasswordAdmin = await bcryptjs.hash("admin123", 10);
    const hashedPasswordCajero = await bcryptjs.hash("cajero123", 10);

    const usuarios = await User.insertMany([
      {
        username: "admin",
        password: hashedPasswordAdmin,
        role: "administrador",
        loginAttempts: 0,
      },
      {
        username: "cajero1",
        password: hashedPasswordCajero,
        role: "cajero",
        loginAttempts: 0,
      },
    ]);

    console.log("👥 Usuarios creados:", usuarios.length);

    // Crear productos de ejemplo
    const productos = await Product.insertMany([
      {
        code: "PROD001",
        name: "arroz",
        description: "Arroz premium de 1kg",
        price: 2500,
        stock: 100,
      },
      {
        code: "PROD002",
        name: "azúcar",
        description: "Azúcar refinada de 1kg",
        price: 2000,
        stock: 80,
      },
      {
        code: "PROD003",
        name: "aceite",
        description: "Aceite vegetal de 1L",
        price: 5000,
        stock: 50,
      },
      {
        code: "PROD004",
        name: "sal",
        description: "Sal marina de 500g",
        price: 1500,
        stock: 120,
      },
      {
        code: "PROD005",
        name: "café",
        description: "Café molido de 250g",
        price: 8000,
        stock: 60,
      },
      {
        code: "PROD006",
        name: "leche",
        description: "Leche entera de 1L",
        price: 3500,
        stock: 90,
      },
      {
        code: "PROD007",
        name: "pan",
        description: "Pan integral tajado",
        price: 4000,
        stock: 40,
      },
      {
        code: "PROD008",
        name: "huevos",
        description: "Huevos por docena",
        price: 6000,
        stock: 75,
      },
      {
        code: "PROD009",
        name: "pasta",
        description: "Pasta de trigo de 500g",
        price: 3000,
        stock: 110,
      },
      {
        code: "PROD010",
        name: "atún",
        description: "Atún en lata de 170g",
        price: 4500,
        stock: 95,
      },
    ]);

    console.log("📦 Productos creados:", productos.length);

    console.log("\n✨ Base de datos inicializada correctamente\n");
    console.log("📋 Credenciales de acceso:");
    console.log("   Administrador -> username: admin, password: admin123");
    console.log("   Cajero -> username: cajero1, password: cajero123\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error al inicializar la base de datos:", error);
    process.exit(1);
  }
};

seedDatabase();
