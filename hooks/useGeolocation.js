import { useState } from "react";
import * as Location from "expo-location";

const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getLocation = async () => {
    try {
      setLoading(true);
      setError("");

      // Request permission to use the device location
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setError(
          "Location permission was denied. Please allow location access to find artisans near you."
        );

        setLoading(false);
        return null;
      }

      // Get the current device location
      const currentLocation =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

      const coordinates = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

      setLocation(coordinates);

      return coordinates;
    } catch (err) {
      console.error("Geolocation error:", err);

      setError(
        "Unable to get your current location. Please try again."
      );

      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    location,
    loading,
    error,
    getLocation,
  };
};

export default useGeolocation;

