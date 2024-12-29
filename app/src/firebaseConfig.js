import dotenv from 'dotenv';
dotenv.config();
import firebase from "firebase/compat/app";
import "firebase/compat/database";

const firebaseConfig = {
  apiKey: "AIzaSyBMF_XHhGwMPqDGEAhZzWNxYobS1i8YNic",
  authDomain: "barbearia-30c39.firebaseapp.com",
  databaseURL: "https://barbearia-30c39-default-rtdb.firebaseio.com",
  projectId: "barbearia-30c39",
  storageBucket: "barbearia-30c39.firebasestorage.app",
  messagingSenderId: "207690073233",
  appId: "1:207690073233:web:3d2fd51a7005929ca36b30",
  measurementId: "G-GETK1HTWWM"
};

const app = firebase.initializeApp(firebaseConfig);
const db = app.database();

export default db;