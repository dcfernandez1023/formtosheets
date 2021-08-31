import React, { useState, useEffect } from 'react';

import {
  Container,
  Row,
  Col,
  Form,
  Modal,
  Button,
  ListGroup,
  Badge
} from 'react-bootstrap';

import MySpinner from './MySpinner.js';

const CONTROLLER = require('../controllers/formsController.js');

const MyForms = (props) => {

  const [forms, setForms] = useState();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if(props.userInfo === null || props.userInfo === undefined) {
      return;
    }
    CONTROLLER.getForms(props.userInfo.uid, setForms);
  }, [props.userInfo]);

  const onClickCreate = () => {
    if(forms.length >= 3) {
      setShow(true);
      return;
    }
    const callback = (newForm) => {
      window.location.pathname = "/formBuilder/" + newForm.id;
    };
    CONTROLLER.createNew(props.userInfo.uid, callback);
  }

  if(forms === undefined) {
    return (
      <MySpinner />
    );
  }
  return (
    <Container style={{width: "70%"}}>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title> Form Limit Reached </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Only a maximum of 3 forms are allowed while in Beta testing.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => setShow(false)}> Got it! </Button>
        </Modal.Footer>
      </Modal>
      <Row>
        <Col xs={8}>
          <h2> Your Forms </h2>
        </Col>
        <Col xs={4} style={{textAlign: "right"}}>
          <Button variant="success" onClick={onClickCreate}> + </Button>
        </Col>
      </Row>
      <br/>
      {forms.length == 0 ?
        <Row>
          <Col style={{textAlign: "center"}}>
            <p> Click the + button to create a form. </p>
          </Col>
        </Row>
      :
        <Row>
          <Col>
            <ListGroup>
              {forms.map((form) => {
                console.log(form);
                return (
                  <ListGroup.Item
                     key={form.id}
                     action
                     onClick={() => {window.location.pathname="/formBuilder/" + form.id}}
                  >
                    <Row>
                      <Col xs={8}>
                        {form.title}
                        {form.isPublished ?
                          <span>
                            <Badge style={{marginLeft:" 8px"}} pill bg="success">
                              Published
                            </Badge>
                            <Badge style={{marginLeft:" 8px"}} pill bg="warning">
                              {form.submits.length} submissions
                            </Badge>
                          </span>
                        :
                          <div></div>
                        }
                      </Col>
                      <Col xs={4} style={{textAlign: "right"}}>
                        {form.lastModified == 0 ?
                          <span> <small> <i> Not yet modified </i> </small> </span>
                        :
                          <span> <small> <i> Last Modified: {new Date(form.lastModified).toLocaleTimeString()} </i> </small> </span>
                        }
                      </Col>
                    </Row>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </Col>
        </Row>
      }
    </Container>
  );
}

export default MyForms;
