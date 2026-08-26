import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const FinalCTA = ({
  onBrowse,
  onJoin,
}) => {
  return (
    <View style={styles.container}>

      <View style={styles.card}>

        <Text style={styles.eyebrow}>
          YOUR NEXT JOB STARTS HERE
        </Text>

        <Text style={styles.title}>
          Need a skilled artisan?
        </Text>

        <Text style={styles.description}>
          Find someone you can trust, check their
          profile, compare your options and get in touch.
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.browseButton}
          onPress={onBrowse}
        >
          <Text style={styles.browseText}>
            Browse artisans →
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.joinButton}
          onPress={onJoin}
        >
          <Text style={styles.joinText}>
            Join FindArtisans
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
    paddingVertical: 50,
  },

  card: {
    backgroundColor: "#f97316",
    borderRadius: 26,
    padding: 28,
    overflow: "hidden",
  },

  eyebrow: {
    color: "#ffedd5",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.4,
  },

  title: {
    color: "#ffffff",
    fontSize: 31,
    lineHeight: 39,
    fontWeight: "900",
    marginTop: 10,
  },

  description: {
    color: "#fff7ed",
    fontSize: 14,
    lineHeight: 23,
    marginTop: 14,
  },

  browseButton: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
  },

  browseText: {
    color: "#ea580c",
    fontSize: 14,
    fontWeight: "800",
  },

  joinButton: {
    backgroundColor: "rgba(0, 0, 0, 0.20)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 14,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  joinText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
  },
});

export default FinalCTA;