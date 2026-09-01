import { useState, useCallback } from "react";
import * as Location from "expo-location";

const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getLocation = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // 1. Check if device location services (GPS toggle) are enabled
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        setError(
          "Location services are turned off on your device. Please enable GPS and try again."
        );
        setLoading(false);
        return null;
      }

      // 2. Request permission to access foreground location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError(
          "Location permission was denied. Please allow location access to find artisans near you."
        );
        setLoading(false);
        return null;
      }

      // 3. Obtain position with Balanced accuracy fallback & speed optimizations
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced, // High can stall outdoors/indoor transitions
      });

      const coordinates = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

      setLocation(coordinates);
      return coordinates;
    } catch (err) {
      console.error("Geolocation error:", err);
      setError("Unable to get your current location. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    location,
    loading,
    error,
    getLocation,
  };
};

export default useGeolocation;