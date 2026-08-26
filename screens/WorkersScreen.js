import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";

import ArtisanCard from "../components/ArtisanCard";

const WorkersScreen = ({ route }) => {
  const [artisans, setArtisans] = useState([]);

  const [loading, setLoading] = useState(true);

  const [loadingMore, setLoadingMore] = useState(false);

  const [error, setError] = useState("");

  // ======================================
  // PAGINATION STATE
  // ======================================

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  // ======================================
  // GET SEARCH PARAMETERS
  // ======================================

  const {
    service = "",
    location = {},
    latitude = null,
    longitude = null,
  } = route.params || {};

  // ======================================
  // LOCATION TEXT
  // ======================================

  const locationText = [
    location.lga,
    location.city,
    location.state,
  ]
    .filter(Boolean)
    .join(", ");

  // ======================================
  // FETCH ARTISANS
  // ======================================

  const fetchArtisans = useCallback(
    async (pageNumber = 1, append = false) => {
      try {
        // ==================================
        // LOADING STATE
        // ==================================

        if (append) {
          setLoadingMore(true);
        } else {
          setLoading(true);
          setError("");
        }

        // ==================================
        // BUILD QUERY PARAMETERS
        // ==================================

        const params = new URLSearchParams();

        // Pagination
        params.append("page", String(pageNumber));
        params.append("limit", "12");

        // ==================================
        // SERVICE
        // ==================================

        if (service?.trim()) {
          params.append(
            "search",
            service.trim()
          );
        }

        // ==================================
        // LOCATION FILTERS
        // ==================================

        if (location.state) {
          params.append(
            "state",
            location.state
          );
        }

        if (location.city) {
          params.append(
            "city",
            location.city
          );
        }

        if (location.lga) {
          params.append(
            "localGovernment",
            location.lga
          );
        }

        // ==================================
        // GEOLOCATION
        // ==================================

        const hasCoordinates =
          latitude !== null &&
          longitude !== null &&
          latitude !== undefined &&
          longitude !== undefined;

        if (hasCoordinates) {
          params.append(
            "latitude",
            String(latitude)
          );

          params.append(
            "longitude",
            String(longitude)
          );

          params.append(
            "radius",
            "25"
          );
        }

        // ==================================
        // FINAL URL
        // ==================================

        const url =
          `${process.env.EXPO_PUBLIC_API_URL}/users/workers/all?${params.toString()}`;

        console.log(
          "Workers request:",
          url
        );

        // ==================================
        // REQUEST
        // ==================================

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(
            "Failed to fetch artisans."
          );
        }

        const data = await response.json();

        console.log(
          "Workers API response:",
          data
        );

        // ==================================
        // UPDATE PAGINATION
        // ==================================

        setTotalPages(
          data.totalPages || 1
        );

        setPage(
          data.currentPage || pageNumber
        );

        // ==================================
        // UPDATE ARTISANS
        // ==================================

        if (append) {
          setArtisans((previousArtisans) => [
            ...previousArtisans,
            ...(data.workers || []),
          ]);
        } else {
          setArtisans(
            data.workers || []
          );
        }
      } catch (error) {
        console.error(
          "Failed to fetch artisans:",
          error
        );

        // Only show the main error
        // when loading the first page.
        if (!append) {
          setError(
            "Unable to load artisans. Please try again."
          );
        }
      } finally {
        if (append) {
          setLoadingMore(false);
        } else {
          setLoading(false);
        }
      }
    },
    [
      service,
      location.state,
      location.city,
      location.lga,
      latitude,
      longitude,
    ]
  );

  // ======================================
  // INITIAL FETCH
  // ======================================

  useEffect(() => {
    // Reset pagination
    setPage(1);
    setTotalPages(1);
    setArtisans([]);

    // Fetch first page
    fetchArtisans(1, false);
  }, [fetchArtisans]);

  // ======================================
  // LOAD MORE
  // ======================================

  const handleLoadMore = () => {
    // Don't fetch if:
    // - already loading more
    // - already on the last page
    // - initial loading is still happening
    if (
      loadingMore ||
      loading ||
      page >= totalPages
    ) {
      return;
    }

    const nextPage = page + 1;

    fetchArtisans(
      nextPage,
      true
    );
  };

  // ======================================
  // LOADING FIRST PAGE
  // ======================================

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />

        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color="#f97316"
          />

          <Text style={styles.loadingText}>
            Finding artisans...
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
        <StatusBar style="light" />

        <View style={styles.center}>
          <Text style={styles.errorText}>
            {error}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ======================================
  // SCREEN
  // ======================================

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <FlatList
        data={artisans}

        keyExtractor={(item) =>
          item._id
        }

        renderItem={({ item }) => (
          <ArtisanCard
            artisan={item}
            onPress={() => {
              console.log(
                "Selected artisan:",
                item
              );
            }}
          />
        )}

        contentContainerStyle={
          styles.listContent
        }

        showsVerticalScrollIndicator={false}

        // ==================================
        // PAGINATION
        // ==================================

        onEndReached={
          handleLoadMore
        }

        onEndReachedThreshold={0.5}

        // ==================================
        // HEADER
        // ==================================

        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>
              Find an artisan
            </Text>

            <Text style={styles.subtitle}>
              {latitude !== null &&
              longitude !== null
                ? "Showing artisans near you"
                : service
                ? `Showing results for "${service}"`
                : "Showing available artisans"}
            </Text>

            {locationText ? (
              <Text style={styles.location}>
                📍 {locationText}
              </Text>
            ) : null}
          </View>
        }

        // ==================================
        // EMPTY
        // ==================================

        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>
              No artisans found
            </Text>

            <Text style={styles.emptyText}>
              Try changing your search or
              location.
            </Text>
          </View>
        }

        // ==================================
        // FOOTER
        // ==================================

        ListFooterComponent={
          loadingMore ? (
            <View style={styles.footer}>
              <ActivityIndicator
                size="small"
                color="#f97316"
              />

              <Text style={styles.loadingMoreText}>
                Loading more artisans...
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030712",
  },

  listContent: {
    padding: 20,
    paddingBottom: 30,
    flexGrow: 1,
  },

  header: {
    marginBottom: 20,
  },

  title: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "800",
  },

  subtitle: {
    color: "#9ca3af",
    fontSize: 14,
    marginTop: 6,
  },

  location: {
    color: "#d1d5db",
    fontSize: 13,
    marginTop: 10,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  loadingText: {
    color: "#9ca3af",
    fontSize: 14,
    marginTop: 12,
  },

  loadingMoreText: {
    color: "#9ca3af",
    fontSize: 13,
    marginTop: 8,
  },

  footer: {
    alignItems: "center",
    paddingVertical: 20,
  },

  errorText: {
    color: "#ef4444",
    fontSize: 14,
    textAlign: "center",
  },

  empty: {
    alignItems: "center",
    marginTop: 60,
  },

  emptyTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },

  emptyText: {
    color: "#9ca3af",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
});

export default WorkersScreen;