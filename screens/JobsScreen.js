import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import Footer from "../components/Footer";

import Navbar from "../components/Navbar";


const JobsScreen = ({navigation}) => {

  // ======================================
  // JOB DATA
  // ======================================

  const [jobList, setJobList] = useState([]);

  // ======================================
  // LOADING
  // ======================================

  const [loading, setLoading] = useState(true);

  // ======================================
  // FETCH JOBS
  // ======================================

  useEffect(() => {

    const fetchJobs = async () => {

      try {

        setLoading(true);

       const response = await fetch(
  `${process.env.EXPO_PUBLIC_API_URL}/jobs?page=1&limit=12`
);

const data = await response.json();

if (!response.ok) {
  throw new Error(
    data.message || "Failed to load jobs"
  );
}

setJobList(data.jobs || []);

      } catch (error) {

        console.error(
          "Failed to fetch jobs:",
          error
        );

        setJobList([]);

      } finally {

        setLoading(false);

      }

    };

    fetchJobs();

  }, []);


  // ======================================
  // RENDER
  // ======================================

  return (

    <SafeAreaView style={styles.container}>

      {/* ======================================
          NAVBAR
      ====================================== */}

      <Navbar />


      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        {/* ======================================
            HEADER
        ====================================== */}

        <View style={styles.header}>

          <Text style={styles.title}>
            Browse Jobs
          </Text>

          <Text style={styles.subtitle}>
            Find real job opportunities from
            customers near you.
          </Text>

        </View>


        {/* ======================================
            LOADING
        ====================================== */}

        {loading && (

          <View style={styles.loadingContainer}>

            <ActivityIndicator
              size="large"
              color="#f97316"
            />

            <Text style={styles.loadingText}>
              Loading jobs...
            </Text>

          </View>

        )}


        {/* ======================================
            JOBS
        ====================================== */}

        {!loading && jobList.length > 0 && (

          <View style={styles.jobsContainer}>

            {jobList.map((job) => (

              <View
                key={job._id}
                style={styles.jobCard}
              >

                {/* TITLE */}

                <Text style={styles.jobTitle}>
                  {job.title}
                </Text>


                {/* LOCATION */}

                <View style={styles.infoRow}>

                  <Ionicons
                    name="location-outline"
                    size={17}
                    color="#9ca3af"
                  />

                  <Text style={styles.infoText}>

                    {job.location?.city ||
                      "Location not specified"}

                    {job.location?.state &&
                      `, ${job.location.state}`}

                  </Text>

                </View>


                {/* BUDGET */}

                <View style={styles.infoRow}>

                  <Ionicons
                    name="briefcase-outline"
                    size={17}
                    color="#9ca3af"
                  />

                  <Text style={styles.infoText}>

                    {job.budget
                      ? `₦${job.budget.toLocaleString()}`
                      : "Budget not specified"}

                  </Text>

                </View>


                {/* DATE */}

                <View style={styles.infoRow}>

                  <Ionicons
                    name="time-outline"
                    size={17}
                    color="#6b7280"
                  />

                  <Text
                    style={[
                      styles.infoText,
                      styles.dateText,
                    ]}
                  >

                    {job.createdAt
                      ? new Date(
                          job.createdAt
                        ).toLocaleDateString()
                      : "Date not available"}

                  </Text>

                </View>


                {/* CATEGORY */}

                <View style={styles.category}>

                  <Text style={styles.categoryText}>
                    {job.category}
                  </Text>

                </View>


                {/* ACTION */}

                <View style={styles.actionRow}>

                  <TouchableOpacity
  onPress={() =>
    navigation.navigate(
      "JobDetails",
      {
        jobId: job._id,
      }
    )
  }
>
  <Text style={styles.viewDetails}>
    View Details
  </Text>
</TouchableOpacity>

                </View>

              </View>

            ))}

          </View>

        )}


        {/* ======================================
            NO JOBS
        ====================================== */}

        {!loading && jobList.length === 0 && (

          <View style={styles.emptyState}>

            <Ionicons
              name="briefcase-outline"
              size={48}
              color="#4b5563"
            />

            <Text style={styles.emptyTitle}>
              No jobs found
            </Text>

            <Text style={styles.emptyText}>
              There are currently no job
              opportunities available.
            </Text>

          </View>

        )}

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


export default JobsScreen;


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
    paddingBottom: 24,

    borderBottomWidth: 1,
    borderBottomColor: "#1f2937",
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#ffffff",
  },

  subtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: "#9ca3af",
  },


  // ========================================
  // LOADING
  // ========================================

  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",

    paddingVertical: 80,
  },

  loadingText: {
    marginTop: 12,

    fontSize: 14,
    color: "#9ca3af",
  },


  // ========================================
  // JOBS
  // ========================================

  jobsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  jobCard: {
    backgroundColor: "#111827",

    borderWidth: 1,
    borderColor: "#1f2937",

    borderRadius: 14,

    padding: 18,

    marginBottom: 16,
  },

  jobTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#ffffff",

    marginBottom: 14,
  },


  // ========================================
  // INFORMATION
  // ========================================

  infoRow: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: 9,
  },

  infoText: {
    flex: 1,

    marginLeft: 9,

    fontSize: 14,
    color: "#9ca3af",
  },

  dateText: {
    color: "#6b7280",
  },


  // ========================================
  // CATEGORY
  // ========================================

  category: {
    alignSelf: "flex-start",

    backgroundColor: "#1f2937",

    paddingHorizontal: 11,
    paddingVertical: 6,

    borderRadius: 20,

    marginTop: 4,
    marginBottom: 16,
  },

  categoryText: {
    fontSize: 12,
    color: "#d1d5db",
  },


  // ========================================
  // ACTION
  // ========================================

  actionRow: {
    borderTopWidth: 1,
    borderTopColor: "#1f2937",

    paddingTop: 14,
  },

  viewDetails: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f97316",
  },


  // ========================================
  // EMPTY STATE
  // ========================================

  emptyState: {
    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 30,
    paddingVertical: 80,
  },

  emptyTitle: {
    marginTop: 16,

    fontSize: 18,
    fontWeight: "600",
    color: "#d1d5db",
  },

  emptyText: {
    marginTop: 7,

    fontSize: 14,
    lineHeight: 21,

    color: "#6b7280",

    textAlign: "center",
  },

});