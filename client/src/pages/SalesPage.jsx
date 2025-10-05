import { Spinner, Col, Alert, Row, Container } from "react-bootstrap";
import { useFetch } from "../hooks/useFetch.js";
import { getAllSales } from "../services/sale.api.js";
import { SaleCard } from "../components/sales/SaleCard.jsx";
import { Header } from "../components/common/Header.jsx";

export function SalesPage() {
  const salesFetch = useFetch(getAllSales);

  if (salesFetch.loading) {
    return (
      <div className="text-center my-5">
        <Spinner
          animation="grow"
          role="status"
          variant="warning"
          style={{ width: 80, height: 80 }}
        />
      </div>
    );
  }

  if (salesFetch.error) {
    return (
      <div className="text-center my-5">
        <Alert variant="danger">{salesFetch.error}</Alert>
      </div>
    );
  }

  return (
    <>
      <Header title="Ventas" />
      <Container className="py-4">
        <Row className="g-4">
          {salesFetch.data.map((sale) => (
            <Col xs={12} sm={6} md={4} lg={3} key={sale._id || sale.id}>
              <SaleCard sale={sale} />
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}
