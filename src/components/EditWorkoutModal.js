// EditWorkoutModal.js
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Modal, StyleSheet } from "react-native";
import { getFirestore, doc, updateDoc, deleteDoc } from "firebase/firestore";

const EditWorkoutModal = ({
  visible,
  workout,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const [workoutName, setWorkoutName] = useState(workout?.name || "");
  const [exercises, setExercises] = useState(workout?.exercises || []);

  //useEffect for at opdatere state når workout prop ændres
  useEffect(() => {
    if (workout) {
      setWorkoutName(workout.name);
      setExercises(workout.exercises);
    }
  }, [workout]);

  const handleUpdate = async () => {
    try {
      const db = getFirestore();
      const workoutRef = doc(db, "workouts", workout.id);
      await updateDoc(workoutRef, {
        name: workoutName,
        exercises: exercises,
      });
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating workout:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const db = getFirestore();
      await deleteDoc(doc(db, "workouts", workout.id));
      onDelete();
      onClose();
    } catch (error) {
      console.error("Error deleting workout:", error);
    }
  };

  const removeExercise = (indexToRemove) => {
    setExercises(exercises.filter((_, index) => index !== indexToRemove));
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Edit Workout</Text>

        <TextInput
          style={styles.input}
          value={workoutName}
          onChangeText={setWorkoutName}
          placeholder="Workout Name"
        />

        {exercises.map((exercise, index) => (
          <View key={index} style={styles.exerciseContainer}>
            <View style={styles.exerciseHeader}>
              <Text style={styles.exerciseTitle}>Exercise {index + 1}</Text>
              <Button
                title="Remove"
                onPress={() => removeExercise(index)}
                color="red"
              />
            </View>

            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Exercise name:</Text>
              <TextInput
                style={[styles.input, styles.inputField]}
                value={exercise.name}
                onChangeText={(value) => {
                  const updatedExercises = [...exercises];
                  updatedExercises[index].name = value;
                  setExercises(updatedExercises);
                }}
                placeholder="Exercise Name"
              />
            </View>

            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Sets:</Text>
              <TextInput
                style={[styles.input, styles.inputField]}
                value={exercise.sets}
                onChangeText={(value) => {
                  const updatedExercises = [...exercises];
                  updatedExercises[index].sets = value;
                  setExercises(updatedExercises);
                }}
                placeholder="Sets"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Reps:</Text>
              <TextInput
                style={[styles.input, styles.inputField]}
                value={exercise.reps}
                onChangeText={(value) => {
                  const updatedExercises = [...exercises];
                  updatedExercises[index].reps = value;
                  setExercises(updatedExercises);
                }}
                placeholder="Reps"
                keyboardType="numeric"
              />
            </View>
          </View>
        ))}

        <View style={styles.buttonContainer}>
          <Button title="Update" onPress={handleUpdate} />
          <Button title="Delete" onPress={handleDelete} color="red" />
          <Button title="Cancel" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  exerciseContainer: {
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  exerciseContainer: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  inputLabel: {
    width: 100,
    fontSize: 14,
  },
  inputField: {
    flex: 1,
  },
});

export default EditWorkoutModal;
