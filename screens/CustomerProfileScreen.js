import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


// ==========================================
// STAR RATING
// ==========================================

const renderStars = (score = 0) => {
  const fullStars = Math.round(score);

  return (
    <View style={styles.starsContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Ionicons
          key={star}
          name={
            star <= fullStars
              ? "star"
              : "star-outline"
          }
          size={18}
          color={
            star <= fullStars
              ? "#facc15"
              : "#4b5563"
          }
        />
      ))}
    </View>
  );
};


// ==========================================
// TRUST LEVEL
// ==========================================

const getTrustLevel = (score = 0) => {
  if (score >= 4) {
    return {
      label: "Excellent",
      color: "#4ade80",
    };
  }

  if (score >= 2.5) {
    return {
      label: "Good",
      color: "#facc15",
    };
  }

  return {
    label: "Low",
    color: "#f87171",
  };
};


// ==========================================
// SCREEN
// ==========================================

const CustomerProfileScreen = ({
  navigation,
  route,
}) => {

  const { user } = useAuth();

  // ======================================
  // CUSTOMER ID
  // ======================================

  const customerId =
    route?.params?.customerId ||
    user?._id ||
    user?.id;


  // ======================================
  // STATE
  // ======================================

  const [customer, setCustomer] =
    useState(null);

  const [stats, setStats] =
    useState({});

  const [jobs, setJobs] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  // ======================================
  // FETCH CUSTOMER
  // ======================================

  useEffect(() => {

    const fetchCustomer = async () => {

      try {

        setLoading(true);

        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/users/${customerId}`
        );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to load customer"
          );
        }


        // Handle the same response
        // structures as the web version.

        const data =
          result.user ||
          result.data ||
          result;


        setCustomer(data.user);

        setStats(data.stats || {});

        setJobs(data.jobs || []);

      } catch (error) {

        console.error(
          "Failed to fetch customer:",
          error
        );

        setCustomer(null);

      } finally {

        setLoading(false);

      }

    };


    if (customerId) {
      fetchCustomer();
    } else {
      setLoading(false);
    }

  }, [customerId, user]);


  // ======================================
  // LOADING
  // ======================================

  if (loading) {

    return (
      <SafeAreaView
        style={styles.container}
      >

        <Navbar />

        <View
          style={styles.loadingContainer}
        >

          <ActivityIndicator
            size="large"
            color="#f97316"
          />

          <Text
            style={styles.loadingText}
          >
            Loading customer profile...
          </Text>

        </View>

      </SafeAreaView>
    );

  }


  // ======================================
  // CUSTOMER NOT FOUND
  // ======================================

  if (!customer) {

    return (
      <SafeAreaView
        style={styles.container}
      >

        <Navbar />

        <View
          style={styles.notFoundContainer}
        >

          <Ionicons
            name="person-outline"
            size={52}
            color="#4b5563"
          />

          <Text
            style={styles.notFoundTitle}
          >
            Customer not found
          </Text>

          <Text
            style={styles.notFoundText}
          >
            This customer profile may have
            been removed or is no longer
            available.
          </Text>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() =>
              navigation.goBack()
            }
          >

            <Text
              style={styles.backButtonText}
            >
              Go Back
            </Text>

          </TouchableOpacity>

        </View>

      </SafeAreaView>
    );

  }


  // ======================================
  // MEMBER SINCE
  // ======================================

  const memberSince = customer.createdAt
    ? new Date(customer.createdAt)
    : null;

  const memberSinceLabel =
    memberSince?.getTime()
      ? memberSince.toLocaleDateString(
          "en-US",
          {
            month: "long",
            year: "numeric",
          }
        )
      : "Unknown";


  // ======================================
  // TRUST
  // ======================================

  const trust = getTrustLevel(
    stats?.trustScore
  );


  // ======================================
  // RENDER
  // ======================================

  return (
    <SafeAreaView
      style={styles.container}
    >

      <Navbar />


      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
      >

        {/* ==================================
            BACK
        ================================== */}

        <TouchableOpacity
          style={styles.backLink}
          onPress={() =>
            navigation.goBack()
          }
        >

          <Ionicons
            name="arrow-back"
            size={20}
            color="#f97316"
          />

          <Text
            style={styles.backLinkText}
          >
            Back to Job
          </Text>

        </TouchableOpacity>


        {/* ==================================
            PROFILE HEADER
        ================================== */}

        <View style={styles.profileCard}>

          {/* PROFILE PHOTO */}

          {customer.profilePhoto ? (

            <Image
              source={{
                uri: customer.profilePhoto,
              }}
              style={styles.profileImage}
            />

          ) : (

            <View
              style={styles.profilePlaceholder}
            >

              <Ionicons
                name="person"
                size={42}
                color="#6b7280"
              />

            </View>

          )}


          {/* NAME */}

          <Text style={styles.name}>
            {customer.fullName}
          </Text>


          {/* LOCATION */}

          <View style={styles.locationRow}>

            <Ionicons
              name="location-outline"
              size={18}
              color="#9ca3af"
            />

            <Text
              style={styles.locationText}
            >

              {customer.location?.city ||
                "Location not specified"}

              {customer.location?.state &&
                `, ${customer.location.state}`}

            </Text>

          </View>


          {/* MEMBER SINCE */}

          <Text style={styles.memberSince}>
            Member since {memberSinceLabel}
          </Text>


          {/* VERIFIED */}

          {customer.verification
            ?.isVerified && (

            <View
              style={styles.verifiedBadge}
            >

              <Ionicons
                name="checkmark-circle"
                size={18}
                color="#4ade80"
              />

              <Text
                style={styles.verifiedText}
              >
                Verified Customer
              </Text>

            </View>

          )}

        </View>


        {/* ==================================
            STATS
        ================================== */}

        <View style={styles.statsContainer}>

          {/* TOTAL JOBS */}

          <View style={styles.statCard}>

            <Ionicons
              name="briefcase-outline"
              size={24}
              color="#f97316"
            />

            <Text style={styles.statValue}>
              {stats?.totalJobs || 0}
            </Text>

            <Text style={styles.statLabel}>
              Total Jobs
            </Text>

          </View>


          {/* COMPLETED */}

          <View style={styles.statCard}>

            <Ionicons
              name="checkmark-done-outline"
              size={24}
              color="#4ade80"
            />

            <Text
              style={[
                styles.statValue,
                styles.completedValue,
              ]}
            >
              {stats?.completedJobs || 0}
            </Text>

            <Text style={styles.statLabel}>
              Completed
            </Text>

          </View>


          {/* TRUST */}

          <View style={styles.statCard}>

            <Ionicons
              name="shield-checkmark-outline"
              size={24}
              color="#fb923c"
            />

            <View
              style={styles.trustScoreRow}
            >

              <Text style={styles.statValue}>
                {stats?.trustScore != null
                  ? Number(
                      stats.trustScore
                    ).toFixed(1)
                  : "0.0"}
              </Text>

              <Text
                style={styles.trustOutOf}
              >
                /5
              </Text>

            </View>

            <View style={styles.starWrapper}>
              {renderStars(
                stats?.trustScore
              )}
            </View>

            <Text
              style={[
                styles.trustLabel,
                {
                  color: trust.color,
                },
              ]}
            >
              {trust.label}
            </Text>

          </View>

        </View>


        {/* ==================================
            TRUST PROFILE
        ================================== */}

        <View style={styles.card}>

          <View
            style={styles.sectionHeader}
          >

            <Ionicons
              name="shield-checkmark"
              size={22}
              color="#60a5fa"
            />

            <Text
              style={styles.sectionTitle}
            >
              Trust Profile
            </Text>

          </View>

          <Text style={styles.cardDescription}>
            This customer's activity and
            completed jobs contribute to their
            FindArtisans trust profile.
          </Text>

          <View
            style={styles.trustRow}
          >

            <View
              style={styles.trustIcon}
            >

              <Ionicons
                name="star"
                size={18}
                color="#facc15"
              />

            </View>

            <View
              style={styles.trustInfo}
            >

              <Text
                style={styles.trustTitle}
              >
                Trust Score
              </Text>

              <Text
                style={styles.trustDescription}
              >
                Based on customer activity and
                completed jobs.
              </Text>

            </View>

            <Text
              style={[
                styles.trustLevel,
                {
                  color: trust.color,
                },
              ]}
            >
              {trust.label}
            </Text>

          </View>

        </View>


        {/* ==================================
            COMPLETED JOBS
        ================================== */}

        <View style={styles.card}>

          <Text
            style={styles.sectionTitle}
          >
            Completed Jobs
          </Text>

          {jobs.length === 0 ? (

            <View
              style={styles.emptyJobs}
            >

              <Ionicons
                name="briefcase-outline"
                size={36}
                color="#4b5563"
              />

              <Text
                style={styles.emptyJobsText}
              >
                No job history yet
              </Text>

            </View>

          ) : (

            jobs.map((job) => (

              <View
                key={job._id}
                style={styles.jobItem}
              >

                <View
                  style={styles.jobIcon}
                >

                  <Ionicons
                    name="checkmark-circle"
                    size={22}
                    color="#4ade80"
                  />

                </View>

                <View
                  style={styles.jobInfo}
                >

                  <Text
                    style={styles.jobTitle}
                  >
                    {job.title}
                  </Text>

                  <Text
                    style={styles.jobCategory}
                  >
                    {job.category ||
                      "Category not specified"}
                  </Text>

                  <Text
                    style={styles.assignedWorker}
                  >
                    Assigned Worker:{" "}
                    {job.assignedWorker
                      ?.fullName || "N/A"}
                  </Text>

                </View>

              </View>

            ))

          )}

        </View>


        {/* ==================================
            FOOTER
        ================================== */}

        <Footer

          onHome={() =>
            navigation.navigate("Home")
          }

          onWorkers={() =>
            navigation.navigate("Workers")
          }

          onRegister={() =>
            navigation.navigate("Register")
          }

        />

      </ScrollView>

    </SafeAreaView>
  );
};


export default CustomerProfileScreen;


// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#030712",
  },

  content: {
    paddingBottom: 0,
  },


  // ========================================
  // LOADING
  // ========================================

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 12,
    color: "#9ca3af",
    fontSize: 14,
  },


  // ========================================
  // BACK
  // ========================================

  backLink: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 4,
  },

  backLinkText: {
    marginLeft: 7,
    color: "#f97316",
    fontSize: 14,
    fontWeight: "600",
  },


  // ========================================
  // PROFILE
  // ========================================

  profileCard: {
    marginHorizontal: 20,
    marginTop: 16,

    padding: 24,

    backgroundColor: "#111827",

    borderWidth: 1,
    borderColor: "#1f2937",

    borderRadius: 20,

    alignItems: "center",
  },

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,

    borderWidth: 3,
    borderColor: "#374151",
  },

  profilePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,

    backgroundColor: "#1f2937",

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 3,
    borderColor: "#374151",
  },

  name: {
    marginTop: 16,

    color: "#ffffff",
    fontSize: 25,
    fontWeight: "700",

    textAlign: "center",
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: 9,
  },

  locationText: {
    marginLeft: 6,

    color: "#9ca3af",
    fontSize: 14,

    textAlign: "center",
  },

  memberSince: {
    marginTop: 8,

    color: "#6b7280",
    fontSize: 13,
  },

  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: 14,

    paddingHorizontal: 12,
    paddingVertical: 7,

    borderRadius: 20,

    backgroundColor:
      "rgba(74, 222, 128, 0.10)",
  },

  verifiedText: {
    marginLeft: 6,

    color: "#4ade80",
    fontSize: 13,
    fontWeight: "600",
  },


  // ========================================
  // STATS
  // ========================================

  statsContainer: {
    flexDirection: "row",

    marginHorizontal: 20,
    marginTop: 16,

    gap: 10,
  },

  statCard: {
    flex: 1,

    minHeight: 135,

    padding: 14,

    backgroundColor: "#111827",

    borderWidth: 1,
    borderColor: "#1f2937",

    borderRadius: 16,

    alignItems: "center",
    justifyContent: "center",
  },

  statValue: {
    marginTop: 7,

    color: "#ffffff",
    fontSize: 23,
    fontWeight: "800",
  },

  completedValue: {
    color: "#4ade80",
  },

  statLabel: {
    marginTop: 5,

    color: "#9ca3af",
    fontSize: 12,

    textAlign: "center",
  },

  trustScoreRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },

  trustOutOf: {
    marginLeft: 2,

    color: "#6b7280",
    fontSize: 12,
  },

  starWrapper: {
    marginTop: 4,
  },

  starsContainer: {
    flexDirection: "row",
    gap: 1,
  },

  trustLabel: {
    marginTop: 4,

    fontSize: 11,
    fontWeight: "700",
  },


  // ========================================
  // CARD
  // ========================================

  card: {
    marginHorizontal: 20,
    marginTop: 16,

    padding: 20,

    backgroundColor: "#111827",

    borderWidth: 1,
    borderColor: "#1f2937",

    borderRadius: 20,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: 12,
  },

  sectionTitle: {
    marginLeft: 9,

    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
  },

  cardDescription: {
    color: "#9ca3af",
    fontSize: 14,
    lineHeight: 21,
  },


  // ========================================
  // TRUST
  // ========================================

  trustRow: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: 20,

    paddingTop: 16,

    borderTopWidth: 1,
    borderTopColor: "#1f2937",
  },

  trustIcon: {
    width: 38,
    height: 38,

    borderRadius: 10,

    backgroundColor: "#1f2937",

    alignItems: "center",
    justifyContent: "center",
  },

  trustInfo: {
    flex: 1,
    marginLeft: 11,
  },

  trustTitle: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },

  trustDescription: {
    marginTop: 3,

    color: "#6b7280",
    fontSize: 12,
    lineHeight: 18,
  },

  trustLevel: {
    marginLeft: 8,

    fontSize: 12,
    fontWeight: "700",
  },


  // ========================================
  // JOBS
  // ========================================

  emptyJobs: {
    alignItems: "center",
    justifyContent: "center",

    paddingVertical: 35,
  },

  emptyJobsText: {
    marginTop: 10,

    color: "#6b7280",
    fontSize: 14,
  },

  jobItem: {
    flexDirection: "row",

    paddingVertical: 14,

    borderBottomWidth: 1,
    borderBottomColor: "#1f2937",
  },

  jobIcon: {
    width: 38,
    height: 38,

    borderRadius: 10,

    backgroundColor: "#1f2937",

    alignItems: "center",
    justifyContent: "center",
  },

  jobInfo: {
    flex: 1,
    marginLeft: 12,
  },

  jobTitle: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },

  jobCategory: {
    marginTop: 4,

    color: "#9ca3af",
    fontSize: 13,
  },

  assignedWorker: {
    marginTop: 4,

    color: "#6b7280",
    fontSize: 12,
  },


  // ========================================
  // NOT FOUND
  // ========================================

  notFoundContainer: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 30,
  },

  notFoundTitle: {
    marginTop: 15,

    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
  },

  notFoundText: {
    marginTop: 8,

    color: "#6b7280",
    fontSize: 14,
    lineHeight: 21,

    textAlign: "center",
  },

  backButton: {
    marginTop: 20,

    paddingHorizontal: 22,
    paddingVertical: 12,

    borderRadius: 10,

    backgroundColor: "#f97316",
  },

  backButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },

});