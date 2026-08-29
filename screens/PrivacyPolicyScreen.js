import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PolicySection = ({ number, title, children }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {number}. {title}
      </Text>

      {children}
    </View>
  );
};

const Bullet = ({ children }) => {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bullet}>•</Text>

      <Text style={styles.bulletText}>
        {children}
      </Text>
    </View>
  );
};

const PrivacyPolicyScreen = ({
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
        {/* HEADER */}

        <View style={styles.header}>
          <Text style={styles.title}>
            Privacy Policy
          </Text>

          <Text style={styles.updated}>
            Last Updated: June 16, 2026
          </Text>
        </View>


        {/* POLICY CONTENT */}

        <View style={styles.content}>

          <PolicySection
            number="1"
            title="Introduction"
          >
            <Text style={styles.paragraph}>
              Welcome to our platform. We respect your privacy and are
              committed to protecting the personal information you share
              with us. This Privacy Policy explains how we collect,
              use, store, and protect your information when you use our
              services.
            </Text>
          </PolicySection>


          <PolicySection
            number="2"
            title="Information We Collect"
          >
            <Bullet>
              Personal information such as your name, email address,
              phone number and location.
            </Bullet>

            <Bullet>
              Profile details including skills, occupation,
              experience and portfolio information.
            </Bullet>

            <Bullet>
              Verification information such as NIN and government ID
              documents submitted for identity verification.
            </Bullet>

            <Bullet>
              Payment and transaction information related to jobs and
              services performed through the platform.
            </Bullet>
          </PolicySection>


          <PolicySection
            number="3"
            title="How We Use Your Information"
          >
            <Bullet>
              To create and manage your account.
            </Bullet>

            <Bullet>
              To connect customers with skilled workers and artisans.
            </Bullet>

            <Bullet>
              To verify user identities and increase platform trust.
            </Bullet>

            <Bullet>
              To process transactions and improve user experience.
            </Bullet>

            <Bullet>
              To provide customer support and resolve disputes.
            </Bullet>
          </PolicySection>


          <PolicySection
            number="4"
            title="Identity Verification"
          >
            <Text style={styles.paragraph}>
              Workers may be required to provide identity verification
              documents such as National Identification Numbers (NIN)
              and government-issued identification cards. This helps
              improve trust, security, and credibility on the platform.
            </Text>
          </PolicySection>


          <PolicySection
            number="5"
            title="Data Security"
          >
            <Text style={styles.paragraph}>
              We implement appropriate technical and organizational
              measures to protect your information against unauthorized
              access, disclosure, alteration, or destruction.
            </Text>
          </PolicySection>


          <PolicySection
            number="6"
            title="Sharing of Information"
          >
            <Text style={styles.paragraph}>
              We do not sell your personal information. Information may
              be shared only when necessary to provide our services,
              comply with legal obligations, or protect the rights and
              safety of our users and platform.
            </Text>
          </PolicySection>


          <PolicySection
            number="7"
            title="Your Rights"
          >
            <Bullet>
              Access your personal information.
            </Bullet>

            <Bullet>
              Request corrections to inaccurate information.
            </Bullet>

            <Bullet>
              Request deletion of your account and personal data.
            </Bullet>

            <Bullet>
              Withdraw consent where applicable under the law.
            </Bullet>
          </PolicySection>


          <PolicySection
            number="8"
            title="Cookies"
          >
            <Text style={styles.paragraph}>
              We may use cookies and similar technologies to improve
              website functionality, personalize content, and analyze
              user activity.
            </Text>
          </PolicySection>


          <PolicySection
            number="9"
            title="Changes to this Policy"
          >
            <Text style={styles.paragraph}>
              We may update this Privacy Policy from time to time.
              Changes will be posted on this page with an updated
              revision date.
            </Text>
          </PolicySection>


          <PolicySection
            number="10"
            title="Contact Us"
          >
            <Text style={styles.paragraph}>
              If you have questions regarding this Privacy Policy,
              please contact us through the contact information
              available on the platform.
            </Text>
          </PolicySection>

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

  header: {
    paddingHorizontal: 20,
    paddingTop: 35,
    paddingBottom: 35,
    borderBottomWidth: 1,
    borderBottomColor: "#1f2937",
  },

  title: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 40,
  },

  updated: {
    color: "#6b7280",
    fontSize: 13,
    marginTop: 10,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 35,
    paddingBottom: 20,
  },

  section: {
    marginBottom: 36,
  },

  sectionTitle: {
    color: "#ffffff",
    fontSize: 21,
    fontWeight: "800",
    lineHeight: 29,
    marginBottom: 12,
  },

  paragraph: {
    color: "#d1d5db",
    fontSize: 15,
    lineHeight: 26,
  },

  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },

  bullet: {
    color: "#f97316",
    fontSize: 20,
    lineHeight: 25,
    marginRight: 10,
  },

  bulletText: {
    flex: 1,
    color: "#d1d5db",
    fontSize: 15,
    lineHeight: 26,
  },
});

export default PrivacyPolicyScreen;
