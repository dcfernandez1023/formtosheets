import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

import MySpinner from './MySpinner.js';
import Preview from './Preview.js';
import PublishModal from './PublishModal.js';
import Analytics from './Analytics.js';

import {
  Container,
  Badge,
  Row,
  Col,
  Nav,
  Modal,
  Dropdown,
  DropdownButton,
  ListGroup,
  Form,
  Button,
  CloseButton,
  Spinner,
  Offcanvas,
  Overlay,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';

import NotFound from './404.js';

const CONTROLLER = require('../controllers/formsController.js');
const FORM = require('../models/form.js');
const INPUT = require("../models/input.js");
const SELECT = require("../models/select.js");
const RADIO = require("../models/radio.js");
const TEXTAREA = require("../models/textarea.js");

const FormBuilder = (props) => {
  let { formId } = useParams();

  const [form, setForm] = useState();
  const [copyOfForm, setCopyOfForm] = useState();
  const [editingTitle, setEditingTitle] = useState(false);
  const [selectedElement, setSelectedElement] = useState();
  const [changesMade, setChangesMade] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [preview, setPreview] = useState(false);
  const [publishShow, setPublishShow] = useState(false);
  const [publishSaving, setPublishSaving] = useState(false);
  const [publishChange, setPublishChange] = useState(false);
  const [showG, setShowG] = useState(false);
  const [showUnpublish, setShowUnpublish] = useState(false);
  const [unpublishSaving, setUnpublishSaving] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    if(props.userInfo === null || props.userInfo === undefined) {
      return;
    }
    CONTROLLER.getForm(formId, props.userInfo.uid, setForm);
  }, [props.userInfo]);

  const handleFormChanges = () => {
    setChangesMade(true);
    window.onbeforeunload = () => {
      return "You have not saved your changes. Are you sure you want to leave?";
    };
  }

  const onChangeFormTitle = (e) => {
    var formCopy = Object.assign({}, form);
    formCopy.title = e.target.value;
    setForm(formCopy);
    handleFormChanges()
  }

  const makeTitleEditable = () => {
    setEditingTitle(true);
  }

  const makeTitleHeader = () => {
    if(form.title.trim().length == 0) {
      alert("Title cannot be blank.");
      return;
    }
    setEditingTitle(false);
  }

  const deleteForm = () => {
    setSaving(true);
    CONTROLLER.deleteForm(form.id, (res) => {
      setSaving(false);
      setChangesMade(false);
      window.location.pathname = "/";
    });
  }

  const saveForm = () => {
    if(form.title.trim().length == 0) {
      alert("Title cannot be blank.");
      return;
    }
    setSaving(true);
    CONTROLLER.editForm(form, (res) => {
      setSaving(false);
      setChangesMade(false);
      window.onbeforeunload = null;
    });
  }

  const savePublishSettings = () => {
    setPublishSaving(true);
    setPublishChange(false);
    var data = copyOfForm === undefined ? form : copyOfForm;
    if(data.isPublished) {
      data.publishedUrl = window.location.protocol + '//' + window.location.host + "/" + data.id;
    }
    else {
      data.publishedUrl = "";
    }
    console.log(data.publishedUrl);
    CONTROLLER.editForm(data, (res) => {
      setPublishSaving(false);
    });
  }

  const selectElement = (element, e) => {
    if(e.target.type === "button") {
      return;
    }
    if(selectedElement !== undefined && element.id === selectedElement.id) {
      setSelectedElement();
    }
    else {
      setSelectedElement(element);
    }
  }

  // used for the published settings
  const onChangeForm = (e) => {
    setPublishChange(true);
    var formCopy;
    if(copyOfForm === undefined) {
      formCopy = Object.assign({}, form);
    }
    else {
      formCopy = Object.assign({}, copyOfForm);
    }
    if(FORM.boolConverters[e.target.name] !== undefined) {
      if(e.target.value === "false") {
        formCopy[e.target.name] = false;
      }
      else if(e.target.value === "true") {
        formCopy[e.target.name] = true;
      }
    }
    else {
      formCopy[e.target.name] = e.target.value;
    }
    if(e.target.name === "isPublished" && !formCopy.isPublished) {
      formCopy.isPrivate = false;
      formCopy.accessKey = "";
    }
    setCopyOfForm(formCopy);
  }

  // for select elements only
  const addOptionToSelectedElement = () => {
    var copy = JSON.parse(JSON.stringify(selectedElement));
    var newOption = {value: "", display: ""};
    copy.options.push(Object.assign({}, newOption));
    setSelectedElement(copy);
    handleFormChanges();
  }

  // for select elements only
  const deleteOptionFromSelectElement = (index) => {
    var copy = Object.assign({}, selectedElement);
    copy.options.splice(index, 1);
    setSelectedElement(copy);
    handleFormChanges()
  }

  const removeElement = (id, e) => {
    var formCopy = Object.assign({}, form);
    for(var i = 0; i < formCopy.elements.length; i++) {
      if(id === formCopy.elements[i].id) {
        formCopy.elements.splice(i, 1);
        break;
      }
    }
    if(selectedElement !== undefined && id === selectedElement.id) {
      setSelectedElement();
    }
    setForm(formCopy);
    handleFormChanges()
  }

  const addInput = () => {
    var formCopy = Object.assign({}, form);
    var newElement = Object.assign({}, INPUT.input);
    newElement.id = uuidv4().toString();
    formCopy.elements.push(newElement);
    setSelectedElement(newElement);
    setForm(formCopy);
    handleFormChanges()
  }

  const addSelect = () => {
    var formCopy = Object.assign({}, form);
    var newElement = Object.assign({}, SELECT.select);
    newElement.id = uuidv4().toString();
    formCopy.elements.push(newElement);
    setSelectedElement(newElement);
    setForm(formCopy);
    handleFormChanges()
  }

  const addRadio = () => {
    var formCopy = Object.assign({}, form);
    var newElement = Object.assign({}, RADIO.radio);
    newElement.id = uuidv4().toString();
    formCopy.elements.push(newElement);
    setSelectedElement(newElement);
    setForm(formCopy);
    handleFormChanges()
  }

  const addTextarea = () => {
    var formCopy = Object.assign({}, form);
    var newElement = Object.assign({}, TEXTAREA.textarea);
    newElement.id = uuidv4().toString();
    formCopy.elements.push(newElement);
    setSelectedElement(newElement);
    setForm(formCopy);
    handleFormChanges()
  }

  const onChangeSelectedElement = (id, e) => {
    var key = e.target.name;
    var value = e.target.value;
    var formCopy = Object.assign({}, form);
    for(var i = 0; i < formCopy.elements.length; i++) {
      if(formCopy.elements[i].id === id) {
        var copy = Object.assign({}, formCopy.elements[i]);
        if(FORM.boolConverters[key] !== undefined) {
          if(e.target.value === "false") {
            copy[e.target.name] = false;
          }
          else if(e.target.value === "true") {
            copy[e.target.name] = true;
          }
        }
        else {
          copy[key] = value;
        }
        formCopy.elements[i] = copy;
        setSelectedElement(copy);
        break;
      }
    }
    setForm(formCopy);
    handleFormChanges()
  }

  const renderInputEditor = () => {
    return INPUT.fields.map((field, index) => {
      if(field.element === "input") {
        return (
          <Col xl={12} key={field.value + "-" + index.toString()} className="form-builder-col-spacing">
            <Form.Label> {field.display} </Form.Label>
            <Form.Control
              name={field.value}
              value={selectedElement[field.value]}
              size="sm"
              onChange={(e) => {onChangeSelectedElement(selectedElement.id, e)}}
            />
          </Col>
        );
      }
      else if(field.element === "select") {
        return (
          <Col xl={12} key={field.value + "-" + index.toString()} className="form-builder-col-spacing">
            <Form.Label> {field.display} </Form.Label>
            <Form.Select
               name={field.value}
               value={selectedElement[field.value]}
               size="sm"
               onChange={(e) => {onChangeSelectedElement(selectedElement.id, e)}}
            >
              {field.options.map((option, index2) => {
                return (
                  <option value={option.value} key={"option-" + index2.toString()}> {option.display} </option>
                );
              })}
            </Form.Select>
          </Col>
        );
      }
    });
  }

  const renderTextAreaEditor = () => {
    return TEXTAREA.fields.map((field, index) => {
      if(field.element === "input") {
        return (
          <Col xl={12} key={field.value + "-" + index.toString()} className="form-builder-col-spacing">
            <Form.Label> {field.display} </Form.Label>
            <Form.Control
              name={field.value}
              value={selectedElement[field.value]}
              size="sm"
              onChange={(e) => {onChangeSelectedElement(selectedElement.id, e)}}
            />
          </Col>
        );
      }
      else if(field.element === "select") {
        return (
          <Col xl={12} key={field.value + "-" + index.toString()} className="form-builder-col-spacing">
            <Form.Label> {field.display} </Form.Label>
            <Form.Select
               name={field.value}
               value={selectedElement[field.value]}
               size="sm"
               onChange={(e) => {onChangeSelectedElement(selectedElement.id, e)}}
            >
              {field.options.map((option, index2) => {
                return (
                  <option value={option.value} key={"option-" + index2.toString()}> {option.display} </option>
                );
              })}
            </Form.Select>
          </Col>
        );
      }
    });
  }

  const renderRadioEditor = () => {
    return RADIO.fields.map((field, index) => {
      if(field.element === "input") {
        return (
          <Col xl={12} key={field.value + "-" + index.toString()} className="form-builder-col-spacing">
            <Form.Label> {field.display} </Form.Label>
            <Form.Control
              name={field.value}
              value={selectedElement[field.value]}
              size="sm"
              onChange={(e) => {onChangeSelectedElement(selectedElement.id, e)}}
            />
          </Col>
        );
      }
      else if(field.element === "select") {
        return (
          <Col xl={12} key={field.value + "-" + index.toString()} className="form-builder-col-spacing">
            <Form.Label> {field.display} </Form.Label>
            <Form.Select
               name={field.value}
               value={selectedElement[field.value]}
               size="sm"
               onChange={(e) => {onChangeSelectedElement(selectedElement.id, e)}}
            >
              {field.options.map((option, index2) => {
                return (
                  <option value={option.value} key={"option-" + index2.toString()}> {option.display} </option>
                );
              })}
            </Form.Select>
          </Col>
        );
      }
    });
  }

  const renderSelectEditor = () => {
    return SELECT.fields.map((field, index) => {
      if(field.element === "input") {
        return (
          <Col xl={12} key={field.value + "-" + index.toString()} className="form-builder-col-spacing">
            <Form.Label> {field.display} </Form.Label>
            <Form.Control
              name={field.value}
              value={selectedElement[field.value]}
              size="sm"
              onChange={(e) => {onChangeSelectedElement(selectedElement.id, e)}}
            />
          </Col>
        );
      }
      else if(field.element === "select") {
        return (
          <Col xl={12} key={field.value + "-" + index.toString()} className="form-builder-col-spacing">
            <Form.Label> {field.display} </Form.Label>
            <Form.Select
               name={field.value}
               value={selectedElement[field.value]}
               size="sm"
               onChange={(e) => {onChangeSelectedElement(selectedElement.id, e)}}
            >
              {field.options.map((option, index2) => {
                return (
                  <option value={option.value} key={"option-" + index2.toString()}> {option.display} </option>
                );
              })}
            </Form.Select>
          </Col>
        );
      }
      else if(field.element === "inputs") {
        const onChangeOption = (oIndex, e) => {
          console.log("here");
          var key = e.target.name;
          var value = e.target.value;
          var copy = Object.assign({}, selectedElement);
          var formCopy = Object.assign({}, form);
          for(var i = 0; i < form.elements.length; i++) {
            if(copy.id === form.elements[i].id) {
              copy.options[oIndex][key] = value;
              formCopy.elements[i] = copy;
              break;
            }
          }
          setSelectedElement(copy);
          setForm(formCopy);
        }
        return (
          <Col xl={12} key={field.value + "-" + index.toString()} className="form-builder-col-spacing">
            <Form.Label>
              {field.display}
              <Button
                style={{marginLeft: "8px", paddingTop: "3px", paddingBottom: "3px"}}
                size="sm"
                variant="light"
                onClick={addOptionToSelectedElement}
              >
                +
              </Button>
            </Form.Label>
            {selectedElement.options.map((option, optionIndex) => {
              return (
                <div style={{marginBottom: "5px"}} key={"editor-option" + optionIndex.toString()}>
                  <Row>
                    <Col style={{marginBottom: "3px"}}>
                      <Form.Label> Value </Form.Label>
                      <Form.Control
                        name="value"
                        size="sm"
                        value={selectedElement.options[optionIndex].value}
                        onChange={(e) => {
                          onChangeOption(optionIndex, e);
                        }}
                      />
                    </Col>
                    <Col style={{marginBottom: "3px"}}>
                      <Form.Label> Display </Form.Label>
                      <Form.Control
                        name="display"
                        size="sm"
                        value={selectedElement.options[optionIndex].display}
                        onChange={(e) => {
                          onChangeOption(optionIndex, e);
                        }}
                      />
                    </Col>
                    <Col xs={1} style={{textAlign: "right"}}>
                      <CloseButton
                        style={{marginTop: "40px", width: "6px", height: "6px"}}
                        size="sm"
                        onClick={() => deleteOptionFromSelectElement(optionIndex)}
                      />
                    </Col>
                  </Row>
                </div>
              );
            })}
          </Col>
        );
      }
    });
  }

  const renderEditor = () => {
    if(selectedElement.type === "INPUT") {
      return (
        <Row>
          {renderInputEditor()}
        </Row>
      );
    }
    else if(selectedElement.type === "SELECT") {
      return (
        <Row>
          {renderSelectEditor()}
        </Row>
      );
    }
    else if(selectedElement.type === "TEXTAREA") {
      return (
        <Row>
          {renderTextAreaEditor()}
        </Row>
      );
    }
    else if(selectedElement.type === "RADIO") {
      return (
        <Row>
          {renderRadioEditor()}
        </Row>
      );
    }
  }

  const renderForm = () => {
    if(form.elements.length == 0) {
      return (
        <div style={{marginLeft: "20px"}}>
          <div style={{marginBottom: "5px"}}> Getting Started: </div>
          <ul>
            <li> To edit the title of your form, hover over and click your form's title, {"'" + form.title + "'"} </li>
            <li> To add elements to your form, click the + dropdown button to the left </li>
            <li> After adding elements, you can select them by clicking them on the left sidebar, 'Elements' </li>
            <li> To edit the element you have currently selected, use the right sidebar, 'Element Editor' </li>
            <li> Every time you make an edit to the form's title or to any element you have added, hit the 'Save' button at the top right to persist your changes </li>
            <li> To link a Google sheet, preview your form, publish your form (make it public), or delete your form, hit the 'Actions' dropdown button at the top right </li>
          </ul>
        </div>
      );
    }
    return form.elements.map((metadata, index) => {
      if(metadata.type === "INPUT") {
        return (
          <Col md={metadata.columns} key={metadata.id + "-col"} className="form-builder-col-spacing">
            <Form.Label> {metadata.label} </Form.Label>
            <Form.Control
              id={metadata.id}
              style={selectedElement !== undefined && selectedElement.id === metadata.id ? {backgroundColor: "#fff3cd"} : {} }
              as="input"
              required={metadata.required}
              placeholder={metadata.placeholder}
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
              style={selectedElement !== undefined && selectedElement.id === metadata.id ? {backgroundColor: "#fff3cd"} : {} }
            >
              <option selected value=""> Select </option>
              {metadata.options.map((option, index) => {
                if(option.display.trim().length == 0) {
                  return <div></div>
                }
                return (
                  <option key={metadata.id + "-option" + index.toString()} value={option.value}> {option.display} </option>
                );
              })}
            </Form.Select>
          </Col>
        );
      }
      else if(metadata.type === "RADIO") {
        return (
          <Col md={metadata.columns} key={metadata.id + "-col"} className="form-builder-col-spacing" style={selectedElement !== undefined && selectedElement.id === metadata.id ? {backgroundColor: "#fff3cd"} : {} }>
            <Form.Label style={{marginRight: "10px"}}> {metadata.mainLabel} </Form.Label>
            <Form.Check
              inline
              style={selectedElement !== undefined && selectedElement.id === metadata.id ? {backgroundColor: "#fff3cd"} : {} }
              id={metadata.id + "radio1"}
              label={metadata.label1}
              type="radio"
              name={"radioGroup" + index.toString()}
              value={metadata.value1}
              required={metadata.required}
            />
            <Form.Check
              inline
              style={selectedElement !== undefined && selectedElement.id === metadata.id ? {backgroundColor: "#fff3cd"} : {} }
              id={metadata.id + "radio2"}
              label={metadata.label2}
              type="radio"
              name={"radioGroup" + index.toString()}
              value={metadata.value2}
              required={metadata.required}
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
              style={selectedElement !== undefined && selectedElement.id === metadata.id ? {backgroundColor: "#fff3cd"} : {} }
              id={metadata.id}
              as="textarea"
              rows={metadata.rows}
              required={metadata.required}
              placeholder={metadata.placeholder}
            />
          </Col>
        );
      }
    });
  }

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      By setting an access key, anyone who navigates to your form on the web will be required
      to enter your access key to view the form and submit data.
    </Tooltip>
  );

  if(form === null || props.userInfo === null) {
    return (
      <NotFound />
    );
  }
  if(form === undefined) {
    return (
      <MySpinner />
    );
  }
  if(form.userId !== props.userInfo.uid) {
    return (
      <NotFound />
    );
  }
  if(preview) {
    return (
      <Container style={{width: "70%"}}>
        <Preview
          form={form}
          onBack={setPreview}
        />
      </Container>
    )
  }
  return (
    <Container fluid>
      <PublishModal
        show={publishShow}
        form={form}
        onClose={() => {
          setPublishShow(false);
        }}
      />
      <Analytics
        show={showAnalytics}
        form={form}
        onClose={() => setShowAnalytics(false)}
      />
      <Modal show={showUnpublish} onHide={() => setShowUnpublish(false)}>
        <Modal.Header closeButton> Unpublish Form </Modal.Header>
        <Modal.Body>
          <p> By unpublishing this form, it won't be accessible to others publicly. </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary"disabled={unpublishSaving} onClick={() => {
              setUnpublishSaving(true);
              CONTROLLER.unpublishForm(form, () => {
                setUnpublishSaving(false);
                setShowUnpublish(false);
              });
            }}
          >
            {unpublishSaving ?
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                style={{marginRight: "8px"}}
              />
            :
              <div></div>
            }
            Unpublish
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton> Delete Form </Modal.Header>
        <Modal.Body>  Are you sure you want to delete this form? </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={deleteForm}>
            {saving ?
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                style={{marginRight: "8px"}}
              />
            :
              <div></div>
            }
            Yes
          </Button>
          <Button variant="secondary" onClick={() => setModalShow(false)}> No </Button>
        </Modal.Footer>
      </Modal>
      <Offcanvas
        show={showOffcanvas}
        scroll={true}
        backdrop={false}
        onHide={() => setShowOffcanvas(false)}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title> Layouts </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          Coming soon!
        </Offcanvas.Body>
      </Offcanvas>
      <Row>
        <Col style={{textAlign: "center"}}>
          <Button variant="info" style={{float: "left"}} onClick={() => setShowOffcanvas(true)}> Layouts </Button>
          <Button
            variant="info"
            style={{float: "right", marginLeft: "10px"}}
            disabled={!changesMade}
            onClick={saveForm}
          >
            {saving && changesMade ?
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                style={{marginRight: "8px"}}
              />
            :
              <div></div>
            }
            Save
          </Button>
          <DropdownButton align="end" variant="info" style={{float: "right"}} title="Actions">
            <Dropdown.Item onClick={() => setPreview(true)}> Preview Form </Dropdown.Item>
            <Dropdown.Item onClick={() => setPublishShow(true)}> Publish </Dropdown.Item>
            <Dropdown.Item disabled={!form.isPublished} onClick={() => setShowUnpublish(true)}> Unpublish </Dropdown.Item>
            <Dropdown.Item onClick={() => setShowAnalytics(true)}> Analytics </Dropdown.Item>
            <Dropdown.Item onClick={() => setModalShow(true)}> Delete </Dropdown.Item>
          </DropdownButton>
        </Col>
      </Row>
      <br/>
      <Row style={{height: "100%"}}>
        <Col xs={2} style={{borderRight: "1px solid lightGray"}}>
          <Row>
            <Col>
              <div> <strong> Elements  </strong> </div>
            </Col>
            <Col style={{textAlign: "right"}}>
              <Dropdown align="end" style={{paddingTop: "3px", paddingBottom: "3px"}}>
                <Dropdown.Toggle variant="light" size="sm">
                  +
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={addInput}> Input </Dropdown.Item>
                  <Dropdown.Item onClick={addSelect}> Select </Dropdown.Item>
                  <Dropdown.Item onClick={addRadio}> Radio </Dropdown.Item>
                  <Dropdown.Item onClick={addTextarea}> Textarea </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
          <br/>
          <Row>
            {form.elements.length == 0 ?
              <small>
                No form elements have been added
              </small>
            :
              <ListGroup variant="flush">
                {form.elements.map((element) => {
                  return (
                    <ListGroup.Item
                      action
                      variant={selectedElement !== undefined && selectedElement.id === element.id ? "warning" : ""}
                      key={element.id + "-element-list"}
                      onClick={(e) => {selectElement(element ,e)}}
                    >
                      <Row>
                        <Col xs={10}>
                          {element.name}
                        </Col>
                        <Col xs={2} style={{textAlign: "right"}}>
                          <CloseButton
                            style={{width: "6px", height: "6px"}}
                            onClick={(e) => {removeElement(element.id, e)}}
                          />
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            }
          </Row>
        </Col>
        <Col xs={8}>
          <Row>
            <Col style={{textAlign: "center"}}>
              {editingTitle ?
                <div style={{width: "300px", margin: "0 auto"}}>
                  <Form.Control
                    name="title"
                    value={form.title}
                    onChange={onChangeFormTitle}
                  />
                  <div style={{textAlign: "right", marginTop: "8px"}}>
                    <Button variant="light" size="sm" onClick={makeTitleHeader}>
                      <img src="/check.png" style={{paddingTop: "3px", paddingBottom: "3px"}} />
                    </Button>
                  </div>
                </div>
              :
                <div>
                  <h4
                    className="form-title"
                    style={{paddingBottom: "8px", display: "inline-block"}}
                    onClick={makeTitleEditable}
                  >
                    {form.title}
                  </h4>
                  {form.isPublished ?
                    <Badge bg="success" style={{marginLeft: "8px"}} pill> Published </Badge>
                  :
                    <div></div>
                  }
                </div>
              }
            </Col>
          </Row>
          <br/>
          <Row>
            {renderForm()}
          </Row>
          {form.elements.length != 0 ?
            <div>
              <hr/>
              <Row>
                <Col style={{textAlign: "center"}}>
                  <Button variant="success"> Submit </Button>
                </Col>
              </Row>
            </div>
          :
            <div></div>
          }
        </Col>
        <Col xs={2} style={{borderLeft: "1px solid lightGray"}}>
          <p> <strong> Element Editor </strong> </p>
          {selectedElement === undefined ?
            <small> No element selected </small>
          :
            <Row>
              {renderEditor()}
            </Row>
          }
        </Col>
      </Row>
      <br/>
      <br/>
    </Container>
  );
}

export default FormBuilder;
