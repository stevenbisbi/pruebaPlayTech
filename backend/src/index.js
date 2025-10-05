import app from "./app.js";
import { connectDB } from "./db.js";
import expressListEndpoints from "express-list-endpoints";

connectDB();

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");

  // Mueve esto aquí 👇
  const routes = expressListEndpoints(app);
  console.table(routes);
});
