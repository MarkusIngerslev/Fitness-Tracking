import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import {
  auth,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "../firebase";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Password Error",
        text2: "Passwords do not match",
      });
      return;
    }

    fetchSignInMethodsForEmail(auth, email)
      .then((signInMethods) => {
        if (signInMethods.length > 0) {
          Toast.show({
            type: "error",
            text1: "Registration Error",
            text2: "Email already in use",
          });
          return;
        }
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // User registered successfully
            const user = userCredential.user;
            console.log("Registered user: ", user.email);
          })
          .catch((error) => {
            const errorCode = error.code;
            let errorMessage = "";
            switch (errorCode) {
              case "auth/weak-password":
                errorMessage =
                  "Password is too weak. It should be at least 6 characters.";
                break;
              case "auth/invalid-email":
                errorMessage = "Invalid email address.";
                break;
              case "auth/email-already-in-use":
                errorMessage = "Email already in use.";
                break;
              default:
                errorMessage = error.message;
                break;
            }
            console.error("Registration error: ", errorCode, errorMessage);
            Toast.show({
              type: "error",
              text1: "Registration Error",
              text2: errorMessage,
            });
          });
      })
      .catch((error) => {
        console.error("Error checking email: ", error.message);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error.message,
        });
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
        secureTextEntry
      />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
});

export default RegisterScreen;
