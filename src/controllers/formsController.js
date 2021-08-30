import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { GoogleSpreadsheet } from "google-spreadsheet";

const DB = require('../firebase/db.js');
const UTIL = require('../util/util.js');
const MODEL = require('../models/form.js');

const getForms = (userId, callback) => {
  DB.getQueryWithFilter("userId", userId, "forms", UTIL.callbackOnError)
  .onSnapshot(querySnapshot => {
    var temp = [];
    for(var i = 0; i < querySnapshot.docs.length; i++) {
      temp.push(querySnapshot.docs[i].data());
    }
    callback(temp);
  });
}

const getForm = (formId, userId, callback) => {
  DB.getQueryWithFilter("id", formId, "forms", UTIL.callbackOnError)
  .onSnapshot(querySnapshot => {
    var temp = [];
    for(var i = 0; i < querySnapshot.docs.length; i++) {
      temp.push(querySnapshot.docs[i].data());
    }
    if(temp.length != 1) {
      callback(null);
    }
    else if(temp[0].userId !== userId) {
      callback(null);
    }
    else {
      callback(temp[0]);
    }
  });
}

const getPublishedForm = (formId, callback) => {
  DB.getQueryWithFilter("id", formId, "forms", UTIL.callbackOnError)
  .onSnapshot(querySnapshot => {
    var temp = [];
    for(var i = 0; i < querySnapshot.docs.length; i++) {
      temp.push(querySnapshot.docs[i].data());
    }
    if(temp.length != 1) {
      callback(null);
    }
    else if(!temp[0].isPublished) {
      callback(null);
    }
    else {
      callback(temp[0]);
    }
  });
}

const createNew = (userId, callback) => {
  var newForm = Object.assign({}, MODEL.form);
  var timestamp = new Date().getTime();
  newForm.id = uuidv4().toString();
  newForm.userId = userId;
  newForm.dateCreated = timestamp;
  DB.writeOne(newForm.id, newForm, "forms", callback, UTIL.callbackOnError);
}

const editForm = (form, callback) => {
  form.lastModified = new Date().getTime();
  DB.writeOne(form.id, form, "forms", callback, UTIL.callbackOnError);
}

const deleteForm = (id, callback) => {
  DB.deleteOne(id, "forms", callback, UTIL.callbackOnError);
}

const publishForm = (form, callback, callbackOnError) => {
  addHeaders(form, callback, callbackOnError)
    .then(() => {
      form.publishedUrl = window.location.protocol + '//' + window.location.host + "/" + form.id;
      form.isPublished = true;
      if(form.accessKey.trim().length > 0) {
        form.isPrivate = true;
      }
      else {
        form.isPrivate = false;
      }
      editForm(form, callback);
    });
}

const unpublishForm = (form, callback) => {
  form.isPublished = false;
  form.accessKey = "";
  form.isPrivate = false;
  form.gSheetId = "";
  form.publishedUrl = "";
  editForm(form, callback);
}

const submitForm = (form, values, callback) => {
  addHeaders(form, () => {return;}, UTIL.callbackOnError)
    .then(() => {
      writeRow(form, values, UTIL.callbackOnError)
        .then(() => {
          form.submits.push(new Date().getTime());
          editForm(form, callback);
        })
        .catch((error) => {
          UTIL.callbackOnError(error);
        });
    })
    .catch((error) => {
      UTIL.callbackOnError(error);
    });
}

const addHeaders = async (form, callbackOnError) => {
  try {
    const doc = new GoogleSpreadsheet(form.gSheetId);
    await doc.useServiceAccountAuth({
      client_email: process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.REACT_APP_GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });
    await doc.loadInfo();
    var sheet = doc.sheetsByIndex[0];
    var headerRow = [];
    for(var i = 0; i < form.elements.length; i++) {
      if(form.elements[i].label.trim().length == 0) {
        headerRow.push(form.elements[i].type + " " + i.toString());
      }
      else {
        headerRow.push(form.elements[i].label);
      }
    }
    if(headerRow.length == 0) {
      alert("Cannot add empty headers");
    }
    else {
      sheet.setHeaderRow(headerRow);
    }
  }
  catch(error) {
    alert("Error: Could not access your Google Sheet. Either the sheet id you provided is invalid or you did not provide edit access to " + process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL);
    callbackOnError();
  }
};

const writeRow = async (form, values, callbackOnError) => {
  try {
    const doc = new GoogleSpreadsheet(form.gSheetId);
    await doc.useServiceAccountAuth({
      client_email: process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.REACT_APP_GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });
    await doc.loadInfo();
    var sheet = doc.sheetsByIndex[0];
    sheet.addRow(values);
  }
  catch(error) {
    alert("Error: Could not access your Google Sheet. Either the sheet id you provided is invalid or you did not provide edit access to " + process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL);
    callbackOnError();
  }
}

export { getForms, getForm, getPublishedForm, createNew, editForm, deleteForm, publishForm, unpublishForm, submitForm };
