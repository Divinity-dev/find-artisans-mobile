import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const reasons = [
  {
    icon: "🛡️",
    title: "Verified Professionals",
    text:
      "Find artisans whose profiles have gone through our verification process.",
  },
  {
    icon: "📍",
    title: "Location-Based Search",
    text:
      "Search by area or discover professionals close to your current location.",
  },
  {
    icon: "★",
    title: "Ratings & Reviews",
    text:
      "See what other customers have to say before making your choice.",
  },
  {
    icon: "☎",
    title: "Direct Contact",
    text:
      "Connect directly with artisans instead of going through unnecessary middlemen.",
  },
];

const WhyFindArtisans = ({ onBrowse }) => {
  return (
    <View style={styles.container}>

      <Text style={styles.eyebrow}>
        WHY FINDARTISANS?
      </Text>

      <Text style={styles.title}>
        Stop searching blindly.
      </Text>

      <Text style={styles.orangeTitle}>
        Start choosing confidently.
      </Text>

      <Text style={styles.description}>
        Finding a skilled professional shouldn't depend
        on asking five different people for recommendations.
        FindArtisans puts useful information in one place
        so you can make a better decision.
      </Text>

      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.button}
        onPress={onBrowse}
      >
        <Text style={styles.buttonText}>
          Browse all artisans →
        </Text>
      </TouchableOpacity>

      <View style={styles.reasons}>

        {reasons.map((reason) => (
          <View
            key={reason.title}
            style={styles.reasonCard}
          >
            <View style={styles.iconBox}>
              <Text style={styles.icon}>
                {reason.icon}
              </Text>
            </View>

            <Text style={styles.reasonTitle}>
              {reason.title}
            </Text>

            <Text style={styles.reasonText}>
              {reason.text}
            </Text>
          </View>
        ))}

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

  eyebrow: {
    color: "#f97316",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
  },

  title: {
    color: "#ffffff",
    fontSize: 31,
    lineHeight: 39,
    fontWeight: "800",
    marginTop: 10,
  },

  orangeTitle: {
    color: "#f97316",
    fontSize: 31,
    lineHeight: 39,
    fontWeight: "800",
  },

  description: {
    color: "#9ca3af",
    fontSize: 14,
    lineHeight: 24,
    marginTop: 18,
  },

  button: {
    alignSelf: "flex-start",
    backgroundColor: "#f97316",
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginTop: 24,
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
  },

  reasons: {
    marginTop: 30,
  },

  reasonCard: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 18,
    padding: 20,
    marginBottom: 12,
  },

  iconBox: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: "rgba(249, 115, 22, 0.10)",
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    fontSize: 19,
  },

  reasonTitle: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "800",
    marginTop: 15,
  },

  reasonText: {
    color: "#9ca3af",
    fontSize: 13,
    lineHeight: 21,
    marginTop: 7,
  },
});

export default WhyFindArtisans;