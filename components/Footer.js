import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Footer = ({
  onHome,
  onWorkers,
  onRegister,
}) => {
  return (
    <View style={styles.container}>

      {/* Brand */}

      <View style={styles.brandSection}>

        <Text style={styles.logo}>
          Find<Text style={styles.orange}>Artisans</Text>
        </Text>

        <Text style={styles.tagline}>
          Find the right artisan without the guesswork.
        </Text>

      </View>


      {/* Quick links */}

      <View style={styles.section}>

        <Text style={styles.heading}>
          Quick Links
        </Text>

        <TouchableOpacity
          onPress={onHome}
          style={styles.linkButton}
        >
          <Text style={styles.link}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onWorkers}
          style={styles.linkButton}
        >
          <Text style={styles.link}>
            Browse Artisans
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onRegister}
          style={styles.linkButton}
        >
          <Text style={styles.link}>
            Join FindArtisans
          </Text>
        </TouchableOpacity>

      </View>


      {/* For artisans */}

      <View style={styles.section}>

        <Text style={styles.heading}>
          For Artisans
        </Text>

        <Text style={styles.description}>
          Get discovered by customers looking
          for skilled professionals in your area.
        </Text>

        <TouchableOpacity
          onPress={onRegister}
          style={styles.footerButton}
        >
          <Text style={styles.footerButtonText}>
            Create your profile
          </Text>
        </TouchableOpacity>

      </View>


      {/* Bottom */}

      <View style={styles.divider} />

      <Text style={styles.copyright}>
        © {new Date().getFullYear()} FindArtisans.
        {"\n"}
        All rights reserved.
      </Text>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#020617",
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 35,
  },

  brandSection: {
    marginBottom: 40,
  },

  logo: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "900",
  },

  orange: {
    color: "#f97316",
  },

  tagline: {
    color: "#6b7280",
    fontSize: 13,
    lineHeight: 21,
    marginTop: 10,
    maxWidth: 280,
  },

  section: {
    marginBottom: 32,
  },

  heading: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 14,
  },

  linkButton: {
    paddingVertical: 6,
  },

  link: {
    color: "#9ca3af",
    fontSize: 14,
  },

  description: {
    color: "#6b7280",
    fontSize: 13,
    lineHeight: 21,
    maxWidth: 330,
  },

  footerButton: {
    alignSelf: "flex-start",
    marginTop: 15,
    borderWidth: 1,
    borderColor: "rgba(249, 115, 22, 0.40)",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },

  footerButtonText: {
    color: "#fb923c",
    fontSize: 13,
    fontWeight: "700",
  },

  divider: {
    height: 1,
    backgroundColor: "#1f2937",
    marginBottom: 20,
  },

  copyright: {
    color: "#4b5563",
    fontSize: 12,
    lineHeight: 19,
    textAlign: "center",
  },
});

export default Footer;