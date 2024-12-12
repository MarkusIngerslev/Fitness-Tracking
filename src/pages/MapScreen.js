import React, { useState, useEffect } from "react";
import { Alert, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MapView, { Polyline, Marker } from "react-native-maps";
import * as Location from "expo-location";
import CompletedRoutesMenu from "../components/CompletedRoutesMenu";
import Icon from "react-native-vector-icons/MaterialIcons";
import Toast from "react-native-toast-message";
import {
  getFirestore,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth } from "../firebase";

// helpers
import {
  calculateMapBounds,
  calculateDistance,
  getRandomColor,
} from "../utils/mapHelpers";

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [followsUser, setFollowsUser] = useState(true);

  const [errorMsg, setErrorMsg] = useState(null);

  const [menuVisible, setMenuVisible] = useState(false);
  const [completedRoutes, setCompletedRoutes] = useState([]);
  const [selectedRouteId, setSelectedRouteId] = useState(null);

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

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const db = getFirestore();
        const routesRef = collection(db, "routes");
        const q = query(routesRef, where("userId", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);

        const routes = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCompletedRoutes(routes);
      } catch (error) {
        console.error("Error fetching routes:", error);
      }
    };

    fetchRoutes();
  }, []);

  const handleRouteSelect = (route) => {
    if (selectedRouteId === route.id) {
      setSelectedRouteId(null);
      setRouteCoordinates([]);
    } else {
      setSelectedRouteId(route.id);
      if (route.coordinates && route.coordinates.length > 0) {
        setRouteCoordinates(route.coordinates);
        const bounds = calculateMapBounds(route.coordinates);
        if (bounds) {
          mapRef.current?.animateToRegion(bounds, 1000);
        }
      }
    }
  };

  const mapRef = React.useRef(null);

  const toggleTracking = async () => {
    if (isTracking) {
      setIsTracking(false);
      try {
        const db = getFirestore();
        const routeData = {
          id: Date.now().toString(), // Add unique ID
          userId: auth.currentUser.uid,
          date: new Date().toISOString(),
          coordinates: routeCoordinates,
          distance: calculateDistance(routeCoordinates),
          color: getRandomColor(),
        };

        const docRef = await addDoc(collection(db, "routes"), routeData);
        setCompletedRoutes((prev) => [
          ...prev,
          { ...routeData, id: docRef.id },
        ]);
      } catch (error) {
        console.error("Error saving route:", error);
      }
    } else {
      setIsTracking(true);
      setRouteCoordinates([]);
    }
  };

  if (!location) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const handleDeleteRoute = async (routeId) => {
    Alert.alert("Delete Route", "Are you sure you want to delete this route?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const db = getFirestore();
            await deleteDoc(doc(db, "routes", routeId));
            setCompletedRoutes((prev) =>
              prev.filter((route) => route.id !== routeId)
            );
            if (selectedRouteId === routeId) {
              setSelectedRouteId(null);
              setRouteCoordinates([]);
            }
            Toast.show({
              type: "success",
              text1: "Route deleted",
              text2: "The route was successfully deleted",
              visibilityTime: 2000,
            });
          } catch (error) {
            console.error("Error deleting route:", error);
            Toast.show({
              type: "error",
              text1: "Error",
              text2: "Failed to delete route",
              visibilityTime: 2000,
            });
          }
        },
      },
    ]);
  };

  const handleMapMovement = () => {
    if (followsUser) {
      setFollowsUser(false);
    }
  };

  const centerMapOnUser = () => {
    if (location?.coords) {
      mapRef.current?.animateToRegion(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        1000
      );
      setFollowsUser(true);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: location?.coords.latitude || 0,
            longitude: location?.coords.longitude || 0,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
          followsUserLocation={followsUser}
          onPanDrag={handleMapMovement}
          onRegionChangeComplete={handleMapMovement}
        >
          {routeCoordinates.length > 0 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeWidth={4}
              strokeColor={
                selectedRouteId
                  ? completedRoutes.find((r) => r.id === selectedRouteId)
                      ?.color || "#FF0000"
                  : "#FF0000"
              }
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

        {/* Center button */}
        {!followsUser && (
          <TouchableOpacity
            style={styles.centerButton}
            onPress={centerMapOnUser}
          >
            <Icon name="gps-fixed" size={24} color="#000" />
          </TouchableOpacity>
        )}

        {/* Routes menu overlay */}
        {menuVisible && (
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={() => setMenuVisible(false)}
          />
        )}

        <TouchableOpacity
          style={styles.routeMenu}
          onPress={() => setMenuVisible(!menuVisible)}
        >
          <Icon name="menu" size={24} color="#000" />
        </TouchableOpacity>

        <CompletedRoutesMenu
          visible={menuVisible}
          routes={completedRoutes}
          onRouteSelect={handleRouteSelect}
          selectedRouteId={selectedRouteId}
          onDeleteRoute={handleDeleteRoute}
        />
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
  routeMenu: {
    position: "absolute",
    top: 60,
    left: 20,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 25,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 100,
    backgroundColor: "transparent",
    zIndex: 999,
  },
  centerButton: {
    position: "absolute",
    top: 60,
    left: 70,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 25,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default MapScreen;
