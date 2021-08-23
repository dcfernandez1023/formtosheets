import "firebase/analytics";

var firebase = require('firebase');

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-975zNMBkEcFBtQKU4aBduTyasfNTXhM",
  authDomain: "formtosheets-9a6d7.firebaseapp.com",
  projectId: "formtosheets-9a6d7",
  storageBucket: "formtosheets-9a6d7.appspot.com",
  messagingSenderId: "177086286349",
  appId: "1:177086286349:web:f6b176ff3490bf1e13a344",
  measurementId: "G-HR10B0SMJM"
};

export var app = firebase.default.initializeApp(firebaseConfig);
export const analytics = firebase.default.analytics();
