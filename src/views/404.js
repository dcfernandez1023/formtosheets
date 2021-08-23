import {
  Container,
  Row,
  Col
} from 'react-bootstrap';

const NotFound = () => {
  return (
    <Container>
      <Row>
        <Col style={{textAlign: "center"}}>
          <h3> 404 Not Found </h3>
        </Col>
      </Row>
    </Container>
  );
}

export default NotFound;
