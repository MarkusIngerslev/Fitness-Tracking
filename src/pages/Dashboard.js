// src/pages/Dashboard.js
import React from "react";
import { View, Text, Button, StyleSheet, ScrollView } from "react-native";
import { auth, signOut } from "../firebase";
import Toast from "react-native-toast-message";
import { useTrainingData } from "../hooks/useTrainingData";

// Test data
// import { addTestWorkouts } from "../utils/addTestData";

const StatCard = ({ title, value }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardValue}>{value}</Text>
  </View>
);

const Dashboard = ({ navigation }) => {
  const { stats, loading } = useTrainingData();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out");
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
        Toast.show({
          type: "success",
          text1: "Logout Successful",
          text2: "You have been logged out successfully",
        });
      })
      .catch((error) => {
        console.error("Logout error: ", error.message);
        Toast.show({
          type: "error",
          text1: "Logout Error",
          text2: error.message,
        });
      });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Button title="Logout" onPress={handleLogout} />
      </View>

      {loading ? (
        <Text>Loading stats...</Text>
      ) : (
        <>
          <View style={styles.statsContainer}>
            <StatCard title="Total Workouts" value={stats.totalWorkouts} />
            <StatCard title="This Week" value={stats.thisWeekWorkouts} />
          </View>

          <View style={styles.quickActions}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <Button
              title="New Workout"
              onPress={() => navigation.navigate("LogWorkout")}
            />
            <Button
              title="View Progress"
              onPress={() => navigation.navigate("Progress")}
            />

            {/* Tilføj test data */}
            {/* <Button
              title="Add Test Data"
              onPress={() => {
                addTestWorkouts().then(() =>
                  Toast.show({
                    type: "success",
                    text1: "Test data added",
                  })
                );
              }}
            /> */}
          </View>

          <View style={styles.lastWorkout}>
            <Text style={styles.sectionTitle}>Last Workout</Text>
            {stats.lastWorkout ? (
              <Text>
                {new Date(stats.lastWorkout.date).toLocaleDateString()}
                {" - "}
                {stats.lastWorkout.type}
              </Text>
            ) : (
              <Text>No workouts logged yet</Text>
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    width: "48%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    color: "#666",
  },
  cardValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
  },
  quickActions: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  lastWorkout: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
});

export default Dashboard;
