import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";

import MySpinner from './MySpinner.js';

import {
  Container,
  Row,
  Col,
  Modal,
  Form,
  Button,
  Spinner
} from 'react-bootstrap';

import NotFound from './404.js';

const Preview = (props) => {

  const [validated, setValidated] = useState(false);
  const [data, setData] = useState({});
  const [show, setShow] = useState(false);

  useEffect(() => {
    if(props.form !== null && props.form !== undefined) {
      initData();
    }
  }, [props.form]);

  const initData = () => {
    var copy = Object.assign({}, data);
    for(var i = 0; i < props.form.elements.length; i++) {
      var element = props.form.elements[i];
      copy[element.id] = {name: "", value: ""};
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
    for(var i = 0; i < props.form.elements.length; i++) {
      var element = props.form.elements[i];
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
      setShow(true);
    }
  }

  const renderForm = () => {
    return props.form.elements.map((metadata, index) => {
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

  if(props.form === undefined || props.form === null) {
    return (
      <NotFound />
    );
  }
  return (
    <div>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton> Form Submission Successful </Modal.Header>
        <Modal.Body>
          The form was filled out properly and accepted.  Since this is only a preview of
          the form, nothing happened by clicking submit, but by linking a Google Sheet to
          this form and publishing it, the data from your form submission can be appended
          directly to your Google Sheet!
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}> Got it! </Button>
        </Modal.Footer>
      </Modal>
      <Button variant="secondary" onClick={() => props.onBack(false)}> Back </Button>
      <br/>
      <Form onSubmit={handleSubmit} noValidate validated={validated}>
        <Row>
          <Col style={{textAlign: "center"}}>
            <h2> {props.form.title} </h2>
          </Col>
        </Row>
        <br/>
        <Row>
          {renderForm()}
        </Row>
        <br/>
        <Row>
          <Col style={{textAlign: "center"}}>
            <Button type="submit" variant="success"> Submit </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default Preview;
