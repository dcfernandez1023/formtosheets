import React from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  Figure,
  Button,
  Carousel
} from 'react-bootstrap';

import GoogleButton from 'react-google-button';
import ReactPlayer from 'react-player/youtube';

const Login = (props) => {
  return (
    <Container>
      <Row style={{marginTop: "50px"}}>
        <Col lg={6} style={{marginTop: "45px"}}>
          <Row>
            <Col>
              <h1 style={{marginBottom: "20px"}}> Build and host a form that writes to your Google Sheet in just a couple of minutes. </h1>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col>
              <GoogleButton
                type = "light"
                style={{width: "100%"}}
                onClick = {props.googleSignin}
              />
            </Col>
            <Col>
             <Button
                style={{width: "100%", height: "51px", boxShadow: "rgb(0 0 0 / 25%) 0px 2px 4px 0px", backgroundColor: "rgb(255, 255, 255)"}}
                variant="light"
                size="lg"
                onClick={props.onClickTryOut}
              >
                Try it out
              </Button>
            </Col>
          </Row>
        </Col>
        <Col lg={6} style={{textAlign: "center", marginTop: "20px"}}>
          <Col>
            <ReactPlayer
              url='https://www.youtube.com/watch?v=VpJTyvgQMoo'
              controls={true}
            />
          </Col>
        </Col>
      </Row>
      <br/>
      <br/>
      <br/>
      <Row>
        <Col>
        <Carousel variant="dark" style={{border: "1px solid lightGray"}}>
          <Carousel.Item>
            <img
              style={{height: "100%", width:" 100%"}}
              src="/form_builder.png"
            />
            <Carousel.Caption>
              <h3> Build and host a form </h3>
              <p> It only takes a few minutes to build and host your form. No need for writing code! </p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              style={{height: "100%", width:" 100%"}}
              src="/access_key.png"
            />
            <Carousel.Caption>
              <h3> Secure your Form </h3>
              <p> Publish your form with an access key so only people who know the key can view it. </p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              style={{height: "100%", width:" 100%"}}
              src="/sheet.png"
            />
            <Carousel.Caption>
              <h3> Link to Google Sheets </h3>
              <p> Direct your form submissions to your Google Sheet. </p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
        </Col>
      </Row>
      <br/>
      <div style={{height:"20vh"}}></div>
    </Container>
  );
}

export default Login;
