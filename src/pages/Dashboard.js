import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { auth, signOut } from "../firebase";

const Dashboard = ({ navigation }) => {
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful
        console.log("User signed out");
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        }); // Reset navigation stack and navigate to Login
      })
      .catch((error) => {
        console.error("Logout error: ", error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Dashboard!</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default Dashboard;
