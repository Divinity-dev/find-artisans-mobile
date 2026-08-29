import React, {
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
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


const CustomerDashboardScreen = ({
  navigation,
}) => {

  // ======================================
  // AUTH
  // ======================================

  const {
    token,
    isAuthenticated,
  } = useAuth();


  // ======================================
  // API
  // ======================================

  const API_URL =
    process.env.EXPO_PUBLIC_API_URL;


  // ======================================
  // DASHBOARD
  // ======================================

  const [profile, setProfile] =
    useState(null);

  const [jobs, setJobs] =
    useState([]);


  // ======================================
  // TAB
  // ======================================

  const [activeTab, setActiveTab] =
    useState("jobs");


  // ======================================
  // LOADING
  // ======================================

  const [loading, setLoading] =
    useState(true);


  // ======================================
  // ERROR
  // ======================================

  const [error, setError] =
    useState("");


  // ======================================
  // FETCH DASHBOARD DATA
  // ======================================

  useEffect(() => {

    const fetchDashboard = async () => {

      // ----------------------------------
      // Authentication check
      // ----------------------------------

      if (!isAuthenticated || !token) {

        setLoading(false);

        return;
      }


      try {

        setLoading(true);
        setError("");


        // ==================================
        // PROFILE
        // ==================================

        const profileResponse =
          await fetch(
            `${API_URL}/users/me`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        const profileData =
          await profileResponse.json();


        if (!profileResponse.ok) {

          throw new Error(
            profileData.message ||
            "Failed to load profile"
          );

        }


        const profileResult =
          profileData.data ||
          profileData.user ||
          profileData;


        setProfile(profileResult);


        // ==================================
        // CUSTOMER JOBS
        // ==================================

        const jobsResponse =
          await fetch(
            `${API_URL}/jobs/me`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        const jobsData =
          await jobsResponse.json();


        if (!jobsResponse.ok) {

          throw new Error(
            jobsData.message ||
            "Failed to load jobs"
          );

        }


        const jobsResult =
          jobsData.data || [];


        setJobs(
          Array.isArray(jobsResult)
            ? jobsResult
            : []
        );


      } catch (error) {

        console.error(
          "Failed to load customer dashboard:",
          error
        );

        setError(
          error.message ||
          "Failed to load dashboard"
        );

      } finally {

        setLoading(false);

      }

    };


    fetchDashboard();

  }, [
    token,
    isAuthenticated,
  ]);


  // ======================================
  // NOT AUTHENTICATED
  // ======================================

  if (!isAuthenticated) {

    return (
      <SafeAreaView
        style={styles.container}
      >

        <Navbar />

        <View
          style={styles.centerContainer}
        >

          <Ionicons
            name="lock-closed-outline"
            size={50}
            color="#4b5563"
          />

          <Text
            style={styles.centerTitle}
          >
            Login Required
          </Text>

          <Text
            style={styles.centerText}
          >
            You need to login to access
            your customer dashboard.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() =>
              navigation.navigate("Login")
            }
          >

            <Text
              style={styles.primaryButtonText}
            >
              Login
            </Text>

          </TouchableOpacity>

        </View>

      </SafeAreaView>
    );

  }


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
          style={styles.centerContainer}
        >

          <ActivityIndicator
            size="large"
            color="#f97316"
          />

          <Text
            style={styles.loadingText}
          >
            Loading dashboard...
          </Text>

        </View>

      </SafeAreaView>
    );

  }


  // ======================================
  // ERROR
  // ======================================

  if (error) {

    return (
      <SafeAreaView
        style={styles.container}
      >

        <Navbar />

        <View
          style={styles.centerContainer}
        >

          <Ionicons
            name="alert-circle-outline"
            size={50}
            color="#ef4444"
          />

          <Text
            style={styles.centerTitle}
          >
            Something went wrong
          </Text>

          <Text
            style={styles.errorText}
          >
            {error}
          </Text>

        </View>

      </SafeAreaView>
    );

  }


  // ======================================
  // STATS
  // ======================================

  const activeJobs =
    jobs.filter(
      (job) =>
        job.status === "open" ||
        job.status === "assigned" ||
        job.status === "in-progress"
    );


  const completedJobs =
    jobs.filter(
      (job) =>
        job.status === "completed"
    );


  // ======================================
  // TRUST SCORE
  // ======================================

  const trustScore =
    profile?.stats?.trustScore;


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
            HEADER
        ================================== */}

        <View style={styles.header}>

          <Text style={styles.title}>
            Customer Dashboard
          </Text>

          <Text style={styles.subtitle}>
            Welcome {profile?.fullName || "Customer"}
          </Text>


          {/* TRUST SCORE */}

          {trustScore !== undefined &&
            trustScore !== null && (

            <View
              style={styles.trustRow}
            >

              <Ionicons
                name="star"
                size={17}
                color="#facc15"
              />

              <Text
                style={styles.trustText}
              >
                Trust Score:{" "}

                <Text
                  style={styles.trustScore}
                >
                  {trustScore}
                </Text>

              </Text>

            </View>

          )}

        </View>


        {/* ==================================
            ACTION BUTTONS
        ================================== */}

        <View
          style={styles.actionRow}
        >

          {/* EDIT PROFILE */}

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() =>
              navigation.navigate(
                "CustomerProfileEdit"
              )
            }
          >

            <Ionicons
              name="create-outline"
              size={18}
              color="#ffffff"
            />

            <Text
              style={styles.secondaryButtonText}
            >
              Edit Profile
            </Text>

          </TouchableOpacity>


          {/* POST JOB */}

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() =>
              navigation.navigate(
                "PostJob"
              )
            }
          >

            <Ionicons
              name="add-circle-outline"
              size={18}
              color="#ffffff"
            />

            <Text
              style={styles.primaryButtonText}
            >
              Post Job
            </Text>

          </TouchableOpacity>

        </View>


        {/* ==================================
            STATS
        ================================== */}

        <View style={styles.statsRow}>

          {/* TOTAL JOBS */}

          <View style={styles.statCard}>

            <Ionicons
              name="briefcase-outline"
              size={22}
              color="#f97316"
            />

            <Text
              style={styles.statNumber}
            >
              {jobs.length}
            </Text>

            <Text
              style={styles.statLabel}
            >
              Total Jobs
            </Text>

          </View>


          {/* ACTIVE */}

          <View style={styles.statCard}>

            <Ionicons
              name="time-outline"
              size={22}
              color="#60a5fa"
            />

            <Text
              style={styles.statNumber}
            >
              {activeJobs.length}
            </Text>

            <Text
              style={styles.statLabel}
            >
              Active
            </Text>

          </View>


          {/* COMPLETED */}

          <View style={styles.statCard}>

            <Ionicons
              name="checkmark-circle-outline"
              size={22}
              color="#4ade80"
            />

            <Text
              style={[
                styles.statNumber,
                styles.completedNumber,
              ]}
            >
              {completedJobs.length}
            </Text>

            <Text
              style={styles.statLabel}
            >
              Completed
            </Text>

          </View>

        </View>


        {/* ==================================
            TABS
        ================================== */}

        <View style={styles.tabsContainer}>

          {/* JOBS */}

          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "jobs" &&
                styles.activeTab,
            ]}
            onPress={() =>
              setActiveTab("jobs")
            }
          >

            <Ionicons
              name="briefcase-outline"
              size={17}
              color={
                activeTab === "jobs"
                  ? "#ffffff"
                  : "#9ca3af"
              }
            />

            <Text
              style={[
                styles.tabText,
                activeTab === "jobs" &&
                  styles.activeTabText,
              ]}
            >
              Jobs
            </Text>

          </TouchableOpacity>


          {/* COMPLAINT */}

          <TouchableOpacity
            style={[
              styles.tab,
              activeTab ===
                "create-complaint" &&
                styles.activeTab,
            ]}
            onPress={() =>
              setActiveTab(
                "create-complaint"
              )
            }
          >

            <Ionicons
              name="clipboard-outline"
              size={17}
              color={
                activeTab ===
                "create-complaint"
                  ? "#ffffff"
                  : "#9ca3af"
              }
            />

            <Text
              style={[
                styles.tabText,
                activeTab ===
                  "create-complaint" &&
                  styles.activeTabText,
              ]}
            >
              Complaint
            </Text>

          </TouchableOpacity>


          {/* MY COMPLAINTS */}

          <TouchableOpacity
            style={[
              styles.tab,
              activeTab ===
                "my-complaints" &&
                styles.activeTab,
            ]}
            onPress={() =>
              setActiveTab(
                "my-complaints"
              )
            }
          >

            <Ionicons
              name="document-text-outline"
              size={17}
              color={
                activeTab ===
                "my-complaints"
                  ? "#ffffff"
                  : "#9ca3af"
              }
            />

            <Text
              style={[
                styles.tabText,
                activeTab ===
                  "my-complaints" &&
                  styles.activeTabText,
              ]}
            >
              My Complaints
            </Text>

          </TouchableOpacity>

        </View>


        {/* ==================================
            JOBS TAB
        ================================== */}

        {activeTab === "jobs" && (

          <View style={styles.card}>

            <Text
              style={styles.sectionTitle}
            >
              My Jobs
            </Text>


            {jobs.length === 0 ? (

              <View
                style={styles.emptyContainer}
              >

                <Ionicons
                  name="briefcase-outline"
                  size={42}
                  color="#4b5563"
                />

                <Text
                  style={styles.emptyTitle}
                >
                  No jobs found
                </Text>

                <Text
                  style={styles.emptyText}
                >
                  You haven't posted any jobs
                  yet.
                </Text>

                <TouchableOpacity
                  style={
                    styles.primaryButton
                  }
                  onPress={() =>
                    navigation.navigate(
                      "PostJob"
                    )
                  }
                >

                  <Text
                    style={
                      styles.primaryButtonText
                    }
                  >
                    Post Your First Job
                  </Text>

                </TouchableOpacity>

              </View>

            ) : (

              <View>

                <Text
                  style={styles.infoText}
                >
                  You have {jobs.length}{" "}
                  {jobs.length === 1
                    ? "job"
                    : "jobs"}.
                </Text>

              </View>

            )}

          </View>

        )}


        {/* ==================================
            CREATE COMPLAINT TAB
        ================================== */}

        {activeTab ===
          "create-complaint" && (

          <View style={styles.card}>

            <View
              style={styles.sectionHeader}
            >

              <Ionicons
                name="clipboard-outline"
                size={22}
                color="#f97316"
              />

              <Text
                style={styles.sectionTitle}
              >
                Submit Complaint
              </Text>

            </View>

            <Text
              style={styles.cardDescription}
            >
              Submit a complaint if you
              experience a problem with a
              worker or service.
            </Text>


            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => {
                // Complaint form will be
                // added in Stage 3.
              }}
            >

              <Text
                style={styles.primaryButtonText}
              >
                Create Complaint
              </Text>

            </TouchableOpacity>

          </View>

        )}


        {/* ==================================
            MY COMPLAINTS TAB
        ================================== */}

        {activeTab ===
          "my-complaints" && (

          <View style={styles.card}>

            <View
              style={styles.sectionHeader}
            >

              <Ionicons
                name="document-text-outline"
                size={22}
                color="#60a5fa"
              />

              <Text
                style={styles.sectionTitle}
              >
                My Complaints
              </Text>

            </View>

            <Text
              style={styles.cardDescription}
            >
              Your submitted complaints will
              appear here.
            </Text>

          </View>

        )}


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


