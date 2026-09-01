import React, { useEffect, useState } from "react";

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

const CustomerJobsScreen = ({ navigation }) => {
  const { token } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/jobs/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to load your jobs."
          );
        }

        setJobs(Array.isArray(data?.data) ? data.data : []);
      } catch (err) {
        console.error("Failed to fetch customer jobs:", err);
        setError(
          err?.message || "Unable to load your jobs right now."
        );
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchJobs();
    } else {
      setLoading(false);
      setError("Please log in to view your jobs.");
    }
  }, [token]);

  const formatBudget = (value) => {
    if (value == null || value === "") {
      return "Budget not specified";
    }

    return `₦${Number(value).toLocaleString()}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Navbar />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={20} color="#f97316" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>My Created Jobs</Text>
      </View>

      {loading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color="#f97316" />
          <Text style={styles.loadingText}>Loading your jobs...</Text>
        </View>
      ) : error ? (
        <View style={styles.emptyState}>
          <Ionicons name="alert-circle-outline" size={42} color="#f87171" />
          <Text style={styles.emptyTitle}>Something went wrong</Text>
          <Text style={styles.emptyText}>{error}</Text>
        </View>
      ) : jobs.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="briefcase-outline" size={42} color="#6b7280" />
          <Text style={styles.emptyTitle}>No jobs created yet</Text>
          <Text style={styles.emptyText}>
            Your created jobs will appear here once you post one.
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {jobs.map((job) => (
            <TouchableOpacity
              key={job?._id || job?.id}
              activeOpacity={0.9}
              style={styles.jobCard}
              onPress={() => navigation.navigate("JobDetails", { jobId: job?._id || job?.id })}
            >
              <View style={styles.jobHeader}>
                <View style={styles.jobIcon}>
                  <Ionicons name="briefcase-outline" size={20} color="#fb923c" />
                </View>

                <View style={styles.jobHeaderMain}>
                  <Text style={styles.jobTitle} numberOfLines={2}>
                    {job?.title || "Untitled job"}
                  </Text>

                  <Text style={styles.jobMeta}>
                    {job?.category || "General service"}
                  </Text>
                </View>
              </View>

              <Text style={styles.jobDescription} numberOfLines={3}>
                {job?.description || "No description provided."}
              </Text>

              <View style={styles.infoRow}>
                <Ionicons name="cash-outline" size={16} color="#9ca3af" />
                <Text style={styles.infoText}>{formatBudget(job?.budget)}</Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={16} color="#9ca3af" />
                <Text style={styles.infoText} numberOfLines={1}>
                  {job?.location?.city || "Location not specified"}
                  {job?.location?.state ? `, ${job.location.state}` : ""}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={16} color="#9ca3af" />
                <Text style={styles.infoText}>
                  {job?.createdAt
                    ? new Date(job.createdAt).toLocaleDateString()
                    : "Date not available"}
                </Text>
              </View>

              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>
                  {job?.status || "open"}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030712",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  backText: {
    color: "#f97316",
    fontSize: 15,
    fontWeight: "600",
  },
  title: {
    flex: 1,
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "700",
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 30,
    gap: 14,
  },
  loadingState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    color: "#d1d5db",
    fontSize: 15,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  emptyTitle: {
    marginTop: 16,
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
  },
  emptyText: {
    marginTop: 10,
    color: "#9ca3af",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  jobCard: {
    backgroundColor: "#111827",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  jobHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  jobIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(251, 146, 60, 0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  jobHeaderMain: {
    flex: 1,
  },
  jobTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  jobMeta: {
    color: "#fbbf24",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
    textTransform: "capitalize",
  },
  jobDescription: {
    color: "#d1d5db",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
  },
  infoText: {
    color: "#e5e7eb",
    fontSize: 13,
    flexShrink: 1,
  },
  statusBadge: {
    alignSelf: "flex-start",
    marginTop: 14,
    backgroundColor: "rgba(59, 130, 246, 0.12)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusText: {
    color: "#93c5fd",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "capitalize",
  },
});

export default CustomerJobsScreen;
