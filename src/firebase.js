import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  fetchSignInMethodsForEmail,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

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

// Ensure consistent auth initialization
const auth =
  Platform.OS === "web"
    ? getAuth(app)
    : initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });

// Initialize auth state immediately
getAuth().currentUser;

export {
  app,
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  fetchSignInMethodsForEmail,
};
