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
    workoutHistory: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = () => {};

    const initializeData = async () => {
      try {
        // Wait for auth to be ready
        const userId = auth.currentUser?.uid;
        if (!userId) {
          console.log("No user ID available");
          setLoading(false);
          return;
        }

        const db = getFirestore();
        const workoutsRef = collection(db, "workouts");
        const userWorkoutsQuery = query(
          workoutsRef,
          where("userId", "==", userId)
        );

        unsubscribe = onSnapshot(userWorkoutsQuery, (snapshot) => {
          try {
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
              lastWorkout: workouts[0],
              workoutHistory: workouts,
            });
          } catch (error) {
            console.error("Error processing workouts:", error);
          } finally {
            setLoading(false);
          }
        });
      } catch (error) {
        console.error("Error initializing data:", error);
        setLoading(false);
      }
    };

    // Start loading data
    initializeData();

    return () => unsubscribe();
  }, []);

  return { stats, loading };
};
