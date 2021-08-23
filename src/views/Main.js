import React, { useState, useEffect } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import {
  Container,
  Navbar,
  Row,
  Col,
  Spinner,
  Nav,
  Dropdown,
  ListGroup
} from 'react-bootstrap';

import Login from './Login.js';
import MyForms from './MyForms.js';
import MySpinner from './MySpinner.js';
import FormBuilder from './FormBuilder.js';

const AUTH = require('../firebase/auth.js');

const Main = () => {

  const[userInfo, setUserInfo] = useState();

  useEffect(() => {
    isUserSignedin();
  });

  const isUserSignedin = () => {
    const callback = (user) => {
      setUserInfo(user);
    }
    AUTH.isUserSignedin(callback);
  }

  return (
    <div>
      <Navbar bg="light">
        <Container fluid>
          <Navbar.Brand href="/">
            <img
              src="/form.png"
              width="30"
              height="30"
              style={{marginRight: "5px"}}
            />
            formtosheets
          </Navbar.Brand>
          <Nav className = "mr-auto">
          </Nav>
          {userInfo === null || userInfo === undefined ?
            <div></div>
          :
            <Nav>
              <Dropdown>
                <Dropdown.Toggle
                  variant = "light"
                  style = {{margin: "1%", float: "right"}}
                >
                  👤
                </Dropdown.Toggle>
                <Dropdown.Menu align="end" style={{border: "1px solid gray"}}>
                  <Row>
                    <Col>
                      <ListGroup variant="flush">
                        <ListGroup.Item>
                          <Row>
                            <Col xs ={12} style = {{textAlign: "center"}}>
                              Signed in as:
                            </Col>
                          </Row>
                          <Row>
                            <Col style = {{textAlign: "center"}}>
                              <strong> {userInfo === undefined || userInfo === null ? "" : userInfo.email} </strong>
                            </Col>
                          </Row>
                        </ListGroup.Item>
                        <ListGroup.Item action onClick = {() => {window.location.pathname = "/changelog"}}>
                          View Changelog
                        </ListGroup.Item>
                        <ListGroup.Item action onClick = {() => {window.open()}}>
                          Submit Feedback
                        </ListGroup.Item>
                        <ListGroup.Item action onClick = {() => {AUTH.signout()}}>
                          Signout
                        </ListGroup.Item>
                      </ListGroup>
                    </Col>
                  </Row>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          }
        </Container>
      </Navbar>
      <br/>
      <Router>
        <Switch>
          <Route path="/formBuilder/:formId">
            <FormBuilder
              userInfo={userInfo}
            />
          </Route>
          <Route path="/">
            {userInfo === null ?
              <Login
                googleSignin={AUTH.googleSignin}
              />
            :
              <div>
                {userInfo === undefined ?
                  <MySpinner />
                :
                  <MyForms
                    userInfo={userInfo}
                  />
                }
              </div>
            }
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default Main;
