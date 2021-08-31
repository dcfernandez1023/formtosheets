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
  ListGroup,
  Button,
  Badge
} from 'react-bootstrap';

import Login from './Login.js';
import MyForms from './MyForms.js';
import MySpinner from './MySpinner.js';
import FormBuilder from './FormBuilder.js';
import PublishedForm from './PublishedForm.js';
import Tryout from './Tryout.js';
import Changelog from './Changelog.js';

const AUTH = require('../firebase/auth.js');

const Main = () => {

  const[userInfo, setUserInfo] = useState();
  const [tryOut, setTryOut] = useState(false);

  useEffect(() => {
    isUserSignedin();
  });

  const isUserSignedin = () => {
    const callback = (user) => {
      setUserInfo(user);
    }
    AUTH.isUserSignedin(callback);
  }

  const onClickTryOut = () => {
    setTryOut(true);
    window.location.pathname="/tryout";
  }

  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container fluid>
          <Navbar.Brand href="/">
            formtosheets
            <Badge style={{marginLeft: "6px"}} pill bg="secondary"> Beta Testing </Badge>
          </Navbar.Brand>
          <Nav className = "mr-auto">
          </Nav>
          {userInfo === null ?
            <div>
              <Button variant="light" style={{marginRight: "12px"}} onClick={AUTH.googleSignin}>
                Sign in
              </Button>
              <Button variant="light" style={{marginRight: "12px"}} onClick={onClickTryOut}>
                Try it out
              </Button>
              <Button variant="light" onClick={() => {window.open("https://formtosheets.com/0150b734-1ea9-44a2-9c1e-94052fc5b453", "_self")} }>
                Give Feedback
              </Button>
            </div>
          :
            <Nav>
              {userInfo === undefined ?
                <div></div>
              :
                <Dropdown>
                  <Dropdown.Toggle
                    variant="light"
                    style={{margin: "1%", float: "right"}}
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
                          <ListGroup.Item action onClick = {() => {window.open("https://formtosheets.com/0150b734-1ea9-44a2-9c1e-94052fc5b453", "_self")}}>
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
              }
            </Nav>
          }
        </Container>
      </Navbar>
      <br/>
      <br/>
      <Router>
        <Switch>
          <Route path="/changelog">
            <Changelog />
          </Route>
          <Route path="/tryout">
            <Tryout
              userInfo={{uid: "tryout"}}
              tryOut={true}
            />
          </Route>
          <Route path="/formBuilder/:formId">
            <FormBuilder
              userInfo={userInfo}
            />
          </Route>
          <Route path="/:formId">
            <PublishedForm
              userInfo={userInfo}
            />
          </Route>
          <Route path="/">
            {userInfo === null ?
              <Login
                googleSignin={AUTH.googleSignin}
                onClickTryOut={onClickTryOut}
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
