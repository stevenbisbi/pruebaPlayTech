# Manual de Instalación y Uso

## Sistema de Gestión de Inventario y Ventas

---

## Tabla de Contenidos

1. [Script de Base de Datos](#1-script-de-base-de-datos)
2. [Manual de Instalación](#2-manual-de-instalación)
3. [Guía de Uso del Sistema](#3-guía-de-uso-del-sistema)
4. [Ejemplos de Reportes](#4-ejemplos-de-reportes)
5. [API Endpoints](#5-api-endpoints)
6. [Solución de Problemas](#6-solución-de-problemas)
7. [Seguridad](#7-seguridad)

---

## 1. Script de Base de Datos

### 1.1 Consideraciones Importantes

**MongoDB crea las colecciones automáticamente** cuando utilizas Mongoose. No necesitas ejecutar scripts SQL como en bases de datos relacionales. Los schemas definidos son suficientes para:

- Definir la estructura de los documentos
- Aplicar validaciones
- Establecer relaciones entre colecciones

### 1.2 Colecciones que se crearán automáticamente

Basándose en los schemas, MongoDB creará estas colecciones:

```
- users              // Desde User.js
- products           // Desde Product.js
- sales              // Desde Sale.js
- reports            // Desde Report.js
- logsesionschemas   // Desde LogSesion.js
```

### 1.3 Script de Inicialización (Seed) - OPCIONAL

Este script es **opcional** pero muy útil para insertar datos de prueba y crear usuarios iniciales.

```javascript
// db/seed.js
import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import User from "../src/models/User.js";
import Product from "../src/models/Product.js";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/inventario_ventas";

const seedDatabase = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Conectado a MongoDB");

    // Limpiar colecciones existentes (OPCIONAL - solo para desarrollo)
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log("🗑️  Colecciones limpiadas");

    // Crear usuarios iniciales
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
```

### 1.4 ¿Cuándo usar el script de seed?

**SÍ, úsalo cuando:**

- Es la primera vez que ejecutas el proyecto
- Necesitas datos de prueba para desarrollo
- Quieres resetear la base de datos a un estado inicial
- Estás en un ambiente de desarrollo/testing

**NO lo uses cuando:**

- Ya tienes datos en producción
- Ya creaste usuarios y productos manualmente
- Estás en un ambiente de producción

### 1.5 Ejecución del seed

```bash
# Opción 1: Ejecutar directamente
node db/seed.js

# Opción 2: Agregar script en package.json
# En package.json agregar:
"scripts": {
  "start": "node src/index.js",
  "dev": "nodemon src/index.js",
  "seed": "node db/seed.js"
}

# Luego ejecutar:
npm run seed
```

---

## 2. Manual de Instalación

### 2.1 Requisitos Previos

- **Node.js** v16 o superior
- **MongoDB** v5 o superior (local o MongoDB Atlas)
- **npm** o **yarn**
- Navegador web moderno (Chrome, Firefox, Edge)

### 2.2 Instalación del Backend

```bash
# 1. Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
cd pruebaplaytech

# 2. Instalar dependencias del backend
cd backend
npm install

# 3. Configurar variables de entorno
# Crear archivo .env en la raíz del backend
```

**Contenido del archivo `.env`:**

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/inventario_ventas
JWT_SECRET=tu_secreto_super_seguro_cambialo_en_produccion
NODE_ENV=development
```

```bash
# 4. (OPCIONAL) Inicializar la base de datos con datos de prueba
node db/seed.js

# 5. Iniciar el servidor
npm run dev
```

El servidor estará corriendo en `http://localhost:4000`

### 2.3 Instalación del Frontend

```bash
# 1. Abrir nueva terminal y navegar a la carpeta frontend
cd frontend
npm install

# 2. Configurar variables de entorno
# Crear archivo .env en la raíz del frontend
```

**Contenido del archivo `.env` (frontend):**

```env
VITE_API_URL=http://localhost:4000/api
```

```bash
# 3. Iniciar la aplicación
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### 2.4 Estructura del Proyecto

```
pruebaplaytech/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── product.controller.js
│   │   │   ├── sale.controller.js
│   │   │   └── report.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   └── role.middleware.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   ├── Sale.js
│   │   │   ├── Report.js
│   │   │   └── LogSesion.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── product.routes.js
│   │   │   ├── sale.routes.js
│   │   │   └── report.routes.js
│   │   └── index.js
│   ├── db/
│   │   └── seed.js
│   ├── .env
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   ├── services/
    │   └── App.jsx
    ├── .env
    └── package.json
```

---

## 3. Guía de Uso del Sistema

### 3.1 Inicio de Sesión

1. Acceder a `http://localhost:5173`
2. Ingresar credenciales:

   - **Administrador:**
     - Usuario: `admin`
     - Contraseña: `admin123`
   - **Cajero:**
     - Usuario: `cajero1`
     - Contraseña: `cajero123`

3. El sistema registrará el intento de inicio de sesión
4. Si las credenciales son correctas, se redirigirá al dashboard correspondiente

### 3.2 Funcionalidades por Rol

#### **ROL: ADMINISTRADOR**

El administrador tiene acceso completo a todas las funcionalidades:

**A) Gestión de Inventario**

- **Crear productos:**

  - Navegar a "Inventario" → "Agregar Producto"
  - Completar formulario (código único, nombre, descripción, precio, stock)
  - Guardar producto

- **Editar productos:**

  - En la lista de productos, clic en botón "Editar"
  - Modificar campos necesarios
  - Guardar cambios

- **Eliminar productos:**

  - Clic en botón "Eliminar"
  - Confirmar eliminación

- **Listar productos:**
  - Ver todos los productos con su información completa
  - Buscar por código o nombre
  - Filtrar por disponibilidad

**B) Módulo de Caja**

- Acceso completo al módulo de ventas
- Registrar ventas como un cajero

**C) Reportes de Ventas**

- **Ver reportes diarios:**

  - Navegar a "Reportes"
  - Seleccionar fecha
  - Ver resumen de transacciones

- **Exportar reportes:**
  - Formato CSV: descarga archivo con extensión .csv
  - Formato PDF: genera documento PDF con diseño profesional

**D) Gestión de Usuarios**

- Crear nuevos usuarios (administradores o cajeros)
- Editar roles y contraseñas
- Ver logs de inicio de sesión

#### **ROL: CAJERO**

El cajero tiene acceso limitado:

**A) Consulta de Inventario (Solo lectura)**

- Ver lista completa de productos
- Consultar precios y disponibilidad
- Buscar productos por código o nombre
- **NO puede:** crear, editar ni eliminar productos

**B) Módulo de Caja (Acceso completo)**

- **Registrar ventas:**

  1. Navegar a "Caja"
  2. Buscar producto por código
  3. Agregar al carrito indicando cantidad
  4. Ver resumen en tiempo real:
     - Lista de productos agregados
     - Cantidad de cada producto
     - Precio total por producto
     - Total general de la compra
  5. Finalizar venta (botón "Completar Venta")

- **Validaciones automáticas:**
  - Verificación de stock disponible
  - Actualización automática de inventario
  - Generación de número de transacción único

**C) Restricciones**

