import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { auth } from "../firebase";
import Toast from "react-native-toast-message";

const LogWorkout = ({ navigation }) => {
  const [workoutName, setWorkoutName] = useState("");
  const [exercises, setExercises] = useState([
    { name: "", sets: "", reps: "" },
  ]);

  const addExercise = () => {
    setExercises([...exercises, { name: "", sets: "", reps: "" }]);
  };

  const updateExercise = (index, field, value) => {
    const updatedExercises = [...exercises];
    updatedExercises[index][field] = value;
    setExercises(updatedExercises);
  };

  const handleSave = async () => {
    if (!workoutName.trim()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter a workout name",
      });
      return;
    }

    try {
      const db = getFirestore();
      const workoutData = {
        userId: auth.currentUser.uid,
        name: workoutName,
        exercises: exercises.filter((ex) => ex.name.trim()),
        date: new Date().toISOString(),
      };

      await addDoc(collection(db, "workouts"), workoutData);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Workout logged successfully",
      });
      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message,
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Log Workout</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Workout Name"
        value={workoutName}
        onChangeText={setWorkoutName}
      />

      {exercises.map((exercise, index) => (
        <View key={index} style={styles.exerciseContainer}>
          <TextInput
            style={styles.exerciseInput}
            placeholder="Exercise Name"
            value={exercise.name}
            onChangeText={(value) => updateExercise(index, "name", value)}
          />
          <TextInput
            style={styles.numberInput}
            placeholder="Sets"
            value={exercise.sets}
            onChangeText={(value) => updateExercise(index, "sets", value)}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.numberInput}
            placeholder="Reps"
            value={exercise.reps}
            onChangeText={(value) => updateExercise(index, "reps", value)}
            keyboardType="numeric"
          />
        </View>
      ))}

      <Button title="Add Exercise" onPress={addExercise} />
      <View style={styles.saveButton}>
        <Button title="Save Workout" onPress={handleSave} />
      </View>
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
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  exerciseContainer: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  exerciseInput: {
    marginBottom: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
  },
  numberInput: {
    marginBottom: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    width: "30%",
  },
  saveButton: {
    marginTop: 20,
    marginBottom: 40,
  },
});

export default LogWorkout;
