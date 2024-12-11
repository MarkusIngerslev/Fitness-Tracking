import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
} from "react-native";

const CompletedRoutesMenu = ({
  visible,
  routes,
  onRouteSelect,
  selectedRouteId,
}) => {
  const slideAnim = React.useRef(new Animated.Value(-300)).current;

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -300,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateX: slideAnim }],
        },
      ]}
    >
      <ScrollView>
        {routes.map((route) => (
          <TouchableOpacity
            key={route.id}
            style={[
              styles.routeItem,
              selectedRouteId === route.id && styles.selectedRoute,
            ]}
            onPress={() => onRouteSelect(route)}
          >
            <Text
              style={[
                styles.routeText,
                selectedRouteId === route.id && styles.selectedRouteText,
              ]}
            >
              {new Date(route.date).toLocaleDateString()}
            </Text>
            <Text style={styles.distanceText}>
              {route.distance ? `${route.distance.toFixed(2)} km` : "N/A"}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    top: 110,
    bottom: 100,
    width: 200,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    elevation: 5,
    zIndex: 1000,
  },
  routeItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  routeText: {
    fontSize: 16,
    marginBottom: 4,
  },
  distanceText: {
    fontSize: 14,
    color: "#666",
  },
  selectedRoute: {
    backgroundColor: "rgba(76, 175, 80, 0.2)",
  },
  selectedRouteText: {
    fontWeight: "bold",
  },
});

export default CompletedRoutesMenu;
