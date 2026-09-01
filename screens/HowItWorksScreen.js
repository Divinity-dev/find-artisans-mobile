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

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const steps = [
  {
    number: "01",
    icon: "search-outline",
    title: "Search",
    description:
      "Search for the exact skill you need or find skilled artisans in your area using your state, city or LGA.",
    features: [
      "Search by skill or name",
      "Search by State, City or LGA",
      "Find artisans near you",
    ],
  },
  {
    number: "02",
    icon: "person-circle-outline",
    title: "Compare",
    description:
      "Take your time to review artisan profiles, experience, skills, ratings and verification status before making a decision.",
    features: [
      "View artisan profiles",
      "Check experience and skills",
      "See ratings and reviews",
    ],
  },
  {
    number: "03",
    icon: "logo-whatsapp",
    title: "Contact & Hire",
    description:
      "Once you find the right professional, contact them directly and discuss your job, price and requirements.",
    features: [
      "Contact artisans directly",
      "Discuss your job",
      "Hire with confidence",
    ],
  },
];

const benefits = [
  {
    icon: "checkmark-circle-outline",
    title: "Verified Professionals",
    description:
      "Find artisans whose profiles can be verified, helping you make more informed hiring decisions.",
  },
  {
    icon: "location-outline",
    title: "Find Artisans Near You",
    description:
      "Search by location or use your current location to discover professionals around you.",
  },
  {
    icon: "shield-checkmark-outline",
    title: "Built for Trust",
    description:
      "Profiles, verification and reviews give you useful information before you contact an artisan.",
  },
  {
    icon: "flash-outline",
    title: "Fast & Simple",
    description:
      "No complicated process. Search, compare and contact the professional you need.",
  },
];

