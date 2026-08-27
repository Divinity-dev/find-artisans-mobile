import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";

import { StatusBar } from "expo-status-bar";

import Navbar from "../components/Navbar";

const WorkerDetailsScreen = ({ route, navigation }) => {
  // ==========================================
  // WORKER ID
  // ==========================================

  const { id } = route.params || {};

  // ==========================================
  // STATE
  // ==========================================

  const [worker, setWorker] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [ratingStats, setRatingStats] = useState(null);
  const [jobs, setJobs] = useState([]);

  const [activeTab, setActiveTab] = useState("about");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [contactVisible, setContactVisible] =
    useState(false);

  // ==========================================
  // FETCH WORKER DATA
  // ==========================================

  useEffect(() => {
    const fetchWorker = async () => {
      if (!id) {
        setError("Worker not found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const API_URL =
          process.env.EXPO_PUBLIC_API_URL;

        // ======================================
        // WORKER
        // ======================================

        const workerResponse = await fetch(
          `${API_URL}/users/${id}`
        );

        if (!workerResponse.ok) {
          throw new Error(
            "Failed to fetch worker."
          );
        }

        const workerData =
          await workerResponse.json();

        const workerResult =
          workerData?.data?.data ||
          workerData?.data?.user ||
          workerData?.data ||
          workerData?.user ||
          workerData;

        setWorker(workerResult);

        // ======================================
        // REVIEWS
        // ======================================

        try {
          const reviewResponse =
            await fetch(
              `${API_URL}/reviews/worker/${id}`
            );

          if (reviewResponse.ok) {
            const reviewData =
              await reviewResponse.json();

            setReviews(
              reviewData?.reviews || []
            );

            setRatingStats(
              reviewData?.stats || null
            );
          }
        } catch (reviewError) {
          console.log(
            "Failed to fetch reviews:",
            reviewError
          );
        }

        // ======================================
        // JOBS
        // ======================================

        try {
          const jobsResponse =
            await fetch(
              `${API_URL}/jobs/worker/public/${id}`
            );

          if (jobsResponse.ok) {
            const jobsData =
              await jobsResponse.json();

            const jobsResult =
              jobsData?.data?.jobs ||
              jobsData?.data ||
              jobsData ||
              [];

            setJobs(
              Array.isArray(jobsResult)
                ? jobsResult
                : []
            );
          }
        } catch (jobError) {
          console.log(
            "Failed to fetch worker jobs:",
            jobError
          );
        }
      } catch (fetchError) {
        console.error(
          "Failed to fetch worker:",
          fetchError
        );

        setError(
          "Unable to load this artisan. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWorker();
  }, [id]);

  // ==========================================
  // HELPERS
  // ==========================================

  const user = worker?.user || worker;

  const profilePhoto =
    user?.profilePhoto ||
    "https://via.placeholder.com/300";

  const fullName =
    user?.fullName || "Unknown Artisan";

  const skill =
    user?.skill || "Artisan";

  const phone =
    user?.phone || "";

  const location = user?.location || {};

  const locationText = [
    location.city,
    location.state,
  ]
    .filter(Boolean)
    .join(", ");

  const rating =
    ratingStats?.user?.avgRating ??
    user?.rating ??
    0;

  const totalReviews =
    ratingStats?.user?.totalReviews ??
    worker?.totalReviews ??
    0;

  const completedJobs =
    jobs.filter(
      (job) => job.status === "completed"
    );

  const completedJobsCount =
    completedJobs.length;

  const yearsOfExperience =
    user?.yearsOfExperience || 0;

  const skills =
    Array.isArray(user?.skills)
      ? user.skills
      : [];

  const portfolio =
    Array.isArray(user?.portfolio)
      ? user.portfolio
      : [];

  const isVerified =
    user?.verification?.isVerified;

  // ==========================================
  // WHATSAPP
  // ==========================================

  const openWhatsApp = async () => {
    if (!phone) {
      return;
    }

    const cleanedPhone = phone
      .replace(/\D/g, "")
      .replace(/^0/, "234");

    const url =
      `https://wa.me/${cleanedPhone}`;

    try {
      await Linking.openURL(url);
    } catch (whatsappError) {
      console.error(
        "Unable to open WhatsApp:",
        whatsappError
      );
    }
  };

  // ==========================================
  // PHONE
  // ==========================================

  const callWorker = async () => {
    if (!phone) {
      return;
    }

    try {
      await Linking.openURL(
        `tel:${phone}`
      );
    } catch (callError) {
      console.error(
        "Unable to call worker:",
        callError
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <StatusBar style="light" />

        <Navbar />

        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color="#f97316"
          />

          <Text
            style={styles.loadingText}
          >
            Loading artisan...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !worker) {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <StatusBar style="light" />

        <Navbar />

        <View style={styles.center}>
          <Text
            style={styles.errorIcon}
          >
            ⚠️
          </Text>

          <Text
            style={styles.errorTitle}
          >
            Artisan unavailable
          </Text>

          <Text
            style={styles.errorText}
          >
            {error ||
              "We couldn't find this artisan."}
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
              Go back
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ==========================================
  // SCREEN
  // ==========================================

  return (
    <SafeAreaView
      style={styles.container}
    >
      <StatusBar style="light" />

      <Navbar />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
      >
        {/* ====================================
            BACK BUTTON
        ===================================== */}

        <TouchableOpacity
          style={styles.backRow}
          onPress={() =>
            navigation.goBack()
          }
        >
          <Text
            style={styles.backArrow}
          >
            ←
          </Text>

          <Text
            style={styles.backText}
          >
            Back to artisans
          </Text>
        </TouchableOpacity>

        {/* ====================================
            PROFILE HEADER
        ===================================== */}

        <View
          style={styles.profileCard}
        >
          {/* COVER */}

          <View
            style={styles.cover}
          />

          {/* PROFILE CONTENT */}

          <View
            style={styles.profileContent}
          >
            {/* PROFILE IMAGE */}

            <View
              style={styles.profileImageWrapper}
            >
              <Image
                source={{
                  uri: profilePhoto,
                }}
                style={styles.profileImage}
              />
            </View>

            {/* NAME */}

            <View
              style={styles.nameRow}
            >
              <Text
                style={styles.name}
              >
                {fullName}
              </Text>

              {isVerified ? (
                <View
                  style={
                    styles.verifiedBadge
                  }
                >
                  <Text
                    style={
                      styles.verifiedIcon
                    }
                  >
                    ✓
                  </Text>

                  <Text
                    style={
                      styles.verifiedText
                    }
                  >
                    Verified
                  </Text>
                </View>
              ) : null}
            </View>

            {/* SKILL */}

            <Text
              style={styles.skill}
            >
              {skill}
            </Text>

            {/* META */}

            <View
              style={styles.metaContainer}
            >
              {locationText ? (
                <View
                  style={styles.metaItem}
                >
                  <Text
                    style={styles.metaIcon}
                  >
                    📍
                  </Text>

                  <Text
                    style={styles.metaText}
                  >
                    {locationText}
                  </Text>
                </View>
              ) : null}

              <View
                style={styles.metaItem}
              >
                <Text
                  style={styles.metaIcon}
                >
                  💼
                </Text>

                <Text
                  style={styles.metaText}
                >
                  {completedJobsCount}{" "}
                  {completedJobsCount === 1
                    ? "Job"
                    : "Jobs"}
                </Text>
              </View>

              <View
                style={styles.metaItem}
              >
                <Text
                  style={styles.star}
                >
                  ★
                </Text>

                <Text
                  style={styles.ratingText}
                >
                  {Number(rating).toFixed(1)}
                </Text>

                <Text
                  style={styles.reviewCount}
                >
                  ({totalReviews})
                </Text>
              </View>
            </View>

            {/* EXPERIENCE */}

            <View
              style={styles.experienceBadge}
            >
              <Text
                style={
                  styles.experienceText
                }
              >
                {yearsOfExperience}{" "}
                {yearsOfExperience === 1
                  ? "Year"
                  : "Years"}{" "}
                Experience
              </Text>
            </View>

            {/* ACTIONS */}

            <View
              style={styles.actions}
            >
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.whatsappButton,
                  !phone &&
                    styles.disabledButton,
                ]}
                disabled={!phone}
                onPress={openWhatsApp}
              >
                <Text
                  style={
                    styles.actionIcon
                  }
                >
                  💬
                </Text>

                <Text
                  style={
                    styles.actionText
                  }
                >
                  WhatsApp
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.contactButton,
                  !phone &&
                    styles.disabledButton,
                ]}
                disabled={!phone}
                onPress={() =>
                  setContactVisible(
                    (previous) =>
                      !previous
                  )
                }
              >
                <Text
                  style={
                    styles.actionIcon
                  }
                >
                  📞
                </Text>

                <View>
                  <Text
                    style={
                      styles.actionText
                    }
                  >
                    Contact
                  </Text>

                  {contactVisible &&
                  phone ? (
                    <Text
                      style={
                        styles.phoneText
                      }
                    >
                      {phone}
                    </Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            </View>

            {/* CALL */}

            {contactVisible &&
            phone ? (
              <TouchableOpacity
                style={
                  styles.callButton
                }
                onPress={callWorker}
              >
                <Text
                  style={
                    styles.callButtonText
                  }
                >
                  Call {fullName}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* ====================================
            TABS
        ===================================== */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.tabsContainer
          }
        >
          {[
            "about",
            "portfolio",
            "jobs",
            "reviews",
          ].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab &&
                  styles.activeTab,
              ]}
              onPress={() =>
                setActiveTab(tab)
              }
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab &&
                    styles.activeTabText,
                ]}
              >
                {tab
                  .charAt(0)
                  .toUpperCase() +
                  tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ====================================
            ABOUT
        ===================================== */}

        {activeTab === "about" ? (
          <View>
            <View
              style={styles.sectionCard}
            >
              <Text
                style={styles.sectionTitle}
              >
                About
              </Text>

              <Text
                style={styles.aboutText}
              >
                {user?.about ||
                  "No bio available"}
              </Text>
            </View>

            <View
              style={styles.sectionCard}
            >
              <Text
                style={styles.sectionTitle}
              >
                Skills
              </Text>

              {skills.length === 0 ? (
                <Text
                  style={
                    styles.emptyText
                  }
                >
                  No skills listed.
                </Text>
              ) : (
                <View
                  style={styles.skillsContainer}
                >
                  {skills.map(
                    (skillItem, index) => (
                      <View
                        key={index}
                        style={styles.skillChip}
                      >
                        <Text
                          style={
                            styles.skillChipText
                          }
                        >
                          {skillItem}
                        </Text>
                      </View>
                    )
                  )}
                </View>
              )}
            </View>
          </View>
        ) : null}

        {/* ====================================
            PORTFOLIO
        ===================================== */}

        {activeTab === "portfolio" ? (
          <View>
            {portfolio.length === 0 ? (
              <View
                style={styles.emptyCard}
              >
                <Text
                  style={styles.emptyIcon}
                >
                  🖼️
                </Text>

                <Text
                  style={styles.emptyTitle}
                >
                  No portfolio yet
                </Text>

                <Text
                  style={styles.emptyText}
                >
                  This artisan hasn't added
                  any portfolio items yet.
                </Text>
              </View>
            ) : (
              portfolio.map(
                (item, index) => (
                  <View
                    key={index}
                    style={
                      styles.portfolioCard
                    }
                  >
                    {item?.image ? (
                      <Image
                        source={{
                          uri: item.image,
                        }}
                        style={
                          styles.portfolioImage
                        }
                      />
                    ) : null}

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
                        {item?.title ||
                          "Portfolio item"}
                      </Text>

                      {item?.location ? (
                        <Text
                          style={
                            styles.portfolioLocation
                          }
                        >
                          📍 {item.location}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                )
              )
            )}
          </View>
        ) : null}

        {/* ====================================
            JOBS
        ===================================== */}

        {activeTab === "jobs" ? (
          <View>
            <Text
              style={styles.sectionHeading}
            >
              Completed Jobs
            </Text>

            {completedJobs.length === 0 ? (
              <View
                style={styles.emptyCard}
              >
                <Text
                  style={styles.emptyIcon}
                >
                  💼
                </Text>

                <Text
                  style={styles.emptyTitle}
                >
                  No completed jobs
                </Text>

                <Text
                  style={styles.emptyText}
                >
                  No completed jobs found for
                  this artisan.
                </Text>
              </View>
            ) : (
              completedJobs.map(
                (job) => (
                  <View
                    key={job._id}
                    style={styles.jobCard}
                  >
                    <View
                      style={
                        styles.jobHeader
                      }
                    >
                      <View
                        style={
                          styles.jobHeaderText
                        }
                      >
                        <Text
                          style={
                            styles.jobTitle
                          }
                        >
                          {job.title}
                        </Text>

                        <Text
                          style={
                            styles.jobBudget
                          }
                        >
                          Budget: ₦
                          {job.budget ||
                            "N/A"}
                        </Text>
                      </View>

                      <View
                        style={
                          styles.completedBadge
                        }
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

                    <Text
                      style={
                        styles.postedBy
                      }
                    >
                      Posted by:{" "}
                      {job.postedBy
                        ?.fullName ||
                        job.postedBy
                          ?.name ||
                        "Unknown"}
                    </Text>

                    <Text
                      style={
                        styles.jobDescription
                      }
                    >
                      {job.description ||
                        "No description available."}
                    </Text>
                  </View>
                )
              )
            )}
          </View>
        ) : null}

        {/* ====================================
            REVIEWS
        ===================================== */}

        {activeTab === "reviews" ? (
          <View>
            {reviews.length === 0 ? (
              <View
                style={styles.emptyCard}
              >
                <Text
                  style={styles.emptyIcon}
                >
                  ⭐
                </Text>

                <Text
                  style={styles.emptyTitle}
                >
                  No reviews yet
                </Text>

                <Text
                  style={styles.emptyText}
                >
                  This artisan hasn't received
                  any reviews yet.
                </Text>
              </View>
            ) : (
              reviews.map(
                (review) => (
                  <View
                    key={review._id}
                    style={
                      styles.reviewCard
                    }
                  >
                    <View
                      style={
                        styles.reviewHeader
                      }
                    >
                      <Text
                        style={
                          styles.reviewerName
                        }
                      >
                        {review.reviewer
                          ?.fullName ||
                          "Anonymous"}
                      </Text>

                      <View
                        style={
                          styles.reviewRating
                        }
                      >
                        <Text
                          style={
                            styles.star
                          }
                        >
                          ★
                        </Text>

                        <Text
                          style={
                            styles.reviewRatingText
                          }
                        >
                          {review.rating}
                        </Text>
                      </View>
                    </View>

                    <Text
                      style={
                        styles.reviewComment
                      }
                    >
                      {review.comment ||
                        "No comment."}
                    </Text>
                  </View>
                )
              )
            )}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030712",
  },

  content: {
    padding: 20,
    paddingBottom: 50,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
  },

  loadingText: {
    color: "#9ca3af",
    marginTop: 12,
    fontSize: 14,
  },

  errorIcon: {
    fontSize: 35,
    marginBottom: 12,
  },

  errorTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
  },

  errorText: {
    color: "#9ca3af",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },

  backButton: {
    backgroundColor: "#f97316",
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 10,
    marginTop: 20,
  },

  backButtonText: {
    color: "#ffffff",
    fontWeight: "700",
  },

  // ========================================
  // BACK
  // ========================================

  backRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  backArrow: {
    color: "#f97316",
    fontSize: 24,
    marginRight: 8,
  },

  backText: {
    color: "#d1d5db",
    fontSize: 14,
    fontWeight: "600",
  },

  // ========================================
  // PROFILE
  // ========================================

  profileCard: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 20,
  },

  cover: {
    height: 120,
    backgroundColor: "#f97316",
  },

  profileContent: {
    padding: 20,
    paddingTop: 0,
  },

  profileImageWrapper: {
    width: 108,
    height: 108,
    borderRadius: 24,
    backgroundColor: "#111827",
    padding: 6,
    marginTop: -54,
    borderWidth: 1,
    borderColor: "#374151",
  },

  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 19,
    backgroundColor: "#1f2937",
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 16,
  },

  name: {
    color: "#ffffff",
    fontSize: 25,
    fontWeight: "800",
    marginRight: 10,
  },

  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#166534",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 4,
  },

  verifiedIcon: {
    color: "#ffffff",
    fontWeight: "900",
    marginRight: 4,
  },

  verifiedText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
  },

  skill: {
    color: "#fb923c",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 7,
  },

  metaContainer: {
    marginTop: 15,
    gap: 9,
  },

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  metaIcon: {
    fontSize: 15,
    width: 25,
  },

  metaText: {
    color: "#9ca3af",
    fontSize: 13,
  },

  star: {
    color: "#facc15",
    fontSize: 15,
  },

  ratingText: {
    color: "#facc15",
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 5,
  },

  reviewCount: {
    color: "#6b7280",
    fontSize: 12,
    marginLeft: 3,
  },

  experienceBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#1f2937",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 15,
  },

  experienceText: {
    color: "#d1d5db",
    fontSize: 12,
    fontWeight: "600",
  },

  // ========================================
  // ACTIONS
  // ========================================

  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },

  actionButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },

  whatsappButton: {
    backgroundColor: "#16a34a",
  },

  contactButton: {
    backgroundColor: "#f97316",
  },

  disabledButton: {
    opacity: 0.45,
  },

  actionIcon: {
    fontSize: 16,
    marginRight: 7,
  },

  actionText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },

  phoneText: {
    color: "#e5e7eb",
    fontSize: 10,
    marginTop: 2,
  },

  callButton: {
    backgroundColor: "#1f2937",
    borderRadius: 11,
    paddingVertical: 11,
    alignItems: "center",
    marginTop: 10,
  },

  callButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },

  // ========================================
  // TABS
  // ========================================

  tabsContainer: {
    gap: 8,
    marginBottom: 20,
  },

  tab: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 11,
    paddingHorizontal: 17,
    paddingVertical: 11,
  },

  activeTab: {
    backgroundColor: "#f97316",
    borderColor: "#f97316",
  },

  tabText: {
    color: "#9ca3af",
    fontSize: 13,
    fontWeight: "700",
  },

  activeTabText: {
    color: "#ffffff",
  },

  // ========================================
  // SECTIONS
  // ========================================

  sectionCard: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 20,
    padding: 18,
    marginBottom: 15,
  },

  sectionTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 12,
  },

  sectionHeading: {
    color: "#ffffff",
    fontSize: 21,
    fontWeight: "800",
    marginBottom: 15,
  },

  aboutText: {
    color: "#9ca3af",
    fontSize: 14,
    lineHeight: 22,
  },

  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  skillChip: {
    backgroundColor: "#431407",
    borderWidth: 1,
    borderColor: "#7c2d12",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },

  skillChipText: {
    color: "#fb923c",
    fontSize: 12,
    fontWeight: "600",
  },

  // ========================================
  // PORTFOLIO
  // ========================================

  portfolioCard: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 15,
  },

  portfolioImage: {
    width: "100%",
    height: 210,
    backgroundColor: "#1f2937",
  },

  portfolioContent: {
    padding: 15,
  },

  portfolioTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },

  portfolioLocation: {
    color: "#6b7280",
    fontSize: 12,
    marginTop: 6,
  },

  // ========================================
  // JOBS
  // ========================================

  jobCard: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 20,
    padding: 18,
    marginBottom: 15,
  },

  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  jobHeaderText: {
    flex: 1,
    paddingRight: 10,
  },

  jobTitle: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "800",
  },

  jobBudget: {
    color: "#d1d5db",
    fontSize: 13,
    marginTop: 7,
  },

  completedBadge: {
    backgroundColor: "#14532d",
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 9,
  },

  completedText: {
    color: "#86efac",
    fontSize: 10,
    fontWeight: "800",
  },

  postedBy: {
    color: "#6b7280",
    fontSize: 11,
    marginTop: 12,
  },

  jobDescription: {
    color: "#9ca3af",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 12,
  },

  // ========================================
  // REVIEWS
  // ========================================

  reviewCard: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 18,
    padding: 17,
    marginBottom: 12,
  },

  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  reviewerName: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
  },

  reviewRating: {
    flexDirection: "row",
    alignItems: "center",
  },

  reviewRatingText: {
    color: "#facc15",
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 4,
  },

  reviewComment: {
    color: "#9ca3af",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 10,
  },

  // ========================================
  // EMPTY
  // ========================================

  emptyCard: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
  },

  emptyIcon: {
    fontSize: 30,
    marginBottom: 10,
  },

  emptyTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
  },

  emptyText: {
    color: "#6b7280",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 7,
  },
});

export default WorkerDetailsScreen;