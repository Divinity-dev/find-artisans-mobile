import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import LocationSelector from "../components/LocationSelector";
import ServiceSearch from "../components/ServiceSearch";

const HomeScreen = () => {
    const [selectedLocation, setSelectedLocation] = useState({
  state: "",
  city: "",
  lga: "",
});
const [selectedService, setSelectedService] = useState("");
const handleSearch = () => {
  console.log("Service:", selectedService);
  console.log("Location:", selectedLocation);
};
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.hero}>

          {/* Background image */}
          <Image
            source={require("../assets/images/download.jpeg")}
            style={styles.backgroundImage}
            resizeMode="cover"
          />

          {/* Dark overlay */}
          <View style={styles.overlay} />

          {/* Hero content */}
          <View style={styles.content}>

            {/* Badge */}
            <View style={styles.badge}>
              <Text style={styles.badgeIcon}>✓</Text>

              <Text style={styles.badgeText}>
                Nigeria's trusted artisan marketplace
              </Text>
            </View>

            {/* Heading */}
            <Text style={styles.title}>
              Find the Right{" "}
              <Text style={styles.orangeText}>
                Artisan
              </Text>
              {"\n"}
              Without the Guesswork.
            </Text>

            {/* Description */}
            <Text style={styles.description}>
              Find verified electricians, plumbers, mechanics,
              cleaners, carpenters and other skilled
              professionals — wherever you are in Nigeria.
            </Text>

            {/* Search panel */}
            <View style={styles.searchPanel}>

              <Text style={styles.searchTitle}>
                Find an artisan
              </Text>

              <Text style={styles.searchSubtitle}>
                Search an area or let us find artisans around you.
              </Text>

              {/* Profession */}
              <ServiceSearch
  value={selectedService}
  onServiceChange={setSelectedService}
/>

              {/* Location */}
              <LocationSelector
  selectedLocation={selectedLocation}
  onLocationChange={setSelectedLocation}
/>
{/* Search artisans */}
<TouchableOpacity
  activeOpacity={0.8}
  style={styles.searchButton}
  onPress={handleSearch}
>
  <Text style={styles.searchButtonText}>
    Search artisans
  </Text>
</TouchableOpacity>

              {/* Find near me */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.nearMeButton}
              >

                <Text style={styles.nearMeIcon}>
                  📍
                </Text>

                <Text style={styles.nearMeText}>
                  Find artisans near me
                </Text>

              </TouchableOpacity>

            </View>

          </View>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030712",
  },

  scrollContent: {
    flexGrow: 1,
  },

  hero: {
    position: "relative",
    overflow: "hidden",
    minHeight: 850,
  },

  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.80)",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 50,
    alignItems: "center",
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 30,
    backgroundColor: "rgba(249, 115, 22, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(249, 115, 22, 0.35)",
    marginBottom: 24,
  },

  badgeIcon: {
    color: "#22c55e",
    fontSize: 15,
    fontWeight: "800",
    marginRight: 7,
  },

  badgeText: {
    color: "#fb923c",
    fontSize: 12,
    fontWeight: "700",
  },

  title: {
    color: "#ffffff",
    fontSize: 38,
    lineHeight: 46,
    fontWeight: "800",
    textAlign: "center",
  },

  orangeText: {
    color: "#f97316",
  },

  description: {
    color: "#d1d5db",
    fontSize: 15,
    lineHeight: 24,
    textAlign: "center",
    marginTop: 20,
    maxWidth: 370,
  },

  searchPanel: {
    width: "100%",
    marginTop: 30,
    padding: 18,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.10)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },

  searchTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },

  searchSubtitle: {
    color: "#9ca3af",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 5,
    marginBottom: 16,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    paddingHorizontal: 14,
    minHeight: 54,
  },

  inputIcon: {
    fontSize: 18,
    marginRight: 10,
  },

  input: {
    flex: 1,
    color: "#111827",
    fontSize: 15,
    paddingVertical: 14,
  },

  locationSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    paddingHorizontal: 14,
    minHeight: 64,
    marginTop: 12,
  },

  locationIcon: {
    fontSize: 20,
    marginRight: 12,
  },

  locationTextContainer: {
    flex: 1,
  },

  locationTitle: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "600",
  },

  locationSubtitle: {
    color: "#6b7280",
    fontSize: 12,
    marginTop: 3,
  },

  chevron: {
    color: "#6b7280",
    fontSize: 28,
    fontWeight: "300",
    marginLeft: 8,
  },

  nearMeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f97316",
    borderRadius: 14,
    minHeight: 54,
    marginTop: 12,
  },

  nearMeIcon: {
    fontSize: 18,
    marginRight: 8,
  },

  nearMeText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },

  searchButton: {
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#f97316",
  borderRadius: 14,
  minHeight: 54,
  marginTop: 12,
},

searchButtonText: {
  color: "#ffffff",
  fontSize: 15,
  fontWeight: "700",
},
});

export default HomeScreen;