- **NO tiene acceso a:** reportes, gestión de usuarios, configuración

### 3.3 Proceso de Venta Detallado

1. **Inicio de venta:**

   - Cajero accede al módulo "Caja"
   - Pantalla muestra carrito vacío

2. **Agregar productos:**

   - Ingresar código del producto (ej: PROD001)
   - Sistema muestra información del producto
   - Ingresar cantidad deseada
   - Clic en "Agregar"
   - Sistema valida stock disponible

3. **Resumen de compra:**

   - Tabla muestra:
     - Producto | Cantidad | Precio Unitario | Subtotal
   - Total general se actualiza automáticamente

4. **Modificar carrito:**

   - Aumentar/disminuir cantidad
   - Eliminar productos
   - Total se recalcula en tiempo real

5. **Finalizar venta:**

   - Clic en "Completar Venta"
   - Sistema:
     - Genera número de transacción
     - Reduce stock automáticamente
     - Guarda registro en base de datos
     - Muestra confirmación con detalles de venta

6. **Nueva venta:**
   - Carrito se limpia automáticamente
   - Listo para siguiente cliente

### 3.4 Generación de Reportes

**Para Administradores:**

1. **Acceder a reportes:**

   - Menu → "Reportes"

2. **Seleccionar período:**

   - Fecha específica o rango de fechas
   - Clic en "Generar Reporte"

3. **Visualizar datos:**

   - Número total de transacciones
   - Lista de productos vendidos
   - Cantidad por producto
   - Total de ingresos del día

4. **Exportar:**
   - **CSV:** archivo para Excel/hojas de cálculo
   - **PDF:** documento imprimible con formato profesional

### 3.5 Cierre de Sesión

