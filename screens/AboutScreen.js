import React from "react";

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AboutScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>

      <Navbar />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* HERO SECTION */}

        <View style={styles.hero}>

          <Text style={styles.heroTitle}>
            About{" "}
            <Text style={styles.orange}>
              Find Artisans
            </Text>
          </Text>

          <Text style={styles.heroDescription}>
            Find Artisans is a trusted marketplace that connects
            skilled workers with people who need their services —
            safely, quickly, and reliably.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate("Workers")}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>
              Find Skilled Workers
            </Text>
          </TouchableOpacity>

        </View>


        {/* WHO WE ARE */}

        <View style={styles.section}>

          <View style={styles.whoWeAre}>

            <Text style={styles.sectionTitle}>
              Who We Are
            </Text>

            <Text style={styles.bodyText}>
              <Text style={styles.bold}>
                Find Artisans
              </Text>{" "}
              is built to solve one problem: making it easy to
              find trusted, verified, and skilled workers without
              stress or uncertainty.
            </Text>

            <Text style={[styles.bodyText, styles.paragraphSpacing]}>
              From electricians to plumbers, carpenters, cleaners,
              and more — we bring professionals and customers
              together in one reliable platform.
            </Text>

          </View>


          {/* OUR MISSION */}

          <View style={styles.missionCard}>

            <View style={styles.cardHeader}>

              <View style={styles.iconCircle}>

                <Ionicons
                  name="globe-outline"
                  size={21}
                  color="#f97316"
                />

              </View>

              <Text style={styles.cardTitle}>
                Our Mission
              </Text>

            </View>

            <Text style={styles.cardText}>
              To create a transparent, safe, and efficient way
              for people to hire skilled workers, while empowering
              artisans to grow their income and reputation.
            </Text>

          </View>

        </View>


        {/* WHY PEOPLE TRUST US */}

        <View style={styles.featuresSection}>

          <Text style={styles.centerTitle}>
            Why People Trust Us
          </Text>


          {/* VERIFIED WORKERS */}

          <View style={styles.featureCard}>

            <Ionicons
              name="shield-checkmark-outline"
              size={30}
              color="#f97316"
              style={styles.featureIcon}
            />

            <Text style={styles.featureTitle}>
              Verified Workers
            </Text>

            <Text style={styles.featureText}>
              Every artisan undergoes identity and skill
              verification before being listed.
            </Text>

          </View>


          {/* RATINGS & REVIEWS */}

          <View style={styles.featureCard}>

            <Ionicons
              name="star-outline"
              size={30}
              color="#f97316"
              style={styles.featureIcon}
            />

            <Text style={styles.featureTitle}>
              Ratings & Reviews
            </Text>

            <Text style={styles.featureText}>
              Customers can rate workers after each job,
              helping maintain quality and trust.
            </Text>

          </View>


          {/* REAL JOB OPPORTUNITIES */}

          <View style={styles.featureCard}>

            <Ionicons
              name="briefcase-outline"
              size={30}
              color="#f97316"
              style={styles.featureIcon}
            />

            <Text style={styles.featureTitle}>
              Real Job Opportunities
            </Text>

            <Text style={styles.featureText}>
              Workers can find consistent job requests and
              grow their professional reputation.
            </Text>

          </View>

        </View>


        {/* HOW IT WORKS */}

        <View style={styles.section}>

          <Text style={styles.centerTitle}>
            How It Works
          </Text>


          {/* STEP 1 */}

          <View style={styles.step}>

            <View style={styles.stepIcon}>

              <Ionicons
                name="people-outline"
                size={30}
                color="#f97316"
              />

            </View>

            <Text style={styles.stepTitle}>
              1. Create Account
            </Text>

            <Text style={styles.stepText}>
              Sign up as a customer or worker in just a few
              minutes.
            </Text>

          </View>


          {/* STEP 2 */}

          <View style={styles.step}>

            <View style={styles.stepIcon}>

              <Ionicons
                name="briefcase-outline"
                size={30}
                color="#f97316"
              />

            </View>

            <Text style={styles.stepTitle}>
              2. Post or Apply
            </Text>

            <Text style={styles.stepText}>
              Customers post jobs, workers apply or get
              discovered.
            </Text>

          </View>


          {/* STEP 3 */}

          <View style={styles.step}>

            <View style={styles.stepIcon}>

              <Ionicons
                name="checkmark-circle-outline"
                size={30}
                color="#f97316"
              />

            </View>

            <Text style={styles.stepTitle}>
              3. Get Work Done
            </Text>

            <Text style={styles.stepText}>
              Jobs are completed with trust, ratings, and
              secure communication.
            </Text>

          </View>

        </View>


        {/* CALL TO ACTION */}

        <View style={styles.cta}>

          <Text style={styles.ctaTitle}>
            Ready to get started?
          </Text>

          <Text style={styles.ctaText}>
            Join thousands of users already using Find Artisans.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate("Register")}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>
              Get Started
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("Workers")}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>
              Explore Workers
            </Text>
          </TouchableOpacity>

        </View>


        {/* FOOTER */}

        <Footer
          onWorkers={() => navigation.navigate("Workers")}
          onPostJob={() => navigation.navigate("PostJob")}
          onJobs={() => navigation.navigate("Jobs")}
          onHowItWorks={() => navigation.navigate("HowItWorks")}
          onProfile={() => {
            if (navigation) {
              if (user?._id || user?.id) {
                navigation.navigate("CustomerProfile", {
                  customerId: user._id || user.id,
                });
              } else {
                navigation.navigate("CustomerProfile");
              }
            }
          }}
          onLogin={() => navigation.navigate("Login")}
          onRegister={() => navigation.navigate("Register")}
          onPrivacy={() => navigation.navigate("PrivacyPolicy")}
        />

      </ScrollView>

    </SafeAreaView>
  );
};


const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: "#030712",
  },

  scrollContent: {
    backgroundColor: "#030712",
  },

  /* HERO */

  hero: {
    paddingHorizontal: 20,
    paddingVertical: 55,
    alignItems: "center",
    backgroundColor: "#111827",
  },

  heroTitle: {
    color: "#ffffff",
    fontSize: 34,
    fontWeight: "900",
    textAlign: "center",
    lineHeight: 42,
  },

  orange: {
    color: "#f97316",
  },

  heroDescription: {
    color: "#d1d5db",
    fontSize: 16,
    lineHeight: 25,
    textAlign: "center",
    marginTop: 20,
  },

  /* BUTTONS */

  primaryButton: {
    backgroundColor: "#f97316",
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 9,
    marginTop: 25,
  },

  primaryButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },

  secondaryButton: {
    borderWidth: 1,
    borderColor: "#374151",
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 9,
    marginTop: 12,
  },

  secondaryButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },

  /* GENERAL SECTIONS */

  section: {
    paddingHorizontal: 20,
    paddingVertical: 45,
  },

  sectionTitle: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 16,
  },

  bodyText: {
    color: "#d1d5db",
    fontSize: 15,
    lineHeight: 24,
  },

  bold: {
    color: "#ffffff",
    fontWeight: "700",
  },

  paragraphSpacing: {
    marginTop: 12,
  },

  /* MISSION */

  missionCard: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 12,
    padding: 20,
    marginTop: 30,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  iconCircle: {
    marginRight: 10,
  },

  cardTitle: {
    color: "#ffffff",
    fontSize: 19,
    fontWeight: "700",
  },

  cardText: {
    color: "#d1d5db",
    fontSize: 14,
    lineHeight: 22,
  },

  /* FEATURES */

  featuresSection: {
    backgroundColor: "#111827",
    paddingHorizontal: 20,
    paddingVertical: 45,
  },

  centerTitle: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 30,
  },

  featureCard: {
    backgroundColor: "#030712",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 12,
    padding: 20,
    marginBottom: 18,
  },

  featureIcon: {
    marginBottom: 12,
  },

  featureTitle: {
    color: "#ffffff",
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 8,
  },

  featureText: {
    color: "#d1d5db",
    fontSize: 14,
    lineHeight: 22,
  },

  /* HOW IT WORKS */

  step: {
    alignItems: "center",
    marginBottom: 38,
  },

  stepIcon: {
    marginBottom: 12,
  },

  stepTitle: {
    color: "#ffffff",
    fontSize: 19,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },

  stepText: {
    color: "#d1d5db",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    maxWidth: 330,
  },

  /* CTA */

  cta: {
    backgroundColor: "#111827",
    paddingHorizontal: 20,
    paddingVertical: 55,
    alignItems: "center",
  },

  ctaTitle: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
  },

  ctaText: {
    color: "#d1d5db",
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center",
    marginTop: 12,
    maxWidth: 330,
  },

});

export default AboutScreen;