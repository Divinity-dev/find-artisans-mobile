import React from "react";
import { StyleSheet, Text, View } from "react-native";

const steps = [
  {
    number: "01",
    icon: "🔍",
    title: "Find",
    description:
      "Search by your area or use your location to discover nearby artisans.",
  },
  {
    number: "02",
    icon: "✓",
    title: "Verify",
    description:
      "Look for verified profiles and learn more about the artisan before contacting them.",
  },
  {
    number: "03",
    icon: "★",
    title: "Compare",
    description:
      "Compare experience, skills, ratings and reviews to make a confident choice.",
  },
  {
    number: "04",
    icon: "💬",
    title: "Connect",
    description:
      "Contact your preferred artisan directly and discuss the job.",
  },
];

const HowItWorks = () => {
  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.eyebrow}>
          SIMPLE FROM START TO FINISH
        </Text>

        <Text style={styles.title}>
          Find. Verify. Connect.
        </Text>

        <Text style={styles.description}>
          We make it easier to discover the right
          professional without wasting time asking
          around.
        </Text>
      </View>

      {steps.map((step) => (
        <View
          key={step.number}
          style={styles.card}
        >
          <View style={styles.cardHeader}>

            <View style={styles.iconBox}>
              <Text style={styles.icon}>
                {step.icon}
              </Text>
            </View>

            <Text style={styles.number}>
              {step.number}
            </Text>

          </View>

          <Text style={styles.stepTitle}>
            {step.title}
          </Text>

          <Text style={styles.stepDescription}>
            {step.description}
          </Text>
        </View>
      ))}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#111827",
    paddingHorizontal: 20,
    paddingVertical: 70,
  },

  header: {
    alignItems: "center",
    marginBottom: 30,
  },

  eyebrow: {
    color: "#f97316",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.4,
    textAlign: "center",
  },

  title: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 10,
  },

  description: {
    color: "#9ca3af",
    fontSize: 14,
    lineHeight: 23,
    textAlign: "center",
    marginTop: 14,
  },

  card: {
    backgroundColor: "#030712",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 20,
    padding: 22,
    marginBottom: 14,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: "rgba(249, 115, 22, 0.10)",
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    fontSize: 21,
  },

  number: {
    color: "#374151",
    fontSize: 38,
    fontWeight: "900",
  },

  stepTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
    marginTop: 20,
  },

  stepDescription: {
    color: "#9ca3af",
    fontSize: 14,
    lineHeight: 23,
    marginTop: 8,
  },
});

export default HowItWorks;