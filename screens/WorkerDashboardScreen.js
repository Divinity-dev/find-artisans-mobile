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


const WorkerDashboardScreen = ({ navigation }) => {

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
  // DATA
  // ======================================

  const [worker, setWorker] = useState(null);

  const [activeJobs, setActiveJobs] =
    useState([]);

  const [completedJobs, setCompletedJobs] =
    useState([]);

  const [portfolio, setPortfolio] =
    useState([]);


  // ======================================
  // UI
  // ======================================

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ======================================
  // FETCH DASHBOARD
  // ======================================

  useEffect(() => {

    const fetchDashboard = async () => {

      if (!isAuthenticated || !token) {
        setLoading(false);
        return;
      }

      try {

        setLoading(true);
        setError("");


        // ==================================
        // WORKER PROFILE
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

        const workerData =
          profileData.data ||
          profileData.user ||
          profileData.worker ||
          profileData;

        setWorker(workerData);


        // ==================================
        // ACTIVE JOBS
        // ==================================

        const activeResponse =
          await fetch(
            `${API_URL}/jobs/worker/active`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const activeData =
          await activeResponse.json();

        if (!activeResponse.ok) {
          throw new Error(
            activeData.message ||
              "Failed to load active jobs"
          );
        }

        const activeJobsData =
          activeData.data ||
          activeData.jobs ||
          [];

        setActiveJobs(
          Array.isArray(activeJobsData)
            ? activeJobsData
            : []
        );


        // ==================================
        // COMPLETED JOBS
        // ==================================

        const completedResponse =
          await fetch(
            `${API_URL}/jobs/worker/completed`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const completedData =
          await completedResponse.json();

        if (!completedResponse.ok) {
          throw new Error(
            completedData.message ||
              "Failed to load completed jobs"
          );
        }

        const completedJobsData =
          completedData.data ||
          completedData.jobs ||
          [];

        setCompletedJobs(
          Array.isArray(completedJobsData)
            ? completedJobsData
            : []
        );


        // ==================================
        // PORTFOLIO
        // ==================================

        const portfolioResponse =
          await fetch(
            `${API_URL}/portfolio/me`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const portfolioData =
          await portfolioResponse.json();

        if (!portfolioResponse.ok) {
          throw new Error(
            portfolioData.message ||
              "Failed to load portfolio"
          );
        }

        const portfolioItems =
          portfolioData.data ||
          portfolioData.portfolio ||
          [];

        setPortfolio(
          Array.isArray(portfolioItems)
            ? portfolioItems
            : []
        );

      } catch (error) {

        console.error(
          "Worker dashboard error:",
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
  // LOGIN REQUIRED
  // ======================================

  if (!isAuthenticated) {

    return (
      <SafeAreaView style={styles.container}>

        <Navbar />

        <View style={styles.centerContainer}>

          <Ionicons
            name="lock-closed-outline"
            size={50}
            color="#4b5563"
          />

          <Text style={styles.centerTitle}>
            Login Required
          </Text>

          <Text style={styles.centerText}>
            You need to login to access
            your worker dashboard.
          </Text>

          <TouchableOpacity
            style={styles.orangeButton}
            onPress={() =>
              navigation.navigate("Login")
            }
          >

            <Text style={styles.buttonText}>
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
      <SafeAreaView style={styles.container}>

        <Navbar />

        <View style={styles.centerContainer}>

          <ActivityIndicator
            size="large"
            color="#f97316"
          />

          <Text style={styles.loadingText}>
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
      <SafeAreaView style={styles.container}>

        <Navbar />

        <View style={styles.centerContainer}>

          <Ionicons
            name="alert-circle-outline"
            size={50}
            color="#ef4444"
          />

          <Text style={styles.centerTitle}>
            Something went wrong
          </Text>

          <Text style={styles.errorText}>
            {error}
          </Text>

        </View>

      </SafeAreaView>
    );

  }


  // ======================================
  // TOTAL EARNINGS
  // ======================================

  const totalEarnings =
    completedJobs.reduce(
      (sum, job) =>
        sum + (job.budget || 0),
      0
    );


  // ======================================
  // VERIFICATION
  // ======================================

  const isVerified =
    worker?.verified ||
    worker?.verification?.isVerified;


  // ======================================
  // RENDER
  // ======================================

  return (
    <SafeAreaView style={styles.container}>

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
            Worker Dashboard
          </Text>

          <Text style={styles.subtitle}>
            Manage your jobs, earnings,
            availability and portfolio.
          </Text>

        </View>


        
{/* ==================================
    PROFILE
================================== */}

<View style={styles.profileCard}>

  {/* PROFILE HEADER */}

  <View style={styles.profileHeader}>

    {/* AVATAR */}

    <View style={styles.avatar}>

      {worker?.profilePhoto ? (
        <Image
          source={{
            uri: worker.profilePhoto,
          }}
          style={styles.avatarImage}
        />
      ) : (
        <Ionicons
          name="person"
          size={30}
          color="#9ca3af"
        />
      )}

    </View>


    {/* NAME + SKILL */}

    <View style={styles.profileInfo}>

      <View style={styles.nameRow}>

        <Text
          style={styles.workerName}
          numberOfLines={1}
        >
          {worker?.fullName || "Worker"}
        </Text>

        {isVerified && (
          <Ionicons
            name="checkmark-circle"
            size={19}
            color="#4ade80"
          />
        )}

      </View>

      <Text style={styles.skill}>
        {worker?.skill || "Artisan"}
      </Text>

    </View>


    {/* EDIT PROFILE */}

    <TouchableOpacity
      style={styles.editProfileButton}
      onPress={() =>
        navigation.navigate("WorkerProfileEdit")
      }
    >

      <Ionicons
        name="create-outline"
        size={18}
        color="#f97316"
      />

      <Text style={styles.editProfileText}>
        Edit
      </Text>

    </TouchableOpacity>

  </View>


  {/* AVAILABILITY */}

  <View style={styles.availabilityRow}>

    <View
      style={[
        styles.availabilityBadge,

        worker?.availability === "available" &&
          styles.availableBadge,

        worker?.availability === "busy" &&
          styles.busyBadge,
      ]}
    >

      <Text
        style={[
          styles.availabilityText,

          worker?.availability === "available" &&
            styles.availableText,

          worker?.availability === "busy" &&
            styles.busyText,
        ]}
      >
        {worker?.availability || "offline"}
      </Text>

    </View>

  </View>


  {/* LOCATION */}

  <View style={styles.locationRow}>

    <Ionicons
      name="location-outline"
      size={17}
      color="#9ca3af"
    />

    <Text style={styles.locationText}>

      {worker?.location?.city || "Location"}

      {worker?.location?.state &&
        `, ${worker.location.state}`}

    </Text>

  </View>


  {/* PROFILE STATS */}

  <View style={styles.profileStats}>

    <View style={styles.profileStat}>

      <Ionicons
        name="star"
        size={18}
        color="#facc15"
      />

      <Text style={styles.profileStatValue}>
        {worker?.rating || 0}
      </Text>

      <Text style={styles.profileStatLabel}>
        Rating
      </Text>

    </View>


    <View style={styles.profileStat}>

      <Ionicons
        name="checkmark-done"
        size={18}
        color="#4ade80"
      />

      <Text style={styles.profileStatValue}>
        {worker?.jobsCompleted || 0}
      </Text>

      <Text style={styles.profileStatLabel}>
        Jobs
      </Text>

    </View>


    <View style={styles.profileStat}>

      <Ionicons
        name="time-outline"
        size={18}
        color="#60a5fa"
      />

      <Text style={styles.profileStatValue}>
        {worker?.responseTime || "N/A"}
      </Text>

      <Text style={styles.profileStatLabel}>
        Response
      </Text>

    </View>

  </View>

</View>


        {/* ==================================
            EARNINGS
        ================================== */}

        <View style={styles.earningsCard}>

          <Text style={styles.cardLabel}>
            Total Earnings
          </Text>

          <Text style={styles.earnings}>
            ₦{totalEarnings.toLocaleString()}
          </Text>

        </View>


        {/* ==================================
            DASHBOARD STATS
        ================================== */}

        <View style={styles.statsRow}>

          <View style={styles.statCard}>

            <Ionicons
              name="briefcase-outline"
              size={23}
              color="#f97316"
            />

            <Text style={styles.statNumber}>
              {activeJobs.length}
            </Text>

            <Text style={styles.statLabel}>
              Active Jobs
            </Text>

          </View>


          <View style={styles.statCard}>

            <Ionicons
              name="checkmark-circle-outline"
              size={23}
              color="#4ade80"
            />

            <Text style={styles.statNumber}>
              {completedJobs.length}
            </Text>

            <Text style={styles.statLabel}>
              Completed
            </Text>

          </View>


          <View style={styles.statCard}>

            <Ionicons
              name="images-outline"
              size={23}
              color="#60a5fa"
            />

            <Text style={styles.statNumber}>
              {portfolio.length}
            </Text>

            <Text style={styles.statLabel}>
              Portfolio
            </Text>

          </View>

        </View>


        {/* ==================================
            ACTIVE JOBS
        ================================== */}

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            Active Jobs
          </Text>

          {activeJobs.length === 0 ? (

            <View style={styles.emptyCard}>

              <Ionicons
                name="briefcase-outline"
                size={35}
                color="#4b5563"
              />

              <Text style={styles.emptyTitle}>
                No active jobs
              </Text>

              <Text style={styles.emptyText}>
                You currently have no active
                jobs assigned to you.
              </Text>

            </View>

          ) : (

            activeJobs.map((job) => (

              <View
                key={job._id}
                style={styles.jobCard}
              >

                <Text style={styles.jobTitle}>
                  {job.title}
                </Text>

                <View style={styles.jobInfo}>

                  <Ionicons
                    name="person-outline"
                    size={16}
                    color="#9ca3af"
                  />

                  <Text style={styles.jobInfoText}>
                    {job.customer?.fullName ||
                      "Customer"}
                  </Text>

                </View>

                <View style={styles.jobInfo}>

                  <Ionicons
                    name="location-outline"
                    size={16}
                    color="#9ca3af"
                  />

                  <Text style={styles.jobInfoText}>
                    {job.location ||
                      "Location not specified"}
                  </Text>

                </View>

                <View style={styles.jobInfo}>

                  <Ionicons
                    name="cash-outline"
                    size={16}
                    color="#9ca3af"
                  />

                  <Text style={styles.jobInfoText}>
                    ₦{(
                      job.budget || 0
                    ).toLocaleString()}
                  </Text>

                </View>

              </View>

            ))

          )}

        </View>


        {/* ==================================
            COMPLETED JOBS
        ================================== */}

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            Completed Jobs
          </Text>

          {completedJobs.length === 0 ? (

            <View style={styles.emptyCard}>

              <Ionicons
                name="checkmark-circle-outline"
                size={35}
                color="#4b5563"
              />

              <Text style={styles.emptyTitle}>
                No completed jobs
              </Text>

              <Text style={styles.emptyText}>
                Completed jobs will appear
                here.
              </Text>

            </View>

          ) : (

            completedJobs.map((job) => (

              <View
                key={job._id}
                style={styles.jobCard}
              >

                <View style={styles.jobHeader}>

                  <Text
                    style={styles.jobTitle}
                  >
                    {job.title}
                  </Text>

                  <View
                    style={styles.completedBadge}
                  >

                    <Text
                      style={
                        styles.completedText
                      }
                    >
                      Completed
                    </Text>

                  </View>

                </View>

                <Text style={styles.jobInfoText}>
                  Customer:{" "}
                  {job.customer?.fullName ||
                    "Customer"}
                </Text>

                <Text
                  style={styles.completedBudget}
                >
                  ₦{(
                    job.budget || 0
                  ).toLocaleString()}
                </Text>

              </View>

            ))

          )}

        </View>


        {/* ==================================
            PORTFOLIO
        ================================== */}

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            Portfolio
          </Text>

          {portfolio.length === 0 ? (

            <View style={styles.emptyCard}>

              <Ionicons
                name="images-outline"
                size={35}
                color="#4b5563"
              />

              <Text style={styles.emptyTitle}>
                No portfolio yet
              </Text>

              <Text style={styles.emptyText}>
                Your portfolio items will
                appear here.
              </Text>

            </View>

          ) : (

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={
                false
              }
            >

              {portfolio.map((item) => (

                <View
                  key={item._id}
                  style={styles.portfolioCard}
                >

                  {item.image && (

                    <Image
                      source={{
                        uri: item.image,
                      }}
                      style={
                        styles.portfolioImage
                      }
                    />

                  )}

                  <View
                    style={
                      styles.portfolioContent
                    }
                  >

                    <Text
                      style={
                        styles.portfolioTitle
                      }
                    >
                      {item.title}
                    </Text>

                    {item.location && (

                      <Text
                        style={
                          styles.portfolioLocation
                        }
                      >
                        {item.location}
                      </Text>

                    )}

                  </View>

                </View>

              ))}

            </ScrollView>

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


export default WorkerDashboardScreen;


// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#030712",
  },

  content: {
    paddingBottom: 40,
  },


  // ========================================
  // HEADER
  // ========================================

  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },

  title: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "700",
  },

  subtitle: {
    marginTop: 7,
    color: "#9ca3af",
    fontSize: 14,
    lineHeight: 21,
  },


  // ========================================
  // PROFILE
  // ========================================

  profileCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,

    backgroundColor: "#111827",

    borderWidth: 1,
    borderColor: "#1f2937",

    borderRadius: 20,
  },

  profileHeader: {
  flexDirection: "row",
  alignItems: "center",
},

  avatar: {
    width: 62,
    height: 62,

    borderRadius: 18,

    backgroundColor: "#1f2937",

    alignItems: "center",
    justifyContent: "center",
     overflow: "hidden",
  },

  avatarImage: {
  width: "100%",
  height: "100%",
},

  profileInfo: {
  flex: 1,
  marginLeft: 14,
  minWidth: 0,
},

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  workerName: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
  },

  skill: {
    marginTop: 5,
    color: "#f97316",
    fontSize: 14,
    fontWeight: "600",
  },

  availabilityRow: {
    marginTop: 16,
  },

  availabilityBadge: {
    alignSelf: "flex-start",

    paddingHorizontal: 12,
    paddingVertical: 6,

    borderRadius: 20,

    backgroundColor: "#374151",
  },

  availableBadge: {
    backgroundColor:
      "rgba(34,197,94,0.15)",
  },

  busyBadge: {
    backgroundColor:
      "rgba(249,115,22,0.15)",
  },

  availabilityText: {
    color: "#9ca3af",
    fontSize: 12,
    fontWeight: "600",
  },

  availableText: {
    color: "#4ade80",
  },

  busyText: {
    color: "#fb923c",
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: 15,
  },

  locationText: {
    marginLeft: 7,
    color: "#9ca3af",
    fontSize: 13,
  },


  // ========================================
  // PROFILE STATS
  // ========================================

  profileStats: {
    flexDirection: "row",

    marginTop: 20,
    paddingTop: 18,

    borderTopWidth: 1,
    borderTopColor: "#1f2937",
  },

  profileStat: {
    flex: 1,
    alignItems: "center",
  },

  profileStatValue: {
    marginTop: 5,
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },

  profileStatLabel: {
    marginTop: 3,
    color: "#6b7280",
    fontSize: 11,
  },


  // ========================================
  // EARNINGS
  // ========================================

  earningsCard: {
    marginHorizontal: 20,
    marginBottom: 16,

    padding: 20,

    backgroundColor: "#111827",

    borderWidth: 1,
    borderColor: "#1f2937",

    borderRadius: 18,
  },

  cardLabel: {
    color: "#9ca3af",
    fontSize: 14,
  },

  earnings: {
    marginTop: 7,
    color: "#4ade80",
    fontSize: 28,
    fontWeight: "700",
  },


  // ========================================
  // STATS
  // ========================================

  statsRow: {
    flexDirection: "row",

    paddingHorizontal: 20,

    gap: 10,

    marginBottom: 10,
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
    fontWeight: "700",
  },

  statLabel: {
    marginTop: 4,
    color: "#9ca3af",
    fontSize: 11,
    textAlign: "center",
  },


  // ========================================
  // SECTIONS
  // ========================================

  section: {
    marginTop: 16,
    paddingHorizontal: 20,
  },

  sectionTitle: {
    marginBottom: 12,

    color: "#ffffff",

    fontSize: 20,
    fontWeight: "700",
  },


  // ========================================
  // JOB CARD
  // ========================================

  jobCard: {
    marginBottom: 12,

    padding: 18,

    backgroundColor: "#111827",

    borderWidth: 1,
    borderColor: "#1f2937",

    borderRadius: 16,
  },

  jobHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",

    gap: 10,
  },

  jobTitle: {
    flex: 1,

    color: "#ffffff",

    fontSize: 17,
    fontWeight: "700",

    marginBottom: 10,
  },

  jobInfo: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: 7,
  },

  jobInfoText: {
    marginLeft: 7,

    color: "#9ca3af",

    fontSize: 13,
  },

  completedBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,

    borderRadius: 15,

    backgroundColor:
      "rgba(34,197,94,0.15)",
  },

  completedText: {
    color: "#4ade80",
    fontSize: 11,
    fontWeight: "600",
  },

  completedBudget: {
    marginTop: 12,
    color: "#4ade80",
    fontSize: 15,
    fontWeight: "700",
  },


  // ========================================
  // EMPTY
  // ========================================

  emptyCard: {
    padding: 30,

    backgroundColor: "#111827",

    borderWidth: 1,
    borderColor: "#1f2937",

    borderRadius: 16,

    alignItems: "center",
  },

  emptyTitle: {
    marginTop: 12,

    color: "#d1d5db",

    fontSize: 16,
    fontWeight: "600",
  },

  emptyText: {
    marginTop: 6,

    color: "#6b7280",

    fontSize: 13,
    lineHeight: 20,

    textAlign: "center",
  },


  // ========================================
  // PORTFOLIO
  // ========================================

  portfolioCard: {
    width: 230,

    marginRight: 12,

    overflow: "hidden",

    backgroundColor: "#111827",

    borderWidth: 1,
    borderColor: "#1f2937",

    borderRadius: 16,
  },

  portfolioImage: {
    width: "100%",
    height: 160,
  },

  portfolioContent: {
    padding: 14,
  },

  portfolioTitle: {
    color: "#ffffff",

    fontSize: 15,
    fontWeight: "700",
  },

  portfolioLocation: {
    marginTop: 5,

    color: "#9ca3af",

    fontSize: 12,
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
    marginTop: 15,

    color: "#ffffff",

    fontSize: 20,
    fontWeight: "700",
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


  // ========================================
  // BUTTON
  // ========================================

  orangeButton: {
    marginTop: 20,

    paddingHorizontal: 30,
    paddingVertical: 13,

    borderRadius: 12,

    backgroundColor: "#f97316",
  },

  buttonText: {
    color: "#ffffff",

    fontSize: 14,
    fontWeight: "700",
  },

 editProfileButton: {
  width: 72,
  height: 38,

  borderRadius: 10,

  backgroundColor: "rgba(249,115,22,0.1)",

  borderWidth: 1,
  borderColor: "rgba(249,115,22,0.25)",

  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",

  gap: 5,
},

editProfileText: {
  color: "#f97316",
  fontSize: 12,
  fontWeight: "700",
},

editProfileText: {
  color: "#f97316",
  fontSize: 13,
  fontWeight: "700",
},

});