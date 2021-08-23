import React from 'react';
import {
  Container,
  Row,
  Col,
  Form
} from 'react-bootstrap';

import GoogleButton from 'react-google-button';

const Login = (props) => {
  return (
    <Container className="page-center">
      <Row>
        <Col>
          <GoogleButton
            type = "light"
            onClick = {props.googleSignin}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
