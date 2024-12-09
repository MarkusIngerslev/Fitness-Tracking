import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useTrainingData } from "../hooks/useTrainingData";
import EditWorkoutModal from "../components/EditWorkoutModal";

const Progress = () => {
  const { stats, loading } = useTrainingData();
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const WorkoutHistoryItem = ({ workout }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => {
        setSelectedWorkout(workout);
        setModalVisible(true);
      }}
    >
      <Text style={styles.historyDate}>
        {new Date(workout.date).toLocaleDateString()}
      </Text>
      <Text style={styles.historyTitle}>{workout.name}</Text>
      <View style={styles.exerciseList}>
        {workout.exercises.map((exercise, index) => (
          <Text key={index} style={styles.exerciseItem}>
            {exercise.name} - {exercise.sets}x{exercise.reps}
          </Text>
        ))}
      </View>
    </TouchableOpacity>
  );

  const isThisWeek = (date) => {
    const workoutDate = new Date(date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return workoutDate >= weekAgo;
  };

  const thisWeekWorkouts =
    stats.workoutHistory?.filter((w) => isThisWeek(w.date)) || [];
  const olderWorkouts =
    stats.workoutHistory?.filter((w) => !isThisWeek(w.date)) || [];

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Progress</Text>
        </View>

        <View style={styles.statsOverview}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalWorkouts}</Text>
            <Text style={styles.statLabel}>Total Workouts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.thisWeekWorkouts}</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
        </View>

        {loading ? (
          <Text>Loading history...</Text>
        ) : (
          <>
            <View style={styles.weekSection}>
              <Text style={styles.sectionTitle}>This Week's Workouts</Text>
              {thisWeekWorkouts.length > 0 ? (
                thisWeekWorkouts.map((workout) => (
                  <WorkoutHistoryItem key={workout.id} workout={workout} />
                ))
              ) : (
                <Text style={styles.emptyText}>No workouts this week</Text>
              )}
            </View>

            <View style={styles.historySection}>
              <Text style={styles.sectionTitle}>Previous Workouts</Text>
              {olderWorkouts.length > 0 ? (
                olderWorkouts.map((workout) => (
                  <WorkoutHistoryItem key={workout.id} workout={workout} />
                ))
              ) : (
                <Text style={styles.emptyText}>No previous workouts</Text>
              )}
            </View>
          </>
        )}
      </ScrollView>

      <EditWorkoutModal
        visible={modalVisible}
        workout={selectedWorkout}
        onClose={() => {
          setModalVisible(false);
          setSelectedWorkout(null);
        }}
        onUpdate={() => {
          setModalVisible(false);
          setSelectedWorkout(null);
        }}
        onDelete={() => {
          setModalVisible(false);
          setSelectedWorkout(null);
        }}
      />
    </>
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
  statsOverview: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  historySection: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
  },
  historyItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 12,
  },
  historyDate: {
    fontSize: 14,
    color: "#666",
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 4,
  },
  exerciseList: {
    marginTop: 4,
  },
  exerciseItem: {
    fontSize: 14,
    color: "#444",
    marginVertical: 2,
  },
  weekSection: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  historySection: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
  },
  emptyText: {
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
    marginVertical: 10,
  },
});

export default Progress;
