// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCt2jN1ew-uF2FcgRO1Kp5LK3gj2ZSoBwQ",
  authDomain: "mobile-dev-exam.firebaseapp.com",
  projectId: "mobile-dev-exam",
  storageBucket: "mobile-dev-exam.firebasestorage.app",
  messagingSenderId: "1028684122659",
  appId: "1:1028684122659:web:859b6ce3da92f75b533f96",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };
