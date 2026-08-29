import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

const Footer = ({
  onHome,
  onWorkers,
  onPostJob,
  onJobs,
  onHowItWorks,
  onProfile,
  onLogin,
  onRegister,
  onPrivacy,
}) => {
  const { user, isAuthenticated } = useAuth();

  const isLoggedIn = Boolean(isAuthenticated || user);

  const handleProfile = () => {
    if (!user) {
      onProfile?.();
      return;
    }

    if (user.role === "admin") {
      onProfile?.("admin");
    } else if (user.role === "worker") {
      onProfile?.("worker");
    } else {
      onProfile?.("customer");
    }
  };

  return (
    <View style={styles.container}>

      {/* MAIN FOOTER CONTENT */}
      <View style={styles.content}>

        {/* BRAND */}
        <View style={styles.section}>
          <Text style={styles.logo}>
            Find
            <Text style={styles.orange}>Artisans</Text>
          </Text>

          <Text style={styles.description}>
            Connect with trusted artisans near you. Hire plumbers,
            electricians, carpenters and more in minutes.
          </Text>
        </View>


        {/* QUICK LINKS */}
        <View style={styles.section}>
          <Text style={styles.heading}>
            Quick Links
          </Text>

          <TouchableOpacity
            onPress={onWorkers}
            style={styles.linkButton}
            activeOpacity={0.7}
          >
            <Text style={styles.link}>
              Find Workers
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onPostJob}
            style={styles.linkButton}
            activeOpacity={0.7}
          >
            <Text style={styles.link}>
              Post a Job
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onJobs}
            style={styles.linkButton}
            activeOpacity={0.7}
          >
            <Text style={styles.link}>
              Browse Jobs
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onHowItWorks}
            style={styles.linkButton}
            activeOpacity={0.7}
          >
            <Text style={styles.link}>
              How It Works
            </Text>
          </TouchableOpacity>
        </View>


        {/* SUPPORT */}
        <View style={styles.section}>
          <Text style={styles.heading}>
            Support
          </Text>

          {isLoggedIn ? (
            <TouchableOpacity
              onPress={handleProfile}
              style={styles.linkButton}
              activeOpacity={0.7}
            >
              <Text style={styles.link}>
                My Profile
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                onPress={onLogin}
                style={styles.linkButton}
                activeOpacity={0.7}
              >
                <Text style={styles.link}>
                  Login
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onRegister}
                style={styles.linkButton}
                activeOpacity={0.7}
              >
                <Text style={styles.link}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            onPress={onPrivacy}
            style={styles.linkButton}
            activeOpacity={0.7}
          >
            <Text style={styles.link}>
              Privacy Policy
            </Text>
          </TouchableOpacity>
        </View>


        {/* CONTACT */}
        <View style={styles.section}>
          <Text style={styles.heading}>
            Contact
          </Text>

          {/* LOCATION */}
          <View style={styles.contactRow}>
            <Ionicons
              name="location-outline"
              size={17}
              color="#f97316"
              style={styles.contactIcon}
            />

            <Text style={styles.contactText}>
              Benin City, Edo State, Nigeria
            </Text>
          </View>


          {/* PHONE */}
          <View style={styles.contactRow}>
            <Ionicons
              name="call-outline"
              size={17}
              color="#f97316"
              style={styles.contactIcon}
            />

            <Text style={styles.contactText}>
              +2348069715964
            </Text>
          </View>


          {/* EMAIL */}
          <View style={styles.contactRow}>
            <Ionicons
              name="mail-outline"
              size={17}
              color="#f97316"
              style={styles.contactIcon}
            />

            <Text style={styles.contactText}>
              divine_asiriuwa@yahoo.com
            </Text>
          </View>
        </View>

      </View>


      {/* BOTTOM BAR */}
      <View style={styles.bottomBar}>

        <Text style={styles.copyright}>
          © {new Date().getFullYear()} FindArtisans.
          {"\n"}
          All rights reserved.
        </Text>

        <Text style={styles.bottomTagline}>
          Built for trusted local hiring
        </Text>

      </View>

    </View>
  );
};


const styles = StyleSheet.create({

  container: {
    backgroundColor: "#030712",
    borderTopWidth: 1,
    borderTopColor: "#1f2937",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 15,
  },

  section: {
    marginBottom: 35,
  },

  /* BRAND */

  logo: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "800",
  },

  orange: {
    color: "#f97316",
  },

  description: {
    color: "#9ca3af",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 12,
    maxWidth: 340,
  },

  /* HEADINGS */

  heading: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 12,
  },

  /* LINKS */

  linkButton: {
    paddingVertical: 5,
    alignSelf: "flex-start",
  },

  link: {
    color: "#9ca3af",
    fontSize: 14,
  },

  /* CONTACT */

  contactRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
    paddingRight: 10,
  },

  contactIcon: {
    marginRight: 9,
    marginTop: 2,
  },

  contactText: {
    color: "#9ca3af",
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },

  /* BOTTOM BAR */

  bottomBar: {
    borderTopWidth: 1,
    borderTopColor: "#1f2937",
    paddingHorizontal: 20,
    paddingVertical: 18,
    alignItems: "center",
  },

  copyright: {
    color: "#6b7280",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },

  bottomTagline: {
    color: "#f97316",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
  },

});

export default Footer;