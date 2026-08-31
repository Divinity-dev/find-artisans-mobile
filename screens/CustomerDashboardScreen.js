import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const CustomerDashboardScreen = ({ navigation }) => {
  // ============================================================
  // AUTH
  // ============================================================

  const { user, token } = useAuth();

  // ============================================================
  // API
  // ============================================================

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  // ============================================================
  // STATE
  // ============================================================

  const [activeTab, setActiveTab] = useState("jobs");

  const [profile, setProfile] = useState(null);

  const [jobs, setJobs] = useState([]);

  const [myComplaints, setMyComplaints] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [actionLoading, setActionLoading] = useState(false);

  // ============================================================
  // COMPLAINT STATE
  // ============================================================

  const [complaint, setComplaint] = useState({
    title: "",
    description: "",
  });

  const [submittingComplaint, setSubmittingComplaint] =
    useState(false);

  // ============================================================
  // REVIEW STATE
  // ============================================================

  const [reviewModal, setReviewModal] = useState(false);

  const [selectedJob, setSelectedJob] = useState(null);

  const [review, setReview] = useState({
    rating: 5,
    comment: "",
  });

  const [submittingReview, setSubmittingReview] =
    useState(false);

  // ============================================================
  // STATUS MODAL
  // ============================================================

  const [statusModal, setStatusModal] = useState(false);

  const [selectedStatusJob, setSelectedStatusJob] =
    useState(null);

  // ============================================================
  // VERIFICATION MODAL
  // ============================================================

  const [showVerifyModal, setShowVerifyModal] =
    useState(false);

  // ============================================================
  // API HELPER
  // ============================================================

  const apiRequest = useCallback(
    async (endpoint, options = {}) => {
      if (!API_URL) {
        throw new Error(
          "API URL is not configured."
        );
      }

      if (!token) {
        throw new Error(
          "You need to be logged in."
        );
      }

      const response = await fetch(
        `${API_URL}${endpoint}`,
        {
          ...options,
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
            ...(options.headers || {}),
          },
        }
      );

      const data =
        await response
          .json()
          .catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Something went wrong."
        );
      }

      return data;
    },
    [API_URL, token]
  );

  // ============================================================
  // FETCH PROFILE
  // ============================================================

  const fetchProfile = useCallback(
    async () => {
      try {
        const data =
          await apiRequest("/users/me");

        const profileData =
          data?.data ||
          data?.user ||
          data;

        setProfile(profileData);

        return profileData;
      } catch (err) {
        console.error(
          "Failed to fetch profile:",
          err
        );

        setError(
          err?.message ||
            "Failed to load profile."
        );

        return null;
      }
    },
    [apiRequest]
  );

  // ============================================================
  // FETCH JOBS
  // ============================================================

  const fetchJobs = useCallback(
    async () => {
      try {
        const data =
          await apiRequest("/jobs/me");

        const jobsData =
          data?.data || [];

        setJobs(
          Array.isArray(jobsData)
            ? jobsData
            : []
        );

        return jobsData;
      } catch (err) {
        console.error(
          "Failed to fetch jobs:",
          err
        );

        setJobs([]);

        throw err;
      }
    },
    [apiRequest]
  );

  // ============================================================
  // FETCH COMPLAINTS
  // ============================================================

  const fetchMyComplaints =
    useCallback(async () => {
      try {
        const data =
          await apiRequest(
            "/complaints/my"
          );

        const complaints =
          data?.data || [];

        setMyComplaints(
          Array.isArray(complaints)
            ? complaints
            : []
        );
      } catch (err) {
        console.error(
          "Failed to fetch complaints:",
          err
        );

        setMyComplaints([]);
      }
    }, [apiRequest]);

  // ============================================================
  // FETCH EVERYTHING
  // ============================================================

  const fetchDashboard =
    useCallback(
      async (isRefresh = false) => {
        if (!API_URL) {
          setError(
            "API URL is not configured."
          );
          setLoading(false);
          setRefreshing(false);
          return;
        }

        if (!token) {
          setError(
            "You need to be logged in to view your dashboard."
          );
          setLoading(false);
          setRefreshing(false);
          return;
        }

        try {
          if (isRefresh) {
            setRefreshing(true);
          } else {
            setLoading(true);
          }

          setError("");

          await Promise.all([
            fetchProfile(),
            fetchJobs().catch(() => null),
            fetchMyComplaints(),
          ]);
        } catch (err) {
          console.error(
            "Dashboard error:",
            err
          );

          setError(
            err?.message ||
              "Unable to load dashboard."
          );
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      },
      [
        API_URL,
        token,
        fetchProfile,
        fetchJobs,
        fetchMyComplaints,
      ]
    );

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // ============================================================
  // VERIFICATION CHECK
  // ============================================================

  useEffect(() => {
    if (!profile) {
      return;
    }

    const isVerified =
      profile?.verified === true ||
      profile?.verification?.isVerified ===
        true;

    if (!isVerified) {
      setShowVerifyModal(true);
    }
  }, [profile]);

  // ============================================================
  // USER
  // ============================================================

  const customerName =
    profile?.fullName ||
    user?.fullName ||
    user?.name ||
    "Customer";

  const firstName =
    customerName.split(" ")[0] ||
    "Customer";

  // ============================================================
  // TRUST SCORE
  // ============================================================

  const trustScore =
    profile?.stats?.trustScore;

  // ============================================================
  // STATUS
  // ============================================================

  const normalizeStatus = (
    status
  ) => {
    return String(
      status || ""
    ).toLowerCase();
  };

  const formatStatus = (
    status
  ) => {
    if (!status) {
      return "Open";
    }

    return String(status)
      .replace(/-/g, " ")
      .replace(/_/g, " ")
      .replace(
        /\b\w/g,
        (letter) =>
          letter.toUpperCase()
      );
  };

  const getStatusColor = (
    status
  ) => {
    const normalized =
      normalizeStatus(status);

    switch (normalized) {
      case "completed":
        return "#4ade80";

      case "assigned":
        return "#c084fc";

      case "in-progress":
        return "#60a5fa";

      case "cancelled":
      case "canceled":
        return "#f87171";

      default:
        return "#facc15";
    }
  };

  const getStatusBackground = (
    status
  ) => {
    const normalized =
      normalizeStatus(status);

    switch (normalized) {
      case "completed":
        return "#14532d";

      case "assigned":
        return "#3b0764";

      case "in-progress":
        return "#172554";

      case "cancelled":
      case "canceled":
        return "#450a0a";

      default:
        return "#713f12";
    }
  };

  // ============================================================
  // JOB STATS
  // ============================================================

  const totalJobs = jobs.length;

  const openJobs = jobs.filter(
    (job) =>
      normalizeStatus(
        job?.status
      ) === "open"
  ).length;

  const assignedJobs = jobs.filter(
    (job) =>
      normalizeStatus(
        job?.status
      ) === "assigned"
  ).length;

  const activeJobs = jobs.filter(
    (job) =>
      normalizeStatus(
        job?.status
      ) === "in-progress"
  ).length;

  const completedJobs = jobs.filter(
    (job) =>
      normalizeStatus(
        job?.status
      ) === "completed"
  ).length;

  // ============================================================
  // FORMAT BUDGET
  // ============================================================

  const formatBudget = (
    budget
  ) => {
    if (
      budget === null ||
      budget === undefined ||
      budget === ""
    ) {
      return "Budget not specified";
    }

    const number =
      Number(
        String(budget).replace(
          /,/g,
          ""
        )
      );

    if (Number.isNaN(number)) {
      return String(budget);
    }

    return `₦${number.toLocaleString()}`;
  };

  // ============================================================
  // GET JOB TITLE
  // ============================================================

  const getJobTitle = (
    job
  ) => {
    return (
      job?.title ||
      job?.service ||
      job?.jobTitle ||
      "Untitled Job"
    );
  };

  // ============================================================
  // GET ARTISAN
  // ============================================================

  const getArtisan = (
    job
  ) => {
    return (
      job?.assignedWorker ||
      job?.worker ||
      job?.artisan ||
      job?.workerId ||
      job?.artisanId ||
      null
    );
  };

  // ============================================================
  // GET ARTISAN ID
  // ============================================================

  const getArtisanId = (
    job
  ) => {
    const artisan =
      getArtisan(job);

    if (!artisan) {
      return null;
    }

    if (
      typeof artisan ===
      "string"
    ) {
      return artisan;
    }

    return (
      artisan?._id ||
      artisan?.id ||
      artisan?.userId ||
      artisan?.user?._id ||
      artisan?.user?.id ||
      null
    );
  };

  // ============================================================
  // GET ARTISAN NAME
  // ============================================================

  const getWorkerName = (
    job
  ) => {
    const artisan =
      getArtisan(job);

    if (!artisan) {
      return "Not assigned";
    }

    if (
      typeof artisan ===
      "string"
    ) {
      return "Assigned Artisan";
    }

    return (
      artisan?.fullName ||
      artisan?.name ||
      artisan?.user?.fullName ||
      artisan?.user?.name ||
      "Assigned Artisan"
    );
  };

  // ============================================================
  // OPEN JOB DETAILS
  // ============================================================

  const openJob = (
    job
  ) => {
    if (!job?._id) {
      Alert.alert(
        "Error",
        "Invalid job ID."
      );
      return;
    }

    navigation.navigate(
      "JobDetails",
      {
        id: job._id,
        job,
      }
    );
  };

  // ============================================================
  // OPEN WORKER
  // ============================================================

  const openWorker = (
    worker
  ) => {
    const workerId =
      worker?._id ||
      worker?.id ||
      worker?.userId ||
      worker?.user?._id;

    if (!workerId) {
      Alert.alert(
        "Worker unavailable",
        "We couldn't find this worker's profile."
      );
      return;
    }

    navigation.navigate(
      "WorkerDetails",
      {
        id: workerId,
        workerId,
        artisanId: workerId,
      }
    );
  };

  // ============================================================
  // OPEN ASSIGNED ARTISAN
  // ============================================================

  const openArtisan = (
    job
  ) => {
    const artisanId =
      getArtisanId(job);

    if (!artisanId) {
      Alert.alert(
        "Artisan unavailable",
        "This job does not currently have an assigned artisan."
      );
      return;
    }

    navigation.navigate(
      "WorkerDetails",
      {
        id: artisanId,
        workerId: artisanId,
        artisanId,
      }
    );
  };

  // ============================================================
  // NAVIGATION
  // ============================================================

  const goToWorkers = () => {
    navigation.navigate(
      "Workers"
    );
  };

  const goToJobs = () => {
    navigation.navigate(
      "JobsScreen"
    );
  };

  const goToPostJob = () => {
    navigation.navigate(
      "PostJob"
    );
  };

  const goToCustomerEdit = () => {
    setShowVerifyModal(false);

    navigation.navigate(
      "CustomerEdit",
      {
        scrollTo:
          "verification",
      }
    );
  };

  // ============================================================
  // ASSIGN WORKER
  // ============================================================

  const assignWorker = async (
    jobId,
    workerId
  ) => {
    if (!jobId || !workerId) {
      return;
    }

    Alert.alert(
      "Assign Artisan",
      "Are you sure you want to assign this artisan to this job?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Assign",
          onPress: async () => {
            try {
              setActionLoading(true);

              await apiRequest(
                `/jobs/${jobId}/assign`,
                {
                  method: "PATCH",
                  body: JSON.stringify({
                    workerId,
                  }),
                }
              );

              await fetchJobs();

              Alert.alert(
                "Success",
                "Worker assigned successfully."
              );
            } catch (err) {
              Alert.alert(
                "Error",
                err?.message ||
                  "Failed to assign worker."
              );
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  // ============================================================
  // UPDATE JOB STATUS
  // ============================================================

  const updateJobStatus =
    async (
      jobId,
      status
    ) => {
      try {
        setActionLoading(true);

        await apiRequest(
          `/jobs/${jobId}/status`,
          {
            method: "PATCH",
            body: JSON.stringify({
              status,
            }),
          }
        );

        await fetchJobs();

        setStatusModal(false);
        setSelectedStatusJob(null);

        Alert.alert(
          "Success",
          "Job status updated successfully."
        );
      } catch (err) {
        Alert.alert(
          "Error",
          err?.message ||
            "Failed to update job status."
        );
      } finally {
        setActionLoading(false);
      }
    };

  // ============================================================
  // OPEN STATUS MODAL
  // ============================================================

  const openStatusModal = (
    job
  ) => {
    setSelectedStatusJob(job);
    setStatusModal(true);
  };

  // ============================================================
  // SUBMIT COMPLAINT
  // ============================================================

  const submitComplaint =
    async () => {
      const title =
        complaint.title.trim();

      const description =
        complaint.description.trim();

      if (!title || !description) {
        Alert.alert(
          "Missing information",
          "Please fill in both the complaint title and description."
        );

        return;
      }

      try {
        setSubmittingComplaint(true);

        await apiRequest(
          "/complaints",
          {
            method: "POST",
            body: JSON.stringify({
              title,
              description,
            }),
          }
        );

        setComplaint({
          title: "",
          description: "",
        });

        await fetchMyComplaints();

        Alert.alert(
          "Success",
          "Complaint submitted successfully."
        );

        setActiveTab(
          "my-complaints"
        );
      } catch (err) {
        Alert.alert(
          "Error",
          err?.message ||
            "Failed to submit complaint."
        );
      } finally {
        setSubmittingComplaint(false);
      }
    };

  // ============================================================
  // OPEN REVIEW MODAL
  // ============================================================

  const openReviewModal = (
    job
  ) => {
    setSelectedJob(job);

    setReview({
      rating: 5,
      comment: "",
    });

    setReviewModal(true);
  };

  // ============================================================
  // SUBMIT REVIEW
  // ============================================================

  const submitReview =
    async () => {
      if (!selectedJob?._id) {
        Alert.alert(
          "Error",
          "Invalid job."
        );

        return;
      }

      try {
        setSubmittingReview(true);

        await apiRequest(
          "/reviews",
          {
            method: "POST",
            body: JSON.stringify({
              jobId:
                selectedJob._id,
              rating:
                Number(
                  review.rating
                ),
              comment:
                review.comment.trim(),
            }),
          }
        );

        setReviewModal(false);
        setSelectedJob(null);

        setReview({
          rating: 5,
          comment: "",
        });

        await fetchJobs();

        Alert.alert(
          "Success",
          "Review submitted successfully."
        );
      } catch (err) {
        Alert.alert(
          "Error",
          err?.message ||
            "Failed to submit review."
        );
      } finally {
        setSubmittingReview(false);
      }
    };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <StatusBar style="light" />

        <Navbar />

        <View
          style={styles.center}
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

  // ============================================================
  // SCREEN
  // ============================================================

  return (
    <SafeAreaView
      style={styles.container}
    >
      <StatusBar style="light" />

      <Navbar />

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.content
        }
        refreshControl={
          <RefreshControl
            refreshing={
              refreshing
            }
            onRefresh={() =>
              fetchDashboard(true)
            }
            tintColor="#f97316"
          />
        }
      >
        {/* ======================================================
            HEADER
        ======================================================= */}

        <View
          style={
            styles.headerSection
          }
        >
          <View
            style={
              styles.headerText
            }
          >
            <Text
              style={
                styles.dashboardLabel
              }
            >
              CUSTOMER DASHBOARD
            </Text>

            <Text
              style={
                styles.welcomeTitle
              }
            >
              Hi, {firstName} 👋
            </Text>

            <Text
              style={
                styles.welcomeSubtitle
              }
            >
              Manage your artisans,
              jobs and requests.
            </Text>

            {trustScore !==
              undefined &&
              trustScore !== null ? (
              <View
                style={
                  styles.trustScoreRow
                }
              >
                <Ionicons
                  name="star"
                  size={16}
                  color="#facc15"
                />

                <Text
                  style={
                    styles.trustText
                  }
                >
                  Trust Score:
                </Text>

                <Text
                  style={
                    styles.trustScore
                  }
                >
                  {trustScore}
                </Text>
              </View>
            ) : null}
          </View>

          <View
            style={
              styles.profileCircle
            }
          >
            <Text
              style={
                styles.profileInitial
              }
            >
              {customerName
                .charAt(0)
                .toUpperCase()}
            </Text>
          </View>
        </View>

        {/* ======================================================
            HEADER ACTIONS
        ======================================================= */}

        <View
          style={
            styles.headerActions
          }
        >
          <TouchableOpacity
            style={
              styles.editButton
            }
            onPress={
              goToCustomerEdit
            }
          >
            <Ionicons
              name="create-outline"
              size={17}
              color="#ffffff"
            />

            <Text
              style={
                styles.editButtonText
              }
            >
              Edit Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={
              styles.postJobButton
            }
            onPress={
              goToPostJob
            }
          >
            <Ionicons
              name="add-circle-outline"
              size={18}
              color="#ffffff"
            />

            <Text
              style={
                styles.postJobText
              }
            >
              Post Job
            </Text>
          </TouchableOpacity>
        </View>

        {/* ======================================================
            ERROR
        ======================================================= */}

        {error ? (
          <View
            style={
              styles.errorCard
            }
          >
            <Ionicons
              name="warning-outline"
              size={23}
              color="#fb923c"
            />

            <View
              style={
                styles.errorContent
              }
            >
              <Text
                style={
                  styles.errorTitle
                }
              >
                Something went wrong
              </Text>

              <Text
                style={
                  styles.errorText
                }
              >
                {error}
              </Text>
            </View>

            <TouchableOpacity
              style={
                styles.retryButton
              }
              onPress={() =>
                fetchDashboard()
              }
            >
              <Text
                style={
                  styles.retryText
                }
              >
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* ======================================================
            TABS
        ======================================================= */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
          style={
            styles.tabsScroll
          }
          contentContainerStyle={
            styles.tabsContainer
          }
        >
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab ===
                "jobs" &&
                styles.activeTab,
            ]}
            onPress={() =>
              setActiveTab(
                "jobs"
              )
            }
          >
            <Ionicons
              name="briefcase-outline"
              size={16}
              color={
                activeTab ===
                "jobs"
                  ? "#ffffff"
                  : "#9ca3af"
              }
            />

            <Text
              style={[
                styles.tabText,
                activeTab ===
                  "jobs" &&
                  styles.activeTabText,
              ]}
            >
              My Jobs
            </Text>
          </TouchableOpacity>

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
              size={16}
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
              size={16}
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
        </ScrollView>

        {/* ======================================================
            JOB TAB
        ======================================================= */}

        {activeTab === "jobs" && (
          <>
            {/* QUICK ACTIONS */}

            <Text
              style={
                styles.sectionTitle
              }
            >
              Quick Actions
            </Text>

            <View
              style={
                styles.quickActions
              }
            >
              <TouchableOpacity
                style={
                  styles.quickCard
                }
                onPress={
                  goToWorkers
                }
              >
                <View
                  style={
                    styles.quickIconOrange
                  }
                >
                  <Ionicons
                    name="search-outline"
                    size={24}
                    color="#fb923c"
                  />
                </View>

                <Text
                  style={
                    styles.quickTitle
                  }
                >
                  Find an Artisan
                </Text>

                <Text
                  style={
                    styles.quickSubtitle
                  }
                >
                  Browse trusted
                  artisans
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  styles.quickCard
                }
                onPress={
                  goToPostJob
                }
              >
                <View
                  style={
                    styles.quickIconBlue
                  }
                >
                  <Ionicons
                    name="add-outline"
                    size={26}
                    color="#60a5fa"
                  />
                </View>

                <Text
                  style={
                    styles.quickTitle
                  }
                >
                  Post a Job
                </Text>

                <Text
                  style={
                    styles.quickSubtitle
                  }
                >
                  Request a service
                </Text>
              </TouchableOpacity>
            </View>

            {/* JOB OVERVIEW */}

            <Text
              style={
                styles.sectionTitle
              }
            >
              Job Overview
            </Text>

            <View
              style={
                styles.statsGrid
              }
            >
              <StatCard
                icon="layers-outline"
                color="#fb923c"
                number={totalJobs}
                label="Total Jobs"
              />

              <StatCard
                icon="time-outline"
                color="#facc15"
                number={openJobs}
                label="Open"
              />

              <StatCard
                icon="person-outline"
                color="#c084fc"
                number={assignedJobs}
                label="Assigned"
              />

              <StatCard
                icon="construct-outline"
                color="#60a5fa"
                number={activeJobs}
                label="In Progress"
              />

              <StatCard
                icon="checkmark-circle-outline"
                color="#4ade80"
                number={
                  completedJobs
                }
                label="Completed"
              />
            </View>

            {/* JOB LIST */}

            <View
              style={
                styles.sectionHeader
              }
            >
              <Text
                style={
                  styles.sectionTitle
                }
              >
                Your Jobs
              </Text>

              {jobs.length >
              0 ? (
                <TouchableOpacity
                  onPress={
                    goToJobs
                  }
                >
                  <Text
                    style={
                      styles.viewAll
                    }
                  >
                    View All
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>

            {jobs.length ===
            0 ? (
              <View
                style={
                  styles.emptyCard
                }
              >
                <View
                  style={
                    styles.emptyIcon
                  }
                >
                  <Ionicons
                    name="briefcase-outline"
                    size={32}
                    color="#6b7280"
                  />
                </View>

                <Text
                  style={
                    styles.emptyTitle
                  }
                >
                  No jobs found
                </Text>

                <Text
                  style={
                    styles.emptyText
                  }
                >
                  You haven't
                  created any jobs
                  yet. Find an
                  artisan or post a
                  job to get started.
                </Text>

                <TouchableOpacity
                  style={
                    styles.findButton
                  }
                  onPress={
                    goToWorkers
                  }
                >
                  <Ionicons
                    name="search-outline"
                    size={17}
                    color="#ffffff"
                  />

                  <Text
                    style={
                      styles.findButtonText
                    }
                  >
                    Find an Artisan
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              jobs.map(
                (job) => (
                  <JobCard
                    key={
                      job?._id
                    }
                    job={job}
                    actionLoading={
                      actionLoading
                    }
                    getJobTitle={
                      getJobTitle
                    }
                    getWorkerName={
                      getWorkerName
                    }
                    getArtisanId={
                      getArtisanId
                    }
                    formatBudget={
                      formatBudget
                    }
                    formatStatus={
                      formatStatus
                    }
                    getStatusColor={
                      getStatusColor
                    }
                    getStatusBackground={
                      getStatusBackground
                    }
                    openJob={
                      openJob
                    }
                    openArtisan={
                      openArtisan
                    }
                    openWorker={
                      openWorker
                    }
                    assignWorker={
                      assignWorker
                    }
                    openStatusModal={
                      openStatusModal
                    }
                    openReviewModal={
                      openReviewModal
                    }
                  />
                )
              )
            )}
          </>
        )}

        {/* ======================================================
            CREATE COMPLAINT
        ======================================================= */}

        {activeTab ===
          "create-complaint" && (
          <View
            style={
              styles.complaintCard
            }
          >
            <View
              style={
                styles.complaintHeader
              }
            >
              <View
                style={
                  styles.complaintIcon
                }
              >
                <Ionicons
                  name="clipboard-outline"
                  size={24}
                  color="#fb923c"
                />
              </View>

              <View>
                <Text
                  style={
                    styles.complaintTitle
                  }
                >
                  Submit Complaint
                </Text>

                <Text
                  style={
                    styles.complaintSubtitle
                  }
                >
                  Tell us what went wrong.
                </Text>
              </View>
            </View>

            <Text
              style={
                styles.inputLabel
              }
            >
              Complaint Title
            </Text>

            <TextInput
              value={
                complaint.title
              }
              onChangeText={(
                text
              ) =>
                setComplaint({
                  ...complaint,
                  title: text,
                })
              }
              placeholder="Brief title"
              placeholderTextColor="#6b7280"
              style={
                styles.input
              }
            />

            <Text
              style={
                styles.inputLabel
              }
            >
              Description
            </Text>

            <TextInput
              value={
                complaint.description
              }
              onChangeText={(
                text
              ) =>
                setComplaint({
                  ...complaint,
                  description:
                    text,
                })
              }
              placeholder="Describe your complaint..."
              placeholderTextColor="#6b7280"
              multiline
              textAlignVertical="top"
              style={[
                styles.input,
                styles.textArea,
              ]}
            />

            <TouchableOpacity
              style={
                styles.submitButton
              }
              onPress={
                submitComplaint
              }
              disabled={
                submittingComplaint
              }
            >
              {submittingComplaint ? (
                <ActivityIndicator
                  size="small"
                  color="#ffffff"
                />
              ) : (
                <>
                  <Ionicons
                    name="send-outline"
                    size={17}
                    color="#ffffff"
                  />

                  <Text
                    style={
                      styles.submitButtonText
                    }
                  >
                    Submit Complaint
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* ======================================================
            MY COMPLAINTS
        ======================================================= */}

        {activeTab ===
          "my-complaints" && (
          <View>
            <View
              style={
                styles.sectionHeader
              }
            >
              <Text
                style={
                  styles.sectionTitle
                }
              >
                My Complaints
              </Text>

              <TouchableOpacity
                onPress={
                  fetchMyComplaints
                }
              >
                <Ionicons
                  name="refresh-outline"
                  size={20}
                  color="#fb923c"
                />
              </TouchableOpacity>
            </View>

            {myComplaints.length ===
            0 ? (
              <View
                style={
                  styles.emptyCard
                }
              >
                <View
                  style={
                    styles.emptyIcon
                  }
                >
                  <Ionicons
                    name="document-text-outline"
                    size={32}
                    color="#6b7280"
                  />
                </View>

                <Text
                  style={
                    styles.emptyTitle
                  }
                >
                  No complaints yet
                </Text>

                <Text
                  style={
                    styles.emptyText
                  }
                >
                  You haven't
                  submitted any
                  complaints.
                </Text>

                <TouchableOpacity
                  style={
                    styles.findButton
                  }
                  onPress={() =>
                    setActiveTab(
                      "create-complaint"
                    )
                  }
                >
                  <Ionicons
                    name="add-outline"
                    size={18}
                    color="#ffffff"
                  />

                  <Text
                    style={
                      styles.findButtonText
                    }
                  >
                    Submit Complaint
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              myComplaints.map(
                (item) => (
                  <ComplaintCard
                    key={
                      item?._id
                    }
                    item={item}
                  />
                )
              )
            )}
          </View>
        )}

        {/* ======================================================
            BOTTOM CTA
        ======================================================= */}

        <View
          style={
            styles.ctaCard
          }
        >
          <View
            style={
              styles.ctaIcon
            }
          >
            <Ionicons
              name="people-outline"
              size={30}
              color="#fb923c"
            />
          </View>

          <Text
            style={
              styles.ctaTitle
            }
          >
            Need something done?
          </Text>

          <Text
            style={
              styles.ctaText
            }
          >
            Find skilled and trusted
            artisans near you.
          </Text>

          <TouchableOpacity
            style={
              styles.ctaButton
            }
            onPress={
              goToWorkers
            }
          >
            <Text
              style={
                styles.ctaButtonText
              }
            >
              Browse Artisans
            </Text>

            <Ionicons
              name="arrow-forward"
              size={17}
              color="#ffffff"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ========================================================
          REVIEW MODAL
      ========================================================= */}

      <Modal
        visible={
          reviewModal
        }
        transparent
        animationType="slide"
        onRequestClose={() =>
          setReviewModal(false)
        }
      >
        <View
          style={
            styles.modalOverlay
          }
        >
          <View
            style={
              styles.modalCard
            }
          >
            <View
              style={
                styles.modalHeader
              }
            >
              <View>
                <Text
                  style={
                    styles.modalTitle
                  }
                >
                  Review Worker
                </Text>

                <Text
                  style={
                    styles.modalSubtitle
                  }
                >
                  {
                    selectedJob
                      ?.assignedWorker
                      ?.fullName
                  }
                </Text>
              </View>

              <TouchableOpacity
                onPress={() =>
                  setReviewModal(
                    false
                  )
                }
                style={
                  styles.closeButton
                }
              >
                <Ionicons
                  name="close"
                  size={22}
                  color="#ffffff"
                />
              </TouchableOpacity>
            </View>

            <Text
              style={
                styles.inputLabel
              }
            >
              Rating
            </Text>

            <View
              style={
                styles.ratingRow
              }
            >
              {[1, 2, 3, 4, 5].map(
                (star) => (
                  <TouchableOpacity
                    key={
                      star
                    }
                    onPress={() =>
                      setReview(
                        {
                          ...review,
                          rating:
                            star,
                        }
                      )
                    }
                  >
                    <Ionicons
                      name={
                        star <=
                        review.rating
                          ? "star"
                          : "star-outline"
                      }
                      size={34}
                      color="#facc15"
                    />
                  </TouchableOpacity>
                )
              )}
            </View>

            <Text
              style={
                styles.ratingText
              }
            >
              {review.rating} out of 5
            </Text>

            <Text
              style={
                styles.inputLabel
              }
            >
              Comment
            </Text>

            <TextInput
              value={
                review.comment
              }
              onChangeText={(
                text
              ) =>
                setReview({
                  ...review,
                  comment: text,
                })
              }
              placeholder="Tell others about your experience..."
              placeholderTextColor="#6b7280"
              multiline
              textAlignVertical="top"
              style={[
                styles.input,
                styles.reviewTextArea,
              ]}
            />

            <View
              style={
                styles.modalButtons
              }
            >
              <TouchableOpacity
                style={
                  styles.cancelButton
                }
                onPress={() =>
                  setReviewModal(
                    false
                  )
                }
                disabled={
                  submittingReview
                }
              >
                <Text
                  style={
                    styles.cancelButtonText
                  }
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  styles.modalSubmitButton
                }
                onPress={
                  submitReview
                }
                disabled={
                  submittingReview
                }
              >
                {submittingReview ? (
                  <ActivityIndicator
                    size="small"
                    color="#ffffff"
                  />
                ) : (
                  <Text
                    style={
                      styles.modalSubmitText
                    }
                  >
                    Submit Review
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ========================================================
          JOB STATUS MODAL
      ========================================================= */}

      <Modal
        visible={
          statusModal
        }
        transparent
        animationType="fade"
        onRequestClose={() =>
          setStatusModal(false)
        }
      >
        <View
          style={
            styles.modalOverlay
          }
        >
          <View
            style={
              styles.statusModalCard
            }
          >
            <View
              style={
                styles.modalHeader
              }
            >
              <View>
                <Text
                  style={
                    styles.modalTitle
                  }
                >
                  Update Job Status
                </Text>

                <Text
                  style={
                    styles.modalSubtitle
                  }
                  numberOfLines={1}
                >
                  {getJobTitle(
                    selectedStatusJob
                  )}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() =>
                  setStatusModal(
                    false
                  )
                }
                style={
                  styles.closeButton
                }
              >
                <Ionicons
                  name="close"
                  size={22}
                  color="#ffffff"
                />
              </TouchableOpacity>
            </View>

            {[
              "open",
              "assigned",
              "in-progress",
              "completed",
              "cancelled",
            ].map(
              (status) => {
                const selected =
                  normalizeStatus(
                    selectedStatusJob?.status
                  ) === status;

                return (
                  <TouchableOpacity
                    key={
                      status
                    }
                    style={[
                      styles.statusOption,
                      selected &&
                        styles.statusOptionSelected,
                    ]}
                    disabled={
                      actionLoading
                    }
                    onPress={() =>
                      updateJobStatus(
                        selectedStatusJob?._id,
                        status
                      )
                    }
                  >
                    <View
                      style={[
                        styles.statusDot,
                        {
                          backgroundColor:
                            getStatusColor(
                              status
                            ),
                        },
                      ]}
                    />

                    <Text
                      style={
                        styles.statusOptionText
                      }
                    >
                      {formatStatus(
                        status
                      )}
                    </Text>

                    {selected ? (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#fb923c"
                      />
                    ) : null}
                  </TouchableOpacity>
                );
              }
            )}
          </View>
        </View>
      </Modal>

      {/* ========================================================
          VERIFICATION MODAL
      ========================================================= */}

      <Modal
        visible={
          showVerifyModal
        }
        transparent
        animationType="fade"
        onRequestClose={() =>
          setShowVerifyModal(
            false
          )
        }
      >
        <View
          style={
            styles.modalOverlay
          }
        >
          <View
            style={
              styles.verifyModal
            }
          >
            <View
              style={
                styles.verifyIcon
              }
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={35}
                color="#fb923c"
              />
            </View>

            <Text
              style={
                styles.verifyTitle
              }
            >
              Verify Your Account
            </Text>

            <Text
              style={
                styles.verifyText
              }
            >
              Please verify your
              account to build trust
              and unlock the full
              FindArtisans experience.
            </Text>

            <TouchableOpacity
              style={
                styles.verifyButton
              }
              onPress={
                goToCustomerEdit
              }
            >
              <Text
                style={
                  styles.verifyButtonText
                }
              >
                Verify Account
              </Text>

              <Ionicons
                name="arrow-forward"
                size={17}
                color="#ffffff"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={
                styles.laterButton
              }
              onPress={() =>
                setShowVerifyModal(
                  false
                )
              }
            >
              <Text
                style={
                  styles.laterButtonText
                }
              >
                Maybe Later
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// ==================================================================
// STAT CARD
// ==================================================================

const StatCard = ({
  icon,
  color,
  number,
  label,
}) => {
  return (
    <View
      style={
        styles.statCard
      }
    >
      <View
        style={
          styles.statIcon
        }
      >
        <Ionicons
          name={icon}
          size={20}
          color={color}
        />
      </View>

      <Text
        style={
          styles.statNumber
        }
      >
        {number}
      </Text>

      <Text
        style={
          styles.statLabel
        }
      >
        {label}
      </Text>
    </View>
  );
};

// ==================================================================
// JOB CARD
// ==================================================================

const JobCard = ({
  job,
  actionLoading,
  getJobTitle,
  getWorkerName,
  getArtisanId,
  formatBudget,
  formatStatus,
  getStatusColor,
  getStatusBackground,
  openJob,
  openArtisan,
  openWorker,
  assignWorker,
  openStatusModal,
  openReviewModal,
}) => {
  const status =
    job?.status ||
    "open";

  const applicants =
    Array.isArray(
      job?.applicants
    )
      ? job.applicants
      : [];

  const artisanId =
    getArtisanId(job);

  return (
    <View
      style={
        styles.jobCard
      }
    >
      {/* JOB HEADER */}

      <TouchableOpacity
        onPress={() =>
          openJob(job)
        }
        activeOpacity={0.85}
      >
        <View
          style={
            styles.jobHeader
          }
        >
          <View
            style={
              styles.jobIcon
            }
          >
            <Ionicons
              name="briefcase-outline"
              size={21}
              color="#fb923c"
            />
          </View>

          <View
            style={
              styles.jobHeaderMain
            }
          >
            <Text
              style={
                styles.jobTitle
              }
              numberOfLines={2}
            >
              {getJobTitle(
                job
              )}
            </Text>

            <Text
              style={
                styles.jobDate
              }
            >
              {formatBudget(
                job?.budget
              )}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  getStatusBackground(
                    status
                  ),
              },
            ]}
          >
            <Text
              style={[
                styles.statusBadgeText,
                {
                  color:
                    getStatusColor(
                      status
                    ),
                },
              ]}
            >
              {formatStatus(
                status
              )}
            </Text>
          </View>
        </View>

        {/* DESCRIPTION */}

        {job?.description ? (
          <Text
            style={
              styles.jobDescription
            }
            numberOfLines={4}
          >
            {job.description}
          </Text>
        ) : null}

        {/* LOCATION */}

        {job?.location ? (
          <View
            style={
              styles.locationRow
            }
          >
            <Ionicons
              name="location-outline"
              size={17}
              color="#9ca3af"
            />

            <Text
              style={
                styles.locationText
              }
              numberOfLines={1}
            >
              {job.location?.city ||
                "Unknown city"}
              {job.location
                ?.state
                ? `, ${job.location.state}`
                : ""}
            </Text>
          </View>
        ) : null}
      </TouchableOpacity>

      {/* ASSIGNED WORKER */}

      {job?.assignedWorker ? (
        <TouchableOpacity
          style={
            styles.assignedWorker
          }
          onPress={() =>
            openArtisan(job)
          }
        >
          <View
            style={
              styles.workerAvatar
            }
          >
            <Text
              style={
                styles.workerAvatarText
              }
            >
              {(
                job
                  ?.assignedWorker
                  ?.fullName ||
                "A"
              )
                .charAt(0)
                .toUpperCase()}
            </Text>
          </View>

          <View
            style={
              styles.assignedWorkerInfo
            }
          >
            <Text
              style={
                styles.assignedLabel
              }
            >
              ASSIGNED ARTISAN
            </Text>

            <Text
              style={
                styles.assignedName
              }
            >
              {
                job
                  ?.assignedWorker
                  ?.fullName
              }
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={19}
            color="#6b7280"
          />
        </TouchableOpacity>
      ) : null}

      {/* STATUS BUTTON */}

      <TouchableOpacity
        style={
          styles.statusUpdateButton
        }
        onPress={() =>
          openStatusModal(
            job
          )
        }
        disabled={
          actionLoading
        }
      >
        <Ionicons
          name="swap-vertical-outline"
          size={17}
          color="#d1d5db"
        />

        <Text
          style={
            styles.statusUpdateText
          }
        >
          Update Status
        </Text>

        <Ionicons
          name="chevron-down"
          size={16}
          color="#6b7280"
        />
      </TouchableOpacity>

      {/* APPLICANTS */}

      <View
        style={
          styles.applicantsSection
        }
      >
        <View
          style={
            styles.applicantsHeader
          }
        >
          <Text
            style={
              styles.applicantsTitle
            }
          >
            Applicants
          </Text>

          <View
            style={
              styles.applicantCount
            }
          >
            <Text
              style={
                styles.applicantCountText
              }
            >
              {applicants.length}
            </Text>
          </View>
        </View>

        {applicants.length ===
        0 ? (
          <Text
            style={
              styles.noApplicants
            }
          >
            No applicants yet.
          </Text>
        ) : (
          applicants.map(
            (app) => {
              const worker =
                app?.worker;

              if (!worker) {
                return null;
              }

              const workerId =
                worker?._id ||
                worker?.id;

              const verified =
                worker
                  ?.verification
                  ?.isVerified ===
                true;

              return (
                <View
                  key={
                    app?._id ||
                    workerId
                  }
                  style={
                    styles.applicantCard
                  }
                >
                  <TouchableOpacity
                    style={
                      styles.applicantInfo
                    }
                    onPress={() =>
                      openWorker(
                        worker
                      )
                    }
                  >
                    <View
                      style={
                        styles.applicantAvatar
                      }
                    >
                      <Text
                        style={
                          styles.applicantAvatarText
                        }
                      >
                        {(
                          worker?.fullName ||
                          "A"
                        )
                          .charAt(
                            0
                          )
                          .toUpperCase()}
                      </Text>
                    </View>

                    <View
                      style={
                        styles.applicantDetails
                      }
                    >
                      <View
                        style={
                          styles.nameRow
                        }
                      >
                        <Text
                          style={
                            styles.applicantName
                          }
                          numberOfLines={
                            1
                          }
                        >
                          {
                            worker.fullName
                          }
                        </Text>

                        {verified ? (
                          <Ionicons
                            name="checkmark-circle"
                            size={16}
                            color="#4ade80"
                          />
                        ) : null}
                      </View>

                      <Text
                        style={
                          styles.applicantSkill
                        }
                        numberOfLines={
                          1
                        }
                      >
                        {worker.skill ||
                          "Artisan"}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <View
                    style={
                      styles.applicantActions
                    }
                  >
                    <TouchableOpacity
                      style={
                        styles.viewApplicantButton
                      }
                      onPress={() =>
                        openWorker(
                          worker
                        )
                      }
                    >
                      <Text
                        style={
                          styles.viewApplicantText
                        }
                      >
                        View
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.assignButton,
                        job?.assignedWorker &&
                          styles.disabledButton,
                      ]}
                      disabled={
                        !!job?.assignedWorker ||
                        actionLoading
                      }
                      onPress={() =>
                        assignWorker(
                          job?._id,
                          workerId
                        )
                      }
                    >
                      {actionLoading ? (
                        <ActivityIndicator
                          size="small"
                          color="#ffffff"
                        />
                      ) : (
                        <Text
                          style={
                            styles.assignButtonText
                          }
                        >
                          {job?.assignedWorker
                            ? "Assigned"
                            : "Assign"}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }
          )
        )}
      </View>

      {/* REVIEW */}

      {normalizeJobStatus(
        job?.status
      ) === "completed" &&
      job?.assignedWorker &&
      !job?.review ? (
        <TouchableOpacity
          style={
            styles.reviewButton
          }
          onPress={() =>
            openReviewModal(
              job
            )
          }
        >
          <Ionicons
            name="star"
            size={18}
            color="#111827"
          />

          <Text
            style={
              styles.reviewButtonText
            }
          >
            Give Review
          </Text>
        </TouchableOpacity>
      ) : null}

      {/* VIEW ARTISAN */}

      {artisanId ? (
        <TouchableOpacity
          style={
            styles.viewArtisanButton
          }
          onPress={() =>
            openArtisan(job)
          }
        >
          <Ionicons
            name="person-outline"
            size={17}
            color="#ffffff"
          />

          <Text
            style={
              styles.viewArtisanText
            }
          >
            View Assigned Artisan
          </Text>

          <Ionicons
            name="arrow-forward"
            size={16}
            color="#ffffff"
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

// ==================================================================
// COMPLAINT CARD
// ==================================================================

const ComplaintCard = ({
  item,
}) => {
  const status =
    String(
      item?.status ||
        "pending"
    ).toLowerCase();

  let statusColor =
    "#facc15";

  let statusBackground =
    "#713f12";

  if (
    status ===
    "resolved"
  ) {
    statusColor =
      "#4ade80";
    statusBackground =
      "#14532d";
  }

  if (
    status ===
    "rejected"
  ) {
    statusColor =
      "#f87171";
    statusBackground =
      "#450a0a";
  }

  if (
    status ===
    "reviewed"
  ) {
    statusColor =
      "#60a5fa";
    statusBackground =
      "#172554";
  }

  return (
    <View
      style={
        styles.complaintItem
      }
    >
      <View
        style={
          styles.complaintItemHeader
        }
      >
        <View
          style={
            styles.complaintItemIcon
          }
        >
          <Ionicons
            name="document-text-outline"
            size={19}
            color="#fb923c"
          />
        </View>

        <View
          style={
            styles.complaintItemTitleContainer
          }
        >
          <Text
            style={
              styles.complaintItemTitle
            }
            numberOfLines={2}
          >
            {item?.title ||
              "Complaint"}
          </Text>
        </View>

        <View
          style={[
            styles.complaintStatus,
            {
              backgroundColor:
                statusBackground,
            },
          ]}
        >
          <Text
            style={[
              styles.complaintStatusText,
              {
                color:
                  statusColor,
              },
            ]}
          >
            {formatComplaintStatus(
              status
            )}
          </Text>
        </View>
      </View>

      <Text
        style={
          styles.complaintDescription
        }
      >
        {item?.description ||
          "No description provided."}
      </Text>
    </View>
  );
};

// ==================================================================
// HELPERS
// ==================================================================

const normalizeJobStatus = (
  status
) => {
  return String(
    status || ""
  ).toLowerCase();
};

const formatComplaintStatus = (
  status
) => {
  return String(
    status || "pending"
  )
    .replace(/-/g, " ")
    .replace(/_/g, " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    );
};

// ==================================================================
// STYLES
// ==================================================================

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        "#030712",
    },

    content: {
      padding: 20,
      paddingBottom: 60,
    },

    center: {
      flex: 1,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    loadingText: {
      color: "#9ca3af",
      marginTop: 12,
      fontSize: 14,
    },

    // ==========================================================
    // HEADER
    // ==========================================================

    headerSection: {
      flexDirection:
        "row",
      justifyContent:
        "space-between",
      alignItems:
        "center",
      marginBottom: 18,
    },

    headerText: {
      flex: 1,
      paddingRight: 15,
    },

    dashboardLabel: {
      color: "#fb923c",
      fontSize: 10,
      fontWeight: "900",
      letterSpacing: 1.3,
      marginBottom: 5,
    },

    welcomeTitle: {
      color: "#ffffff",
      fontSize: 27,
      fontWeight: "900",
    },

    welcomeSubtitle: {
      color: "#9ca3af",
      fontSize: 13,
      lineHeight: 19,
      marginTop: 5,
    },

    profileCircle: {
      width: 55,
      height: 55,
      borderRadius: 28,
      backgroundColor:
        "#f97316",
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    profileInitial: {
      color: "#ffffff",
      fontSize: 21,
      fontWeight: "900",
    },

    trustScoreRow: {
      flexDirection:
        "row",
      alignItems:
        "center",
      marginTop: 9,
      gap: 5,
    },

    trustText: {
      color: "#d1d5db",
      fontSize: 12,
    },

    trustScore: {
      color: "#fb923c",
      fontSize: 13,
      fontWeight: "900",
    },

    // ==========================================================
    // HEADER ACTIONS
    // ==========================================================

    headerActions: {
      flexDirection:
        "row",
      gap: 10,
      marginBottom: 22,
    },

    editButton: {
      flex: 1,
      backgroundColor:
        "#111827",
      borderWidth: 1,
      borderColor:
        "#1f2937",
      borderRadius: 12,
      paddingVertical: 12,
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "center",
      gap: 7,
    },

    editButtonText: {
      color: "#ffffff",
      fontSize: 12,
      fontWeight: "700",
    },

    postJobButton: {
      flex: 1,
      backgroundColor:
        "#f97316",
      borderRadius: 12,
      paddingVertical: 12,
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "center",
      gap: 7,
    },

    postJobText: {
      color: "#ffffff",
      fontSize: 12,
      fontWeight: "800",
    },

    // ==========================================================
    // ERROR
    // ==========================================================

    errorCard: {
      backgroundColor:
        "#1c1917",
      borderWidth: 1,
      borderColor:
        "#7c2d12",
      borderRadius: 16,
      padding: 14,
      flexDirection:
        "row",
      alignItems:
        "center",
      marginBottom: 20,
    },

    errorContent: {
      flex: 1,
      marginLeft: 10,
      marginRight: 8,
    },

    errorTitle: {
      color: "#ffffff",
      fontSize: 13,
      fontWeight: "800",
    },

    errorText: {
      color: "#9ca3af",
      fontSize: 11,
      lineHeight: 16,
      marginTop: 3,
    },

    retryButton: {
      backgroundColor:
        "#f97316",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
    },

    retryText: {
      color: "#ffffff",
      fontSize: 11,
      fontWeight: "800",
    },

    // ==========================================================
    // TABS
    // ==========================================================

    tabsScroll: {
      marginBottom: 22,
    },

    tabsContainer: {
      gap: 9,
    },

    tab: {
      backgroundColor:
        "#111827",
      borderWidth: 1,
      borderColor:
        "#1f2937",
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 10,
      flexDirection:
        "row",
      alignItems:
        "center",
      gap: 6,
    },

    activeTab: {
      backgroundColor:
        "#f97316",
      borderColor:
        "#f97316",
    },

    tabText: {
      color: "#9ca3af",
      fontSize: 12,
      fontWeight: "700",
    },

    activeTabText: {
      color: "#ffffff",
    },

    // ==========================================================
    // SECTIONS
    // ==========================================================

    sectionTitle: {
      color: "#ffffff",
      fontSize: 19,
      fontWeight: "900",
      marginBottom: 13,
      marginTop: 3,
    },

    sectionHeader: {
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "space-between",
      marginTop: 4,
    },

    viewAll: {
      color: "#fb923c",
      fontSize: 12,
      fontWeight: "800",
      marginBottom: 13,
    },

    // ==========================================================
    // QUICK ACTIONS
    // ==========================================================

    quickActions: {
      flexDirection:
        "row",
      gap: 11,
      marginBottom: 24,
    },

    quickCard: {
      flex: 1,
      backgroundColor:
        "#111827",
      borderWidth: 1,
      borderColor:
        "#1f2937",
      borderRadius: 18,
      padding: 15,
    },

    quickIconOrange: {
      width: 46,
      height: 46,
      borderRadius: 13,
      backgroundColor:
        "#431407",
      alignItems:
        "center",
      justifyContent:
        "center",
      marginBottom: 12,
    },

    quickIconBlue: {
      width: 46,
      height: 46,
      borderRadius: 13,
      backgroundColor:
        "#172554",
      alignItems:
        "center",
      justifyContent:
        "center",
      marginBottom: 12,
    },

    quickTitle: {
      color: "#ffffff",
      fontSize: 13,
      fontWeight: "800",
    },

    quickSubtitle: {
      color: "#6b7280",
      fontSize: 11,
      lineHeight: 16,
      marginTop: 4,
    },

    // ==========================================================
    // STATS
    // ==========================================================

    statsGrid: {
      flexDirection:
        "row",
      flexWrap:
        "wrap",
      gap: 10,
      marginBottom: 25,
    },

    statCard: {
      width: "31.5%",
      minWidth: 95,
      flexGrow: 1,
      backgroundColor:
        "#111827",
      borderWidth: 1,
      borderColor:
        "#1f2937",
      borderRadius: 16,
      padding: 13,
    },

    statIcon: {
      width: 35,
      height: 35,
      borderRadius: 10,
      backgroundColor:
        "#1f2937",
      alignItems:
        "center",
      justifyContent:
        "center",
      marginBottom: 9,
    },

    statNumber: {
      color: "#ffffff",
      fontSize: 21,
      fontWeight: "900",
    },

    statLabel: {
      color: "#6b7280",
      fontSize: 10,
      marginTop: 3,
    },

    // ==========================================================
    // JOB CARD
    // ==========================================================

    jobCard: {
      backgroundColor:
        "#111827",
      borderWidth: 1,
      borderColor:
        "#1f2937",
      borderRadius: 20,
      padding: 16,
      marginBottom: 13,
    },

    jobHeader: {
      flexDirection:
        "row",
      alignItems:
        "flex-start",
    },

    jobIcon: {
      width: 43,
      height: 43,
      borderRadius: 12,
      backgroundColor:
        "#431407",
      alignItems:
        "center",
      justifyContent:
        "center",
      marginRight: 11,
    },

    jobHeaderMain: {
      flex: 1,
      paddingRight: 8,
    },

    jobTitle: {
      color: "#ffffff",
      fontSize: 15,
      lineHeight: 20,
      fontWeight: "900",
    },

    jobDate: {
      color: "#fb923c",
      fontSize: 11,
      fontWeight: "700",
      marginTop: 4,
    },

    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 6,
      borderRadius: 8,
      maxWidth: 85,
    },

    statusBadgeText: {
      fontSize: 9,
      fontWeight: "900",
      textAlign: "center",
    },

    jobDescription: {
      color: "#9ca3af",
      fontSize: 12,
      lineHeight: 18,
      marginTop: 13,
    },

    locationRow: {
      flexDirection:
        "row",
      alignItems:
        "center",
      marginTop: 11,
      gap: 6,
    },

    locationText: {
      color: "#9ca3af",
      fontSize: 11,
      flex: 1,
    },

    assignedWorker: {
      marginTop: 14,
      backgroundColor:
        "#052e16",
      borderWidth: 1,
      borderColor:
        "#166534",
      borderRadius: 13,
      padding: 11,
      flexDirection:
        "row",
      alignItems:
        "center",
    },

    workerAvatar: {
      width: 39,
      height: 39,
      borderRadius: 20,
      backgroundColor:
        "#f97316",
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    workerAvatarText: {
      color: "#ffffff",
      fontSize: 15,
      fontWeight: "900",
    },

    assignedWorkerInfo: {
      flex: 1,
      marginLeft: 10,
    },

    assignedLabel: {
      color: "#4ade80",
      fontSize: 8,
      fontWeight: "900",
      letterSpacing: 0.7,
    },

    assignedName: {
      color: "#ffffff",
      fontSize: 13,
      fontWeight: "800",
      marginTop: 2,
    },

    statusUpdateButton: {
      marginTop: 12,
      borderWidth: 1,
      borderColor:
        "#374151",
      backgroundColor:
        "#1f2937",
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 11,
      flexDirection:
        "row",
      alignItems:
        "center",
      gap: 7,
    },

    statusUpdateText: {
      flex: 1,
      color: "#d1d5db",
      fontSize: 11,
      fontWeight: "700",
    },

    // ==========================================================
    // APPLICANTS
    // ==========================================================

    applicantsSection: {
      marginTop: 16,
      paddingTop: 15,
      borderTopWidth: 1,
      borderTopColor:
        "#1f2937",
    },

    applicantsHeader: {
      flexDirection:
        "row",
      alignItems:
        "center",
      marginBottom: 10,
    },

    applicantsTitle: {
      color: "#d1d5db",
      fontSize: 12,
      fontWeight: "800",
    },

    applicantCount: {
      minWidth: 23,
      height: 23,
      borderRadius: 12,
      backgroundColor:
        "#1f2937",
      alignItems:
        "center",
      justifyContent:
        "center",
      marginLeft: 7,
    },

    applicantCountText: {
      color: "#ffffff",
      fontSize: 10,
      fontWeight: "900",
    },

    noApplicants: {
      color: "#6b7280",
      fontSize: 11,
      paddingVertical: 5,
    },

    applicantCard: {
      backgroundColor:
        "#0f172a",
      borderWidth: 1,
      borderColor:
        "#1f2937",
      borderRadius: 13,
      padding: 10,
      marginBottom: 8,
    },

    applicantInfo: {
      flexDirection:
        "row",
      alignItems:
        "center",
    },

    applicantAvatar: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor:
        "#374151",
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    applicantAvatarText: {
      color: "#ffffff",
      fontSize: 14,
      fontWeight: "900",
    },

    applicantDetails: {
      flex: 1,
      marginLeft: 9,
    },

    nameRow: {
      flexDirection:
        "row",
      alignItems:
        "center",
      gap: 5,
    },

    applicantName: {
      color: "#ffffff",
      fontSize: 12,
      fontWeight: "800",
      maxWidth: "85%",
    },

    applicantSkill: {
      color: "#6b7280",
      fontSize: 10,
      marginTop: 3,
    },

    applicantActions: {
      flexDirection:
        "row",
      gap: 8,
      marginTop: 9,
    },

    viewApplicantButton: {
      flex: 1,
      backgroundColor:
        "#374151",
      borderRadius: 9,
      paddingVertical: 9,
      alignItems:
        "center",
    },

    viewApplicantText: {
      color: "#ffffff",
      fontSize: 11,
      fontWeight: "800",
    },

    assignButton: {
      flex: 1,
      backgroundColor:
        "#f97316",
      borderRadius: 9,
      paddingVertical: 9,
      alignItems:
        "center",
    },

    assignButtonText: {
      color: "#ffffff",
      fontSize: 11,
      fontWeight: "900",
    },

    disabledButton: {
      opacity: 0.45,
    },

    // ==========================================================
    // REVIEW
    // ==========================================================

    reviewButton: {
      marginTop: 13,
      backgroundColor:
        "#facc15",
      borderRadius: 11,
      paddingVertical: 11,
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "center",
      gap: 7,
    },

    reviewButtonText: {
      color: "#111827",
      fontSize: 12,
      fontWeight: "900",
    },

    // ==========================================================
    // ARTISAN
    // ==========================================================

    viewArtisanButton: {
      marginTop: 9,
      backgroundColor:
        "#f97316",
      borderRadius: 11,
      paddingVertical: 11,
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "center",
      gap: 7,
    },

    viewArtisanText: {
      color: "#ffffff",
      fontSize: 11,
      fontWeight: "800",
    },

    // ==========================================================
    // EMPTY
    // ==========================================================

    emptyCard: {
      backgroundColor:
        "#111827",
      borderWidth: 1,
      borderColor:
        "#1f2937",
      borderRadius: 20,
      padding: 28,
      alignItems:
        "center",
      marginBottom: 25,
    },

    emptyIcon: {
      width: 62,
      height: 62,
      borderRadius: 31,
      backgroundColor:
        "#1f2937",
      alignItems:
        "center",
      justifyContent:
        "center",
      marginBottom: 13,
    },

    emptyTitle: {
      color: "#ffffff",
      fontSize: 17,
      fontWeight: "900",
    },

    emptyText: {
      color: "#6b7280",
      fontSize: 12,
      lineHeight: 19,
      textAlign:
        "center",
      marginTop: 7,
      maxWidth: 300,
    },

    findButton: {
      flexDirection:
        "row",
      alignItems:
        "center",
      backgroundColor:
        "#f97316",
      paddingHorizontal: 17,
      paddingVertical: 11,
      borderRadius: 10,
      marginTop: 16,
      gap: 7,
    },

    findButtonText: {
      color: "#ffffff",
      fontSize: 12,
      fontWeight: "800",
    },

    // ==========================================================
    // COMPLAINT
    // ==========================================================

    complaintCard: {
      backgroundColor:
        "#111827",
      borderWidth: 1,
      borderColor:
        "#1f2937",
      borderRadius: 20,
      padding: 18,
    },

    complaintHeader: {
      flexDirection:
        "row",
      alignItems:
        "center",
      marginBottom: 22,
    },

    complaintIcon: {
      width: 48,
      height: 48,
      borderRadius: 14,
      backgroundColor:
        "#431407",
      alignItems:
        "center",
      justifyContent:
        "center",
      marginRight: 11,
    },

    complaintTitle: {
      color: "#ffffff",
      fontSize: 17,
      fontWeight: "900",
    },

    complaintSubtitle: {
      color: "#6b7280",
      fontSize: 11,
      marginTop: 3,
    },

    inputLabel: {
      color: "#d1d5db",
      fontSize: 11,
      fontWeight: "700",
      marginBottom: 7,
      marginTop: 10,
    },

    input: {
      backgroundColor:
        "#1f2937",
      borderWidth: 1,
      borderColor:
        "#374151",
      borderRadius: 11,
      color: "#ffffff",
      fontSize: 13,
      paddingHorizontal: 13,
      paddingVertical: 12,
    },

    textArea: {
      height: 145,
      paddingTop: 12,
    },

    submitButton: {
      marginTop: 18,
      backgroundColor:
        "#f97316",
      borderRadius: 11,
      paddingVertical: 13,
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "center",
      gap: 7,
    },

    submitButtonText: {
      color: "#ffffff",
      fontSize: 12,
      fontWeight: "900",
    },

    // ==========================================================
    // COMPLAINT LIST
    // ==========================================================

    complaintItem: {
      backgroundColor:
        "#111827",
      borderWidth: 1,
      borderColor:
        "#1f2937",
      borderRadius: 17,
      padding: 15,
      marginBottom: 11,
    },

    complaintItemHeader: {
      flexDirection:
        "row",
      alignItems:
        "center",
    },

    complaintItemIcon: {
      width: 39,
      height: 39,
      borderRadius: 11,
      backgroundColor:
        "#431407",
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    complaintItemTitleContainer: {
      flex: 1,
      marginLeft: 9,
      paddingRight: 7,
    },

    complaintItemTitle: {
      color: "#ffffff",
      fontSize: 13,
      fontWeight: "800",
    },

    complaintStatus: {
      paddingHorizontal: 8,
      paddingVertical: 6,
      borderRadius: 8,
    },

    complaintStatusText: {
      fontSize: 9,
      fontWeight: "900",
    },

    complaintDescription: {
      color: "#9ca3af",
      fontSize: 12,
      lineHeight: 18,
      marginTop: 12,
    },

    // ==========================================================
    // CTA
    // ==========================================================

    ctaCard: {
      backgroundColor:
        "#111827",
      borderWidth: 1,
      borderColor:
        "#7c2d12",
      borderRadius: 22,
      padding: 22,
      alignItems:
        "center",
      marginTop: 12,
    },

    ctaIcon: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor:
        "#431407",
      alignItems:
        "center",
      justifyContent:
        "center",
      marginBottom: 13,
    },

    ctaTitle: {
      color: "#ffffff",
      fontSize: 19,
      fontWeight: "900",
    },

    ctaText: {
      color: "#9ca3af",
      fontSize: 12,
      textAlign:
        "center",
      lineHeight: 19,
      marginTop: 6,
    },

    ctaButton: {
      flexDirection:
        "row",
      alignItems:
        "center",
      gap: 8,
      backgroundColor:
        "#f97316",
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: 11,
      marginTop: 16,
    },

    ctaButtonText: {
      color: "#ffffff",
      fontSize: 12,
      fontWeight: "800",
    },

    // ==========================================================
    // MODALS
    // ==========================================================

    modalOverlay: {
      flex: 1,
      backgroundColor:
        "rgba(0,0,0,0.78)",
      alignItems:
        "center",
      justifyContent:
        "center",
      padding: 20,
    },

    modalCard: {
      width: "100%",
      maxWidth: 450,
      backgroundColor:
        "#111827",
      borderWidth: 1,
      borderColor:
        "#374151",
      borderRadius: 23,
      padding: 20,
    },

    statusModalCard: {
      width: "100%",
      maxWidth: 430,
      backgroundColor:
        "#111827",
      borderWidth: 1,
      borderColor:
        "#374151",
      borderRadius: 23,
      padding: 20,
    },

    modalHeader: {
      flexDirection:
        "row",
      justifyContent:
        "space-between",
      alignItems:
        "flex-start",
      marginBottom: 16,
    },

    modalTitle: {
      color: "#ffffff",
      fontSize: 19,
      fontWeight: "900",
    },

    modalSubtitle: {
      color: "#9ca3af",
      fontSize: 12,
      marginTop: 4,
    },

    closeButton: {
      width: 35,
      height: 35,
      borderRadius: 18,
      backgroundColor:
        "#1f2937",
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    ratingRow: {
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "center",
      gap: 9,
      marginVertical: 10,
    },

    ratingText: {
      color: "#facc15",
      textAlign:
        "center",
      fontSize: 12,
      fontWeight: "800",
      marginBottom: 8,
    },

    reviewTextArea: {
      height: 110,
      paddingTop: 12,
    },

    modalButtons: {
      flexDirection:
        "row",
      gap: 10,
      marginTop: 17,
    },

    cancelButton: {
      flex: 1,
      backgroundColor:
        "#374151",
      borderRadius: 11,
      paddingVertical: 13,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    cancelButtonText: {
      color: "#ffffff",
      fontSize: 12,
      fontWeight: "800",
    },

    modalSubmitButton: {
      flex: 1,
      backgroundColor:
        "#f97316",
      borderRadius: 11,
      paddingVertical: 13,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    modalSubmitText: {
      color: "#ffffff",
      fontSize: 12,
      fontWeight: "900",
    },

    // ==========================================================
    // STATUS MODAL
    // ==========================================================

    statusOption: {
      flexDirection:
        "row",
      alignItems:
        "center",
      backgroundColor:
        "#1f2937",
      borderWidth: 1,
      borderColor:
        "#374151",
      borderRadius: 12,
      padding: 13,
      marginBottom: 9,
    },

    statusOptionSelected: {
      borderColor:
        "#f97316",
      backgroundColor:
        "#27150b",
    },

    statusDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginRight: 10,
    },

    statusOptionText: {
      color: "#ffffff",
      flex: 1,
      fontSize: 13,
      fontWeight: "700",
    },

    // ==========================================================
    // VERIFICATION MODAL
    // ==========================================================

    verifyModal: {
      width: "100%",
      maxWidth: 400,
      backgroundColor:
        "#111827",
      borderWidth: 1,
      borderColor:
        "#374151",
      borderRadius: 25,
      padding: 25,
      alignItems:
        "center",
    },

    verifyIcon: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor:
        "#431407",
      alignItems:
        "center",
      justifyContent:
        "center",
      marginBottom: 15,
    },

    verifyTitle: {
      color: "#ffffff",
      fontSize: 21,
      fontWeight: "900",
      textAlign:
        "center",
    },

    verifyText: {
      color: "#9ca3af",
      fontSize: 13,
      lineHeight: 20,
      textAlign:
        "center",
      marginTop: 9,
    },

    verifyButton: {
      width: "100%",
      backgroundColor:
        "#f97316",
      borderRadius: 12,
      paddingVertical: 13,
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "center",
      gap: 7,
      marginTop: 20,
    },

    verifyButtonText: {
      color: "#ffffff",
      fontSize: 13,
      fontWeight: "900",
    },

    laterButton: {
      marginTop: 13,
      paddingVertical: 8,
    },

    laterButtonText: {
      color: "#6b7280",
      fontSize: 12,
      fontWeight: "700",
    },
  });

export default CustomerDashboardScreen;

