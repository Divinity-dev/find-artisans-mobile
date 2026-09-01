import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const FindWaysSection = ({ onBrowse }) => {
  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>

        <Text style={styles.eyebrow}>
          FIND YOUR WAY
        </Text>

        <Text style={styles.title}>
          Two simple ways to find{"\n"}
          <Text style={styles.orangeText}>
            the right person.
          </Text>
        </Text>

        <Text style={styles.description}>
          Whether you know exactly where you need
          help or simply want to know who is closest
          to you, FindArtisans makes the search simple.
        </Text>

      </View>


      {/* Search by area */}
      <View style={styles.card}>

        <View style={styles.iconBox}>
          <Text style={styles.icon}>
            🔍
          </Text>
        </View>

        <Text style={styles.option}>
          OPTION 01
        </Text>

        <Text style={styles.cardTitle}>
          Search by area
        </Text>

        <Text style={styles.cardDescription}>
          Know where you need a service? Select the
          state, city and local government area where
          you want to find an artisan.
        </Text>

        <View style={styles.locationSteps}>

          <View style={styles.step}>
            <Text style={styles.stepText}>
              State
            </Text>
          </View>

          <Text style={styles.arrow}>
            →
          </Text>

          <View style={styles.step}>
            <Text style={styles.stepText}>
              City
            </Text>
          </View>

          <Text style={styles.arrow}>
            →
          </Text>

          <View style={styles.step}>
            <Text style={styles.stepText}>
              LGA
            </Text>
          </View>

        </View>

        <View style={styles.bottomText}>
          <Text style={styles.check}>
            ✓
          </Text>

          <Text style={styles.bottomTextLabel}>
            Great when you know the area
          </Text>
        </View>

      </View>


      {/* Find near you */}
      <View style={styles.nearbyCard}>

        <View style={styles.nearbyIconBox}>
          <Text style={styles.nearbyIcon}>
            📍
          </Text>
        </View>

        <Text style={styles.nearbyOption}>
          OPTION 02
        </Text>

        <Text style={styles.cardTitle}>
          Find artisans near you
        </Text>

        <Text style={styles.cardDescription}>
          Don't know the area? Let your location do
          the work. Choose how far you want us to
          search and discover artisans around you.
        </Text>

        <View style={styles.distanceContainer}>

          {[1, 3, 5, 10].map((distance) => (
            <View
              key={distance}
              style={styles.distance}
            >
              <Text style={styles.stepText}>
                {distance} km
              </Text>
            </View>
          ))}

        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onBrowse}
          style={styles.bottomText}
        >
          <Text style={styles.check}>
            ✓
          </Text>

          <Text style={styles.nearbyBottomText}>
            Great when you need someone close
          </Text>
        </TouchableOpacity>

      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#030712",
    paddingHorizontal: 20,
    paddingVertical: 70,
  },

  header: {
    alignItems: "center",
    marginBottom: 30,
  },

  eyebrow: {
    color: "#f97316",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
  },

  title: {
    color: "#ffffff",
    fontSize: 30,
    lineHeight: 38,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 10,
  },

  orangeText: {
    color: "#f97316",
  },

  description: {
    color: "#9ca3af",
    fontSize: 14,
    lineHeight: 23,
    textAlign: "center",
    marginTop: 16,
  },

  card: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 24,
    padding: 24,
    marginBottom: 18,
  },

  nearbyCard: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "rgba(249, 115, 22, 0.25)",
    borderRadius: 24,
    padding: 24,
  },

  iconBox: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: "rgba(249, 115, 22, 0.10)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  nearbyIconBox: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: "rgba(59, 130, 246, 0.10)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  icon: {
    fontSize: 23,
  },

  nearbyIcon: {
    fontSize: 23,
  },

  option: {
    color: "#f97316",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
  },

  nearbyOption: {
    color: "#60a5fa",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
  },

  cardTitle: {
    color: "#ffffff",
    fontSize: 23,
    fontWeight: "800",
    marginTop: 10,
  },

  cardDescription: {
    color: "#9ca3af",
    fontSize: 14,
    lineHeight: 23,
    marginTop: 12,
  },

  locationSteps: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 22,
  },

  step: {
    backgroundColor: "#1f2937",
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  stepText: {
    color: "#d1d5db",
    fontSize: 12,
    fontWeight: "600",
  },

  arrow: {
    color: "#6b7280",
    fontSize: 15,
    marginHorizontal: 7,
  },

  distanceContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 22,
  },

  distance: {
    backgroundColor: "#1f2937",
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  bottomText: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 22,
  },

  check: {
    color: "#22c55e",
    fontSize: 16,
    fontWeight: "800",
    marginRight: 8,
  },

  bottomTextLabel: {
    color: "#fb923c",
    fontSize: 13,
    fontWeight: "700",
  },

  nearbyBottomText: {
    color: "#60a5fa",
    fontSize: 13,
    fontWeight: "700",
  },
});

export default FindWaysSection;