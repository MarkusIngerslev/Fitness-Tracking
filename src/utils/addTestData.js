// src/utils/addTestData.js
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { auth } from "../firebase";

export const addTestWorkouts = async () => {
  const userId = auth.currentUser?.uid;
  if (!userId) return;

  const sampleWorkouts = [
    {
      userId: userId,
      name: "Upper Body Power",
      date: "2024-02-15T10:30:00.000Z",
      exercises: [
        { name: "Bench Press", sets: "4", reps: "8" },
        { name: "Military Press", sets: "3", reps: "10" },
        { name: "Bent Over Rows", sets: "4", reps: "12" },
      ],
    },
    {
      userId: userId,
      name: "Leg Day",
      date: "2024-02-20T15:45:00.000Z",
      exercises: [
        { name: "Squats", sets: "5", reps: "5" },
        { name: "Romanian Deadlifts", sets: "3", reps: "12" },
        { name: "Leg Press", sets: "4", reps: "10" },
      ],
    },
    {
      userId: userId,
      name: "Full Body",
      date: "2024-03-01T08:15:00.000Z",
      exercises: [
        { name: "Deadlifts", sets: "3", reps: "5" },
        { name: "Pull-ups", sets: "4", reps: "8" },
        { name: "Push-ups", sets: "3", reps: "15" },
      ],
    },
  ];

  try {
    const db = getFirestore();
    for (const workout of sampleWorkouts) {
      await addDoc(collection(db, "workouts"), workout);
    }
    console.log("Test data added successfully");
  } catch (error) {
    console.error("Error adding test data:", error);
  }
};