const HowItWorksScreen = ({
  onHome,
  onWorkers,
  onRegister,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Navbar />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HERO */}

        <View style={styles.hero}>
          <View style={styles.heroGlow} />

          <View style={styles.badge}>
            <Ionicons
              name="checkmark-circle"
              size={16}
              color="#f97316"
            />

            <Text style={styles.badgeText}>
              Simple. Fast. Reliable.
            </Text>
          </View>

          <Text style={styles.heroTitle}>
            How Find
            <Text style={styles.orangeText}>Artisans</Text>
            {" "}Works
          </Text>

          <Text style={styles.heroDescription}>
            Finding the right professional for your job
            shouldn't be difficult. Search, compare and
            connect with skilled artisans across Nigeria
            in just a few simple steps.
          </Text>
        </View>

        {/* HOW IT WORKS */}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionLabel}>
              <Ionicons
                name="construct-outline"
                size={16}
                color="#f97316"
              />

              <Text style={styles.sectionLabelText}>
                FIND YOUR PROFESSIONAL
              </Text>
            </View>

            <Text style={styles.sectionTitle}>
              Three simple steps
            </Text>

            <Text style={styles.sectionDescription}>
              We've made the process straightforward so you
              can spend less time searching and more time
              getting your work done.
            </Text>
          </View>

          {steps.map((step) => (
            <View
              key={step.number}
              style={styles.stepCard}
            >
              <View style={styles.stepTop}>
                <Text style={styles.stepNumber}>
                  {step.number}
                </Text>

                <View style={styles.stepIcon}>
                  <Ionicons
                    name={step.icon}
                    size={28}
                    color="#f97316"
                  />
                </View>
              </View>

              <Text style={styles.stepTitle}>
                {step.title}
              </Text>

              <Text style={styles.stepDescription}>
                {step.description}
              </Text>

              <View style={styles.features}>
                {step.features.map((feature) => (
                  <View
                    key={feature}
                    style={styles.featureRow}
                  >
                    <View style={styles.featureIcon}>
                      <Ionicons
                        name="checkmark-circle"
                        size={15}
                        color="#22c55e"
                      />
                    </View>

                    <Text style={styles.featureText}>
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* VISUAL PROCESS */}

        <View style={styles.visualSection}>
          <View style={styles.sectionLabel}>
            <Ionicons
              name="person-outline"
              size={16}
              color="#f97316"
            />

            <Text style={styles.sectionLabelText}>
              MAKE BETTER DECISIONS
            </Text>
          </View>

          <Text style={styles.visualTitle}>
            The right artisan is
            <Text style={styles.orangeText}>
              {" "}closer than you think.
            </Text>
          </Text>

          <Text style={styles.visualDescription}>
            Whether you need an electrician, plumber,
            mechanic, cleaner, carpenter, painter or
            another skilled professional, FindArtisans
            helps you discover people who can get the
            job done.
          </Text>

          {/* Search */}

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons
                name="search-outline"
                size={21}
                color="#f97316"
              />
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>
                Search your way
              </Text>

              <Text style={styles.infoDescription}>
                Search by skill, name or location.
              </Text>
            </View>
          </View>

          {/* Nearby */}

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons
                name="location-outline"
                size={21}
                color="#60a5fa"
              />
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>
                Find someone nearby
              </Text>

              <Text style={styles.infoDescription}>
                Use your location to discover nearby
                professionals.
              </Text>
            </View>
          </View>

          {/* WhatsApp */}

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons
                name="logo-whatsapp"
                size={21}
                color="#22c55e"
              />
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>
                Connect directly
              </Text>

              <Text style={styles.infoDescription}>
                Contact artisans directly through
                WhatsApp.
              </Text>
            </View>
          </View>

          {/* PROFILE PREVIEW */}

          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.profileAvatar}>
                <Ionicons
                  name="person"
                  size={28}
                  color="#f97316"
                />
              </View>

              <View style={styles.profileHeaderText}>
                <View style={styles.profileNameRow}>
                  <Text style={styles.profileName}>
                    Verified Artisan
                  </Text>

                  <Ionicons
                    name="checkmark-circle"
                    size={17}
                    color="#22c55e"
                  />
                </View>

                <Text style={styles.profileProfession}>
                  Skilled Professional
                </Text>
              </View>
            </View>

            <View style={styles.profileDivider} />

            <View style={styles.profileDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  Location
                </Text>

                <View style={styles.detailValueRow}>
                  <Ionicons
                    name="location"
                    size={15}
                    color="#f97316"
                  />

                  <Text style={styles.detailValue}>
                    Near you
                  </Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  Verification
                </Text>

                <View style={styles.detailValueRow}>
                  <Ionicons
                    name="checkmark-circle"
                    size={15}
                    color="#22c55e"
                  />

                  <Text style={styles.verifiedText}>
                    Verified
                  </Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  Experience
                </Text>

                <Text style={styles.detailValue}>
                  Professional
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  Rating
                </Text>

                <View style={styles.stars}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                      key={star}
                      name="star"
                      size={14}
                      color="#eab308"
                    />
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.contactButtons}>
              <View style={styles.contactButton}>
                <Ionicons
                  name="call-outline"
                  size={20}
                  color="#f97316"
                />

                <Text style={styles.contactText}>
                  Contact
                </Text>
              </View>

              <View style={styles.whatsappButton}>
                <Ionicons
                  name="logo-whatsapp"
                  size={20}
                  color="#22c55e"
                />

                <Text style={styles.contactText}>
                  WhatsApp
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* WHY FINDARTISANS */}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionLabel}>
              <Ionicons
                name="shield-checkmark-outline"
                size={16}
                color="#f97316"
              />

              <Text style={styles.sectionLabelText}>
                WHY FINDARTISANS
              </Text>
            </View>

            <Text style={styles.sectionTitle}>
              More than just a directory
            </Text>

            <Text style={styles.sectionDescription}>
              We're building a better way for people to
              discover and connect with skilled professionals
              across Nigeria.
            </Text>
          </View>

          {benefits.map((benefit) => (
            <View
              key={benefit.title}
              style={styles.benefitCard}
            >
              <View style={styles.benefitIcon}>
                <Ionicons
                  name={benefit.icon}
                  size={24}
                  color="#f97316"
                />
              </View>

              <Text style={styles.benefitTitle}>
                {benefit.title}
              </Text>

              <Text style={styles.benefitDescription}>
                {benefit.description}
              </Text>
            </View>
          ))}
        </View>

        {/* CTA */}

        <View style={styles.ctaSection}>
          <View style={styles.ctaGlow} />

          <View style={styles.ctaIcon}>
            <Ionicons
              name="construct-outline"
              size={28}
              color="#f97316"
            />
          </View>

          <Text style={styles.ctaTitle}>
            Ready to find your artisan?
          </Text>

          <Text style={styles.ctaDescription}>
            Search thousands of skilled professionals
            across Nigeria and find the right person for
            your next job.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={onWorkers}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>
              Find an Artisan
            </Text>

            <Ionicons
              name="arrow-forward"
              size={18}
              color="#ffffff"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={onHome}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>
              Back to Home
            </Text>
          </TouchableOpacity>
        </View>

        {/* FOOTER */}

        <Footer
          onHome={onHome}
          onWorkers={onWorkers}
          onRegister={onRegister}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#020617",
  },

  scrollContent: {
    flexGrow: 1,
  },

  hero: {
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 60,
    alignItems: "center",
    overflow: "hidden",
  },

  heroGlow: {
    position: "absolute",
    width: 300,
    height: 220,
    borderRadius: 150,
    backgroundColor: "rgba(249, 115, 22, 0.06)",
    top: -50,
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "rgba(249, 115, 22, 0.10)",
    borderWidth: 1,
    borderColor: "rgba(249, 115, 22, 0.30)",
    borderRadius: 30,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 22,
  },

  badgeText: {
    color: "#fb923c",
    fontSize: 13,
    fontWeight: "700",
  },

  heroTitle: {
    color: "#ffffff",
    fontSize: 40,
    lineHeight: 47,
    fontWeight: "900",
    textAlign: "center",
  },

  orangeText: {
    color: "#f97316",
  },

  heroDescription: {
    color: "#9ca3af",
    fontSize: 15,
    lineHeight: 25,
    textAlign: "center",
    marginTop: 18,
    maxWidth: 370,
  },

  section: {
    paddingHorizontal: 20,
    paddingVertical: 55,
  },

  sectionHeader: {
    alignItems: "center",
    marginBottom: 30,
  },

  sectionLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 10,
  },

  sectionLabelText: {
    color: "#f97316",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  sectionTitle: {
    color: "#ffffff",
    fontSize: 30,
    lineHeight: 37,
    fontWeight: "900",
    textAlign: "center",
  },

  sectionDescription: {
    color: "#9ca3af",
    fontSize: 14,
    lineHeight: 23,
    textAlign: "center",
    marginTop: 12,
    maxWidth: 360,
  },

  stepCard: {
    backgroundColor: "rgba(17, 24, 39, 0.90)",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 24,
    padding: 22,
    marginBottom: 18,
  },

  stepTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  stepNumber: {
    color: "#374151",
    fontSize: 48,
    fontWeight: "900",
  },

  stepIcon: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: "rgba(249, 115, 22, 0.10)",
    borderWidth: 1,
    borderColor: "rgba(249, 115, 22, 0.20)",
    alignItems: "center",
    justifyContent: "center",
  },

  stepTitle: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "800",
  },

  stepDescription: {
    color: "#9ca3af",
    fontSize: 14,
    lineHeight: 23,
    marginTop: 10,
  },

  features: {
    marginTop: 20,
    gap: 12,
  },

  featureRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  featureIcon: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: "rgba(34, 197, 94, 0.10)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  featureText: {
    color: "#d1d5db",
    fontSize: 13,
    flex: 1,
  },

  visualSection: {
    backgroundColor: "rgba(17, 24, 39, 0.40)",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(31, 41, 55, 0.60)",
    paddingHorizontal: 20,
    paddingVertical: 55,
  },

  visualTitle: {
    color: "#ffffff",
    fontSize: 30,
    lineHeight: 38,
    fontWeight: "900",
  },

  visualDescription: {
    color: "#9ca3af",
    fontSize: 15,
    lineHeight: 25,
    marginTop: 16,
  },

  infoRow: {
    flexDirection: "row",
    marginTop: 25,
  },

  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(249, 115, 22, 0.10)",
    borderWidth: 1,
    borderColor: "rgba(249, 115, 22, 0.20)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  infoContent: {
    flex: 1,
    justifyContent: "center",
  },

  infoTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },

  infoDescription: {
    color: "#9ca3af",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 3,
  },

  profileCard: {
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 24,
    padding: 20,
    marginTop: 35,
  },

  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  profileAvatar: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: "#1f2937",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  profileHeaderText: {
    flex: 1,
  },

  profileNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  profileName: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },

  profileProfession: {
    color: "#f97316",
    fontSize: 13,
    marginTop: 4,
  },

  profileDivider: {
    height: 1,
    backgroundColor: "#1f2937",
    marginVertical: 20,
  },

  profileDetails: {
    gap: 17,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  detailLabel: {
    color: "#9ca3af",
    fontSize: 13,
  },

  detailValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  detailValue: {
    color: "#e5e7eb",
    fontSize: 13,
  },

  verifiedText: {
    color: "#22c55e",
    fontSize: 13,
  },

  stars: {
    flexDirection: "row",
    gap: 2,
  },

  contactButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 22,
  },

  contactButton: {
    flex: 1,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },

  whatsappButton: {
    flex: 1,
    backgroundColor: "rgba(34, 197, 94, 0.10)",
    borderWidth: 1,
    borderColor: "rgba(34, 197, 94, 0.20)",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },

  contactText: {
    color: "#9ca3af",
    fontSize: 11,
    marginTop: 5,
  },

  benefitCard: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
  },

  benefitIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(249, 115, 22, 0.10)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  benefitTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
  },

  benefitDescription: {
    color: "#9ca3af",
    fontSize: 13,
    lineHeight: 21,
    marginTop: 8,
  },

  ctaSection: {
    marginHorizontal: 20,
    marginBottom: 55,
    padding: 25,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(249, 115, 22, 0.20)",
    backgroundColor: "#111827",
    alignItems: "center",
    overflow: "hidden",
  },

  ctaGlow: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(249, 115, 22, 0.05)",
    top: -120,
    right: -80,
  },

  ctaIcon: {
    width: 62,
    height: 62,
    borderRadius: 16,
    backgroundColor: "rgba(249, 115, 22, 0.10)",
    borderWidth: 1,
    borderColor: "rgba(249, 115, 22, 0.20)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  ctaTitle: {
    color: "#ffffff",
    fontSize: 28,
    lineHeight: 35,
    fontWeight: "900",
    textAlign: "center",
  },

  ctaDescription: {
    color: "#9ca3af",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    marginTop: 12,
  },

  primaryButton: {
    width: "100%",
    backgroundColor: "#f97316",
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  primaryButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
  },

  secondaryButton: {
    width: "100%",
    backgroundColor: "#1f2937",
    borderWidth: 1,
    borderColor: "#374151",
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
});

export default HowItWorksScreen;
