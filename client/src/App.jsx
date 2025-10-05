import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { AppRoutes } from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import { Container } from "react-bootstrap";

function App() {
  return (
    <Container>
      <AppRoutes />
      <Toaster />
    </Container>
  );
}

export default App;
