// Libaries
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import { auth, signInWithEmailAndPassword } from "../firebase";

// Utils
import { storeUserSession } from "../utils/storage";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await storeUserSession(user);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Login error: ", errorCode, errorMessage);
      let toastMessage = errorMessage;
      if (errorCode === "auth/user-not-found") {
        toastMessage = "User not found";
      } else if (errorCode === "auth/invalid-email") {
        toastMessage = "Invalid email address";
      } else if (errorCode === "auth/invalid-credential") {
        toastMessage = "Invalid credentials";
      }
      Toast.show({
        type: "error",
        text1: "Login Error",
        text2: toastMessage,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
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
      <Button title="Login" onPress={handleLogin} />
      <Button
        title="Create Account"
        onPress={() => navigation.navigate("RegisterScreen")}
      />
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

export default LoginScreen;
