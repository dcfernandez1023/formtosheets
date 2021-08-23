import {
  Container,
  Row,
  Col,
  Spinner
} from 'react-bootstrap';

const MySpinner = () => {
  return (
    <Container>
      <Row>
        <Col style={{textAlign: "center", marginTop: "15px"}}>
          <Spinner animation="border"/>
        </Col>
      </Row>
    </Container>
  );
}

export default MySpinner;
