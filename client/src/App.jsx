import "bootstrap/dist/css/bootstrap.min.css";
import { AppRoutes } from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <AppRoutes />
      <Toaster />
    </>
  );
}

export default App;
