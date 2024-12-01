import React from "react";
import Toast from "react-native-toast-message";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Page imports
import LoginScreen from "./pages/LoginScreen";
import RegisterScreen from "./pages/RegisterScreen";

import Dashboard from "./pages/Dashboard";
import LogWorkout from "./pages/LogWorkout";
import Progress from "./pages/Progress";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="LogWorkout" component={LogWorkout} />
        <Stack.Screen name="Progress" component={Progress} />
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
};

export default App;
