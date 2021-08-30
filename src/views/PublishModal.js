import React, { useState, useEffect } from 'react';

import {
  Container,
  Row,
  Col,
  Modal,
  Form,
  Button,
  Spinner,
  Overlay,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';

const CONTROLLER = require('../controllers/formsController.js');
const FORM = require('../models/form.js');

/*
  props:
    * form
    * show
    * onClose
*/
const PublishModal = (props) => {
  const [form, setForm] = useState();
  const [show, setShow] = useState(false);
  const [changes, setChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(props.form);
    setShow(props.show);
  }, [props.form, props.show]);

  const onChangeSheetId = (e) => {
    var copy = Object.assign({}, form);
    copy["gSheetId"] = e.target.value;
    setChanges(true);
    setForm(copy);
  }

  const onChangeAccessKey = (e) => {
    var copy = Object.assign({}, form);
    copy["accessKey"] = e.target.value;
    setChanges(true);
    setForm(copy);
  }

  if(form === undefined) {
    return (
      <div></div>
    );
  }
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      By setting an access key, anyone who navigates to your form on the web will be required
      to enter your key to view the form and submit data. (Leave it blank if you do not want to set an access key)
    </Tooltip>
  );
  return (
    <Modal show={show} onHide={() => props.onClose()} size="lg">
      <Modal.Header closeButton> Publish Form </Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            <p>
              First, share your Google Sheet with <strong>{process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL}</strong>, and give it edit access.
            </p>
            <p>
              Then copy and paste your Google Sheet's id into the input field below.  Your Google Sheet id can be found in your sheet's url. For example, https://docs.google.com/spreadsheets/d/<strong><mark>be62bbf4-01e0-4782-b87a-baf8ceaa3519</mark></strong>/edit#gid=0
            </p>
          </Col>
        </Row>
        <hr/>
        <Row>
          <Col md={6} style={{marginBottom: "8px"}}>
            <Form.Label> Google Sheet Id </Form.Label>
            <Form.Control
              value={form.gSheetId}
              onChange={onChangeSheetId}
            />
          </Col>
          <Col md={6} style={{marginBottom: "8px"}}>
            <Form.Label>
              Access Key
              <OverlayTrigger
                placement="right"
                delay={{ show: 100, hide: 100 }}
                overlay={renderTooltip}
              >
                <small> ℹ️ </small>
              </OverlayTrigger>
            </Form.Label>
            <Form.Control
              value={form.accessKey}
              onChange={onChangeAccessKey}
            />
          </Col>
        </Row>
        {form.isPublished ?
          <div>
            <br/>
            <Row>
              <Col>
                Form URL:
              </Col>
            </Row>
            <Row>
              <Col>
                <p> <a href={form.publishedUrl}> {form.publishedUrl} </a> </p>
              </Col>
            </Row>
          </div>
        :
          <div></div>
        }
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="success"
          disabled={!changes || saving}
          onClick={() => {
            setSaving(true);
            CONTROLLER.publishForm(form, (res) => {
              setSaving(false);
              setChanges(false);
            }, () => {setSaving(false)});
          }}
        >
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
          Publish
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default PublishModal;
