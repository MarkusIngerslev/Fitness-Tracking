import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  fetchSignInMethodsForEmail,
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwFyFylwznhFR2X1YXI7rnJnlNtnZhYPI",
  authDomain: "maps-test-14733.firebaseapp.com",
  projectId: "maps-test-14733",
  storageBucket: "maps-test-14733.appspot.com",
  messagingSenderId: "393469563141",
  appId: "1:393469563141:web:06a482438fdf41119a676c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {
  app,
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  fetchSignInMethodsForEmail,
};
