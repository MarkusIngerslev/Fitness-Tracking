// Libaries
import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import Toast from "react-native-toast-message";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

// Utils
import {
  getUserSession,
  clearUserSession,
  storeUserSession,
} from "./utils/storage";

// Pages
import LoginScreen from "./pages/LoginScreen";
import RegisterScreen from "./pages/RegisterScreen";
import Dashboard from "./pages/Dashboard";
import LogWorkout from "./pages/LogWorkout";
import Progress from "./pages/Progress";
import ImageProgress from "./pages/ImageProgress";

const Stack = createStackNavigator();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const userData = await getUserSession();
        if (userData) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Auth init error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await storeUserSession(user);
        setIsAuthenticated(true);
      } else {
        await clearUserSession();
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });

    initAuth();
    return () => unsubscribe();
  }, []);

  // Add a loading indicator component
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={isAuthenticated ? "Dashboard" : "Login"}
      >
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="LogWorkout" component={LogWorkout} />
            <Stack.Screen name="Progress" component={Progress} />
            <Stack.Screen name="ImageProgress" component={ImageProgress} />
          </>
        )}
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
};

export default App;
