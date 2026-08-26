import React from "react";
import { StyleSheet, Text, View } from "react-native";

const TrustIndicators = () => {
  return (
    <View style={styles.container}>

      <View style={styles.item}>
        <Text style={styles.icon}>✓</Text>

        <Text style={styles.text}>
          Verified professionals
        </Text>
      </View>

      <View style={styles.item}>
        <Text style={styles.icon}>📍</Text>

        <Text style={styles.text}>
          Search anywhere in Nigeria
        </Text>
      </View>

      <View style={styles.item}>
        <Text style={styles.icon}>★</Text>

        <Text style={styles.text}>
          Ratings & reviews
        </Text>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: "#030712",
    gap: 14,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },

  icon: {
    fontSize: 18,
    marginRight: 9,
    color: "#f97316",
  },

  text: {
    color: "#9ca3af",
    fontSize: 13,
    fontWeight: "600",
  },
});

export default TrustIndicators;