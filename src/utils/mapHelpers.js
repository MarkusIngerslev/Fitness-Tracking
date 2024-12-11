export const calculateMapBounds = (coordinates) => {
  if (!coordinates || coordinates.length === 0) return null;

  let minLat = coordinates[0].latitude;
  let maxLat = coordinates[0].latitude;
  let minLng = coordinates[0].longitude;
  let maxLng = coordinates[0].longitude;

  coordinates.forEach((coord) => {
    minLat = Math.min(minLat, coord.latitude);
    maxLat = Math.max(maxLat, coord.latitude);
    minLng = Math.min(minLng, coord.longitude);
    maxLng = Math.max(maxLng, coord.longitude);
  });

  const padding = 0.001; // Adjust padding as needed
  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: maxLat - minLat + padding * 2,
    longitudeDelta: maxLng - minLng + padding * 2,
  };
};

export const getRandomColor = () => {
  const colors = [
    "#FF0000", // Red
    "#00FF00", // Green
    "#0000FF", // Blue
    "#FFA500", // Orange
    "#800080", // Purple
    "#008080", // Teal
    "#FF69B4", // Hot Pink
    "#4B0082", // Indigo
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const calculateDistance = (coordinates) => {
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
