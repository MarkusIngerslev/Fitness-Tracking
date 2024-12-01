// src/hooks/useTrainingData.js
import { useState, useEffect } from "react";
import { auth } from "../firebase";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

export const useTrainingData = () => {
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    thisWeekWorkouts: 0,
    lastWorkout: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = getFirestore();
    const userId = auth.currentUser?.uid;

    if (!userId) return;

    const workoutsRef = collection(db, "workouts");
    const userWorkoutsQuery = query(workoutsRef, where("userId", "==", userId));

    const unsubscribe = onSnapshot(userWorkoutsQuery, (snapshot) => {
      const workouts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setStats({
        totalWorkouts: workouts.length,
        thisWeekWorkouts: workouts.filter((w) => {
          const workoutDate = new Date(w.date);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return workoutDate >= weekAgo;
        }).length,
        lastWorkout: workouts.sort((a, b) => b.date - a.date)[0],
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { stats, loading };
};