- Clic en ícono de usuario (esquina superior derecha)
- Seleccionar "Cerrar Sesión"
- Sistema registra el cierre de sesión
- Redirección a pantalla de login

---

## 4. Ejemplos de Reportes

### 4.1 Reporte en Formato CSV

```csv
Reporte de Ventas - 04/10/2025

Resumen General
Número de Transacciones,15
Total de Ingresos,$450000

Detalle de Productos Vendidos
Código,Producto,Cantidad Vendida,Precio Unitario,Total
PROD001,Arroz,25,$2500,$62500
PROD002,Azúcar,18,$2000,$36000
PROD003,Aceite,12,$5000,$60000
PROD005,Café,20,$8000,$160000
PROD006,Leche,30,$3500,$105000
PROD010,Atún,15,$4500,$67500

Total General:,$450000
```

### 4.2 Reporte en Formato PDF

El reporte PDF incluye:

**Encabezado:**

- Logo de la empresa
- Título: "Reporte de Ventas Diario"
- Fecha de generación
- Período reportado

**Sección 1: Resumen General**

- Número de transacciones realizadas
- Total de ingresos del día
- Promedio por transacción

**Sección 2: Productos Vendidos**

Tabla con columnas:

- Código del producto
- Nombre del producto
- Cantidad vendida
- Precio unitario
- Total por producto

**Sección 3: Top 5 Productos**

- Gráfico de barras (opcional)
- Lista de productos más vendidos

**Pie de página:**

- Fecha y hora de generación
- Usuario que generó el reporte
- Número de página

---

## 5. API Endpoints

### Autenticación

```
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/verify
```

### Productos

```
GET    /api/products          (Todos los usuarios)
GET    /api/products/:id      (Todos los usuarios)
POST   /api/products          (Solo administrador)
PUT    /api/products/:id      (Solo administrador)
DELETE /api/products/:id      (Solo administrador)
```

### Ventas

```
GET  /api/sales               (Solo administrador)
GET  /api/sales/:id           (Cajero: solo sus ventas)
POST /api/sales               (Todos los usuarios autenticados)
```

### Reportes

```
GET  /api/reports             (Solo administrador)
GET  /api/reports/daily       (Solo administrador)
POST /api/reports/export/csv  (Solo administrador)
POST /api/reports/export/pdf  (Solo administrador)
```

---

## 6. Solución de Problemas

### Error de conexión a MongoDB

```bash
# Verificar que MongoDB esté corriendo
sudo systemctl status mongod  # Linux
brew services list | grep mongodb  # macOS

# Reiniciar MongoDB
sudo systemctl restart mongod  # Linux
brew services restart mongodb-community  # macOS
```

### Error de autenticación

- Verificar credenciales
- Ejecutar script de seed nuevamente
- Revisar token JWT en localStorage (herramientas del navegador)

### Stock insuficiente

- El sistema no permite ventas con stock insuficiente
- Administrador debe actualizar inventario

### Puertos en uso

```bash
# Cambiar puerto en .env
PORT=4001  # Backend
VITE_PORT=5174  # Frontend
```

### Variables de entorno no cargadas

```bash
# Verificar que los archivos .env existan
ls -la backend/.env
ls -la frontend/.env

# Reiniciar los servidores después de crear/modificar .env
```

---

## 7. Seguridad

- Contraseñas encriptadas con bcryptjs
- Tokens JWT con expiración
- Validación de roles en cada endpoint
- Protección contra inyección de código
- CORS configurado
- Registro de intentos de login
- Validación de entrada en todos los formularios

---

## 8. Notas Adicionales

### MongoDB Atlas (Alternativa Cloud)

Si prefieres usar MongoDB Atlas en lugar de instalación local:

1. Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crear un cluster gratuito
3. Obtener la cadena de conexión
4. Actualizar `.env`:

```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/inventario_ventas
```

### Despliegue en Producción

**Backend:**

- Heroku, Railway, Render, DigitalOcean
- Configurar variables de entorno en el hosting
- Usar MongoDB Atlas para la base de datos

**Frontend:**

- Vercel, Netlify, GitHub Pages
- Configurar VITE_API_URL con la URL del backend en producción

---

## 9. Contacto y Soporte

Para problemas técnicos o consultas:

- Revisar logs del servidor: `backend/logs/`
- Verificar consola del navegador (F12)
- Consultar documentación de MongoDB
- Revisar la consola del terminal para errores del backend

---

**Versión:** 1.0  
**Última actualización:** Octubre 2025  
**Stack Tecnológico:** MERN (MongoDB, Express, React, Node.js)
