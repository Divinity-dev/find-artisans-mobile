import React, {
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../context/AuthContext";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


const JobDetailsScreen = ({
  navigation,
  route,
}) => {

  // ======================================
  // JOB ID
  // ======================================

  const { jobId } = route.params || {};


  // ======================================
  // AUTH
  // ======================================

  const {
    user,
    token,
    isAuthenticated,
  } = useAuth();


  // ======================================
  // JOB
  // ======================================

  const [job, setJob] = useState(null);

  const [loading, setLoading] =
    useState(true);


  // ======================================
  // APPLY
  // ======================================

  const [applying, setApplying] =
    useState(false);


  // ======================================
  // FETCH JOB
  // ======================================

  useEffect(() => {

    const fetchJob = async () => {

      try {

        setLoading(true);

        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/jobs/${jobId}`
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load job"
          );
        }

        setJob(data.data);

      } catch (error) {

        console.error(
          "Failed to fetch job:",
          error
        );

        setJob(null);

      } finally {

        setLoading(false);

      }

    };


    if (jobId) {
      fetchJob();
    } else {
      setLoading(false);
    }

  }, [jobId]);


  // ======================================
  // APPLY
  // ======================================

  const handleApply = async () => {

    if (!isAuthenticated) {
      navigation.navigate("Login");
      return;
    }

    if (!token || !jobId) {
      return;
    }

    try {

      setApplying(true);

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/jobs/${jobId}/apply`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to apply"
        );
      }


      // ==================================
      // UPDATE JOB LOCALLY
      // ==================================

      setJob((previousJob) => {

        if (!previousJob) {
          return previousJob;
        }

        return {
          ...previousJob,
          hasApplied: true,
        };

      });

    } catch (error) {

      console.error(
        "Failed to apply:",
        error
      );

    } finally {

      setApplying(false);

    }

  };


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
            Loading job...
          </Text>

        </View>

      </SafeAreaView>
    );

  }


  // ======================================
  // JOB NOT FOUND
  // ======================================

  if (!job) {

    return (
      <SafeAreaView
        style={styles.container}
      >

        <Navbar />

        <View
          style={styles.notFoundContainer}
        >

          <Ionicons
            name="briefcase-outline"
            size={50}
            color="#4b5563"
          />

          <Text
            style={styles.notFoundTitle}
          >
            Job not found
          </Text>

          <Text
            style={styles.notFoundText}
          >
            This job may have been removed
            or is no longer available.
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
            BACK BUTTON
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
            Back to Jobs
          </Text>

        </TouchableOpacity>


        {/* ==================================
            JOB CARD
        ================================== */}

        <View style={styles.card}>

          <Text style={styles.title}>
            {job.title}
          </Text>


          {/* CATEGORY */}

          <View style={styles.infoRow}>

            <Ionicons
              name="briefcase-outline"
              size={18}
              color="#9ca3af"
            />

            <Text style={styles.infoText}>
              {job.category ||
                "Category not specified"}
            </Text>

          </View>


          {/* BUDGET */}

          <View style={styles.infoRow}>

            <Ionicons
              name="cash-outline"
              size={18}
              color="#9ca3af"
            />

            <Text style={styles.infoText}>
              {job.budget
                ? `₦${job.budget.toLocaleString()}`
                : "Budget not specified"}
            </Text>

          </View>


          {/* LOCATION */}

          <View style={styles.infoRow}>

            <Ionicons
              name="location-outline"
              size={18}
              color="#9ca3af"
            />

            <Text style={styles.infoText}>

              {job.location?.city ||
                "Location not specified"}

              {job.location?.state &&
                `, ${job.location.state}`}

            </Text>

          </View>


          {/* DATE */}

          <View style={styles.infoRow}>

            <Ionicons
              name="time-outline"
              size={18}
              color="#9ca3af"
            />

            <Text style={styles.infoText}>

              {job.createdAt
                ? new Date(
                    job.createdAt
                  ).toLocaleDateString()
                : "Date not available"}

            </Text>

          </View>


          {/* STATUS */}

          <View style={styles.statusContainer}>

            <Text style={styles.statusText}>
              {job.status ||
                "Available"}
            </Text>

          </View>


          {/* DESCRIPTION */}

          <Text style={styles.sectionTitle}>
            Description
          </Text>

          <Text style={styles.description}>
            {job.description ||
              "No description provided."}
          </Text>

        </View>


        {/* ==================================
            JOB PHOTOS
        ================================== */}

        {job.images?.length > 0 && (

          <View style={styles.card}>

            <Text
              style={styles.sectionTitle}
            >
              Job Photos
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={
                false
              }
              contentContainerStyle={
                styles.imageList
              }
            >

              {job.images.map(
                (image, index) => (

                  <Image
                    key={index}
                    source={{
                      uri: image,
                    }}
                    style={styles.jobImage}
                  />

                )
              )}

            </ScrollView>

          </View>

        )}


        {/* ==================================
            CUSTOMER CARD
        ================================== */}

        <View style={styles.card}>

          <Text
            style={styles.sectionTitle}
          >
            Posted By
          </Text>


          <View
            style={styles.customerContainer}
          >

            {job.customer?.profilePhoto ? (

              <Image
                source={{
                  uri:
                    job.customer
                      .profilePhoto,
                }}
                style={
                  styles.customerImage
                }
              />

            ) : (

              <View
                style={
                  styles.customerPlaceholder
                }
              >

                <Ionicons
                  name="person"
                  size={28}
                  color="#6b7280"
                />

              </View>

            )}


            <View
              style={styles.customerInfo}
            >

              <Text
                style={styles.customerName}
              >
                {job.customer?.fullName ||
                  "Customer"}
              </Text>

              <Text
                style={styles.customerLocation}
              >

                {job.customer?.location
                  ?.city ||
                  "Location not specified"}

                {job.customer?.location
                  ?.state &&
                  `, ${job.customer.location.state}`}

              </Text>

            </View>

          </View>


          {/* VERIFIED */}

          {job.customer?.verification
            ?.isVerified && (

            <View
              style={styles.verificationRow}
            >

              <Ionicons
                name="checkmark-circle"
                size={18}
                color="#4ade80"
              />

              <Text
                style={
                  styles.verifiedText
                }
              >
                Verified Customer
              </Text>

            </View>

          )}


          {/* TRUST PROFILE */}

          <View
            style={styles.verificationRow}
          >

            <Ionicons
              name="shield-checkmark"
              size={18}
              color="#60a5fa"
            />

            <Text
              style={styles.trustText}
            >
              Trust Profile Available
            </Text>

          </View>


          {/* CUSTOMER PROFILE */}

         <TouchableOpacity
  style={styles.customerButton}
  onPress={() =>
    navigation.navigate(
      "CustomerProfile",
      {
        customerId:
          job.customer?._id,
      }
    )
  }
>

            <Text
              style={
                styles.customerButtonText
              }
            >
              View Customer Profile
            </Text>

          </TouchableOpacity>

        </View>


        {/* ==================================
            APPLY CARD
        ================================== */}

        <View style={styles.card}>

          <Text
            style={styles.sectionTitle}
          >
            Interested?
          </Text>

          <Text
            style={styles.applyDescription}
          >
            Apply for this job and the
            customer will be able to review
            your profile.
          </Text>


          <TouchableOpacity
            onPress={handleApply}
            disabled={
              applying ||
              job.hasApplied
            }
            style={[
              styles.applyButton,

              job.hasApplied &&
                styles.appliedButton,

              applying &&
                styles.applyingButton,
            ]}
          >

            <Text
              style={styles.applyButtonText}
            >

              {job.hasApplied
                ? "Applied ✓"
                : applying
                ? "Applying..."
                : !isAuthenticated
                ? "Login to Apply"
                : "Apply Now"}

            </Text>

          </TouchableOpacity>

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


export default JobDetailsScreen;


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

  title: {
    color: "#ffffff",
    fontSize: 27,
    lineHeight: 34,
    fontWeight: "700",

    marginBottom: 20,
  },


  // ========================================
  // INFO
  // ========================================

  infoRow: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: 12,
  },

  infoText: {
    flex: 1,

    marginLeft: 10,

    color: "#9ca3af",
    fontSize: 14,
  },


  // ========================================
  // STATUS
  // ========================================

  statusContainer: {
    alignSelf: "flex-start",

    marginTop: 5,

    paddingHorizontal: 12,
    paddingVertical: 7,

    borderRadius: 20,

    backgroundColor:
      "rgba(249, 115, 22, 0.15)",
  },

  statusText: {
    color: "#fb923c",
    fontSize: 13,
    fontWeight: "600",
  },


  // ========================================
  // SECTIONS
  // ========================================

  sectionTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",

    marginBottom: 12,
  },

  description: {
    color: "#9ca3af",

    fontSize: 15,
    lineHeight: 24,
  },


  // ========================================
  // IMAGES
  // ========================================

  imageList: {
    paddingRight: 5,
  },

  jobImage: {
    width: 280,
    height: 210,

    borderRadius: 14,

    marginRight: 12,
  },


  // ========================================
  // CUSTOMER
  // ========================================

  customerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  customerImage: {
    width: 64,
    height: 64,

    borderRadius: 16,
  },

  customerPlaceholder: {
    width: 64,
    height: 64,

    borderRadius: 16,

    backgroundColor: "#1f2937",

    alignItems: "center",
    justifyContent: "center",
  },

  customerInfo: {
    flex: 1,
    marginLeft: 14,
  },

  customerName: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
  },

  customerLocation: {
    marginTop: 5,
    color: "#9ca3af",
    fontSize: 13,
  },


  // ========================================
  // VERIFICATION
  // ========================================

  verificationRow: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: 17,
  },

  verifiedText: {
    marginLeft: 9,
    color: "#4ade80",
    fontSize: 14,
  },

  trustText: {
    marginLeft: 9,
    color: "#60a5fa",
    fontSize: 14,
  },


  // ========================================
  // CUSTOMER BUTTON
  // ========================================

  customerButton: {
    marginTop: 20,

    paddingVertical: 13,

    borderRadius: 12,

    backgroundColor: "#1f2937",

    alignItems: "center",
  },

  customerButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },


  // ========================================
  // APPLY
  // ========================================

  applyDescription: {
    color: "#9ca3af",
    fontSize: 14,
    lineHeight: 21,
  },

  applyButton: {
    marginTop: 20,

    minHeight: 52,

    borderRadius: 12,

    backgroundColor: "#f97316",

    alignItems: "center",
    justifyContent: "center",
  },

  appliedButton: {
    backgroundColor: "#16a34a",
  },

  applyingButton: {
    backgroundColor: "#fb923c",
  },

  applyButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
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