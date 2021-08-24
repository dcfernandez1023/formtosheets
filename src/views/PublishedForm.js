import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

import MySpinner from './MySpinner.js';

import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Alert,
  InputGroup
} from 'react-bootstrap';

import NotFound from './404.js';

const CONTROLLER = require('../controllers/formsController.js');

const PublishedForm = (props) => {
  let { formId } = useParams();

  const [form, setForm] = useState();
  const [validated, setValidated] = useState(false);
  const [data, setData] = useState({});
  const [accessGranted, setAccessGranted] = useState();
  const [accessKeyVal, setAccessKeyVal] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    CONTROLLER.getPublishedForm(formId, (res) => {
      setForm(res);
      initData(res);
    });
  }, [props.userInfo]);

  const initData = (res) => {
    if(res === null || res === undefined) {
      return;
    }
    var copy = Object.assign({}, data);
    for(var i = 0; i < res.elements.length; i++) {
      var element = res.elements[i];
      copy[element.id] = {name: "", value: ""};
    }
    if(res.isPrivate) {
      setAccessGranted(false);
    }
    else {
      setAccessGranted(true);
    }
    setData(copy);
  }

  const onChangeForm = (id, e) => {
    var copy = Object.assign({}, data);
    copy[id] = {name: e.target.name, value: e.target.value};
    setValidated(false);
    setData(copy);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidated(true);
    var copy = Object.assign({}, data);
    var valid = true;
    for(var i = 0; i < form.elements.length; i++) {
      var element = form.elements[i];
      if(element.required && copy[element.id].value.trim().length == 0) {
        valid = false;
        copy[element.id].value = "";
      }
    }
    if(!valid) {
      setData(copy);
      return;
    }
    else {
      // TODO: call google sheets API
      alert("Success");
    }
  }

  const validateAccessKey = () => {
    if(accessKeyVal === form.accessKey) {
      setAccessGranted(true);
    }
    else {
      setShowAlert(true);
    }
  }

  const renderForm = () => {
    return form.elements.map((metadata, index) => {
      if(metadata.type === "INPUT") {
        return (
          <Col md={metadata.columns} key={metadata.id + "-col"} className="form-builder-col-spacing">
            <Form.Label> {metadata.label} </Form.Label>
            <Form.Control
              id={metadata.id}
              value={data[metadata.id] === undefined ? "" : data[metadata.id].value}
              as="input"
              required={metadata.required}
              placeholder={metadata.placeholder}
              onChange={(e) => onChangeForm(metadata.id, e)}
            />
          </Col>
        );
      }
      else if(metadata.type === "SELECT") {
        return (
          <Col md={metadata.columns} key={metadata.id + "-col"} className="form-builder-col-spacing">
            <Form.Label> {metadata.label} </Form.Label>
            <Form.Select
              id={metadata.id}
              value={data[metadata.id] === undefined ? "" : data[metadata.id].value}
              onChange={(e) => onChangeForm(metadata.id, e)}
            >
              <option selected value=""> Select </option>
              {metadata.options.map((option, index) => {
                if(option.display.trim().length == 0) {
                  return <div></div>
                }
                return (
                  <option key={metadata.id + index.toString()} value={option.value}> {option.display} </option>
                );
              })}
            </Form.Select>
          </Col>
        );
      }
      else if(metadata.type === "RADIO") {
        return (
          <Col md={metadata.columns} key={metadata.id + "-col"} className="form-builder-col-spacing" >
            <Form.Label style={{marginRight: "10px"}}> {metadata.mainLabel} </Form.Label>
            <Form.Check
              inline
              id={metadata.id + "radio1"}
              label={metadata.label1}
              type="radio"
              name={"radioGroup" + index.toString()}
              value={metadata.value1}
              required={metadata.required}
              onChange={(e) => onChangeForm(metadata.id, e)}
            />
            <Form.Check
              inline
              id={metadata.id + "radio2"}
              label={metadata.label2}
              type="radio"
              name={"radioGroup" + index.toString()}
              value={metadata.value2}
              required={metadata.required}
              onChange={(e) => onChangeForm(metadata.id, e)}
            />
          </Col>
        );
      }
      else if(metadata.type === "TEXTAREA") {
        return (
          <Col
            md={metadata.columns}
            key={metadata.id + "-col"}
            className="form-builder-col-spacing"
            >
            <Form.Label> {metadata.label} </Form.Label>
            <Form.Control
              id={metadata.id}
              value={data[metadata.id] === undefined ? "" : data[metadata.id].value}
              as="textarea"
              rows={metadata.rows}
              required={metadata.required}
              placeholder={metadata.placeholder}
              onChange={(e) => onChangeForm(metadata.id, e)}
            />
          </Col>
        );
      }
    });
  }

  if(form === null) {
    return (
      <NotFound />
    );
  }
  if(form === undefined) {
    return (
      <MySpinner />
    );
  }
  if(accessGranted === false) {
    return (
      <Container style={{width: "40%", textAlign: "center"}}>
        <h4 style={{marginTop: "100px"}}> Access Key Required to View {"'" + form.title + "'"} </h4>
        <br/>
        <Row>
          <Col>
            <InputGroup>
              <Form.Control
                name="accessKey"
                type="password"
                value={accessKeyVal}
                placeholder="Enter access key"
                onChange={(e) => setAccessKeyVal(e.target.value)}
              />
              <Button variant="info" onClick={validateAccessKey}> Enter </Button>
            </InputGroup>
          </Col>
        </Row>
        <br/>
        <Row>
          <Col>
            {showAlert ?
              <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
                <h5> The access key you entered is invalid. </h5>
              </Alert>
            :
            <div></div>
            }
          </Col>
        </Row>
      </Container>
    );
  }
  return (
    <Container style={{width: "70%"}}>
      <Row>
        <Col>
          <br/>
          <Form onSubmit={handleSubmit} noValidate validated={validated}>
            <Row>
              <Col style={{textAlign: "center"}}>
                <h2> {form.title} </h2>
              </Col>
            </Row>
            <br/>
            <Row>
              {renderForm()}
            </Row>
            <hr/>
            <Row>
              <Col style={{textAlign: "center"}}>
                <Button type="submit" variant="success"> Submit </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default PublishedForm;
