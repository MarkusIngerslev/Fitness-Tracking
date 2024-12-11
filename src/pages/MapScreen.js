import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MapView, { Polyline, Marker } from "react-native-maps";
import * as Location from "expo-location";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import { auth } from "../firebase";

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  useEffect(() => {
    let locationSubscription = null;

    const startTracking = async () => {
      if (isTracking) {
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 1000,
            distanceInterval: 10,
          },
          (newLocation) => {
            setRouteCoordinates((prevCoordinates) => [
              ...prevCoordinates,
              {
                latitude: newLocation.coords.latitude,
                longitude: newLocation.coords.longitude,
              },
            ]);
          }
        );
      }
    };

    startTracking();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [isTracking]);

  const toggleTracking = () => {
    if (isTracking) {
      saveRoute();
    }
    setIsTracking(!isTracking);
  };

  const saveRoute = async () => {
    try {
      const db = getFirestore();
      await addDoc(collection(db, "routes"), {
        userId: auth.currentUser.uid,
        coordinates: routeCoordinates,
        date: new Date().toISOString(),
        distance: calculateDistance(routeCoordinates),
      });
      setRouteCoordinates([]);
    } catch (error) {
      console.error("Error saving route:", error);
    }
  };

  const calculateDistance = (coordinates) => {
    // Basic distance calculation - can be improved
    let distance = 0;
    for (let i = 0; i < coordinates.length - 1; i++) {
      const lat1 = coordinates[i].latitude;
      const lon1 = coordinates[i].longitude;
      const lat2 = coordinates[i + 1].latitude;
      const lon2 = coordinates[i + 1].longitude;
      distance += getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2);
    }
    return distance;
  };

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  if (!location) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {/* Tilføj markør for brugerens position */}
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Du er her"
          />
          {routeCoordinates.length > 0 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeWidth={4}
              strokeColor="#FF0000"
            />
          )}
        </MapView>

        <View style={styles.navbar}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Tilbage</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navButton,
              isTracking ? styles.stopButton : styles.startButton,
            ]}
            onPress={toggleTracking}
          >
            <Text style={styles.buttonText}>
              {isTracking ? "Stop Tracking" : "Start Tracking"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    paddingBottom: 25,
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    backgroundColor: "#4CAF50",
    minWidth: 120,
    alignItems: "center",
  },
  startButton: {
    backgroundColor: "#4CAF50",
  },
  stopButton: {
    backgroundColor: "#f44336",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MapScreen;
