import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import {
  Container,
  Modal,
  Row,
  Col
} from 'react-bootstrap';

const Analytics = (props) => {

  const [show, setShow] = useState(false);
  const [form, setForm] = useState();

  useEffect(() => {
    setForm(props.form);
    setShow(props.show);
  }, [props.form, props.show]);

  const getGraphData = () => {
    if(form === undefined || form === null) {
      return [];
    }
    var data = [];
    var count = {};
    var order = [];
    for(var i = 0; i < form.submits.length; i++) {
      var date = new Date(form.submits[i]).toLocaleDateString();
      if(count[date] === undefined) {
        count[date] = 1;
        order.push(date);
      }
      else {
        count[date] = count[date] + 1;
      }
    }
    for(var x = 0; x < order.length; x++) {
      data.push(
        {name: order[x], Submissions: count[order[x]]}
      );
    }
    return data;
  }

  if(form === undefined || form === null) {
    return (
      <div></div>
    );
  }
  return (
    <Modal show={show} onHide={props.onClose} size="xl">
      <Modal.Header closeButton> Form Analytics </Modal.Header>
      <Modal.Body>
        <Row>
          <Col xs={12} style={{marginBottom: "8px"}}>
            🏷️ <strong>Title:</strong> {form.title}
          </Col>
          <Col xs={12} style={{marginBottom: "8px"}}>
            📅 <strong>Date Created:</strong> {new Date(form.dateCreated).toLocaleTimeString()}
          </Col>
          <Col xs={12} style={{marginBottom: "8px"}}>
            ✏️ <strong>Last Modified:</strong> {new Date(form.lastModified).toLocaleTimeString()}
          </Col>
        </Row>
        <br/>
        <h5> Form Submissions By Date </h5>
        <div style={{height: "60vh"}}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={getGraphData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Submissions" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default Analytics;