export default CustomerDashboardScreen;


// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#030712",
  },


  content: {
    paddingBottom: 20,
  },


  // ========================================
  // HEADER
  // ========================================

  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 10,
  },

  title: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "700",
  },

  subtitle: {
    marginTop: 7,
    color: "#9ca3af",
    fontSize: 15,
  },

  trustRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 9,
  },

  trustText: {
    marginLeft: 6,
    color: "#d1d5db",
    fontSize: 13,
  },

  trustScore: {
    color: "#fb923c",
    fontWeight: "700",
  },


  // ========================================
  // ACTIONS
  // ========================================

  actionRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    marginTop: 14,
    marginBottom: 18,
  },

  primaryButton: {
    minHeight: 46,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: "#f97316",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 7,
  },

  primaryButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },

  secondaryButton: {
    minHeight: 46,
    flex: 1,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 7,
  },

  secondaryButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },


  // ========================================
  // STATS
  // ========================================

  statsRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 18,
  },

  statCard: {
    flex: 1,
    minHeight: 110,
    padding: 12,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  statNumber: {
    marginTop: 7,
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "800",
  },

  completedNumber: {
    color: "#4ade80",
  },

  statLabel: {
    marginTop: 4,
    color: "#9ca3af",
    fontSize: 11,
    textAlign: "center",
  },


  // ========================================
  // TABS
  // ========================================

  tabsContainer: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 2,
  },

  tab: {
    flex: 1,
    minHeight: 44,
    paddingHorizontal: 7,
    borderRadius: 12,
    backgroundColor: "#1f2937",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 5,
  },

  activeTab: {
    backgroundColor: "#f97316",
  },

  tabText: {
    color: "#9ca3af",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },

  activeTabText: {
    color: "#ffffff",
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
    marginBottom: 10,
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

  infoText: {
    marginTop: 10,
    color: "#9ca3af",
    fontSize: 14,
  },


  // ========================================
  // EMPTY
  // ========================================

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },

  emptyTitle: {
    marginTop: 12,
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },

  emptyText: {
    marginTop: 7,
    color: "#6b7280",
    fontSize: 14,
    textAlign: "center",
  },


  // ========================================
  // CENTER
  // ========================================

  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  centerTitle: {
    marginTop: 14,
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },

  centerText: {
    marginTop: 8,
    color: "#6b7280",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },

  loadingText: {
    marginTop: 12,
    color: "#9ca3af",
    fontSize: 14,
  },

  errorText: {
    marginTop: 8,
    color: "#ef4444",
    fontSize: 14,
    textAlign: "center",
  },

});