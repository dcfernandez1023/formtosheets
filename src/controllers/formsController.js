import { v4 as uuidv4 } from 'uuid';

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

export { getForms, getForm, getPublishedForm, createNew, editForm, deleteForm };
