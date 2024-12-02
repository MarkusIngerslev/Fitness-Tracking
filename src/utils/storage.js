import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeUserSession = async (user) => {
  try {
    const userData = {
      uid: user.uid,
      email: user.email,
    };
    await AsyncStorage.setItem("userData", JSON.stringify(userData));
  } catch (error) {
    console.error("Error storing user data:", error);
  }
};

export const getUserSession = async () => {
  try {
    const userData = await AsyncStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};

export const clearUserSession = async () => {
  try {
    await AsyncStorage.removeItem("userData");
  } catch (error) {
    console.error("Error clearing user data:", error);
  }
};
