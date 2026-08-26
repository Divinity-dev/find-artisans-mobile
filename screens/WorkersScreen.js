import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { StatusBar } from "expo-status-bar";

import Navbar from "../components/Navbar";
import ArtisanCard from "../components/ArtisanCard";
import LocationSelector from "../components/LocationSelector";
import useGeolocation from "../hooks/useGeolocation";

const WORKERS_PER_PAGE = 12;

const DISTANCE_OPTIONS = [
  { value: "5", label: "5 km" },
  { value: "10", label: "10 km" },
  { value: "25", label: "25 km" },
];

const WorkersScreen = ({ route }) => {
  // =====================================================
  // ROUTE PARAMETERS
  // =====================================================

  const {
    service = "",
    location = {},
    latitude: initialLatitude = null,
    longitude: initialLongitude = null,
  } = route.params || {};

  // =====================================================
  // SEARCH
  // =====================================================

  const [search, setSearch] = useState(service);

  // =====================================================
  // LOCATION
  // =====================================================

  const [selectedLocation, setSelectedLocation] =
    useState({
      state: location.state || "",
      city: location.city || "",
      lga: location.lga || "",
    });

  const [latitude, setLatitude] =
    useState(initialLatitude);

  const [longitude, setLongitude] =
    useState(initialLongitude);

  // =====================================================
  // RADIUS
  // =====================================================

  const [radius, setRadius] = useState("25");

  // =====================================================
  // FILTER UI
  // =====================================================

  const [showFilters, setShowFilters] =
    useState(false);

  // =====================================================
  // ARTISANS
  // =====================================================

  const [artisans, setArtisans] = useState([]);

  // =====================================================
  // PAGINATION
  // =====================================================

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [total, setTotal] = useState(0);

  // =====================================================
  // LOADING
  // =====================================================

  const [loading, setLoading] = useState(true);

  const [loadingMore, setLoadingMore] =
    useState(false);

  // =====================================================
  // ERROR
  // =====================================================

  const [error, setError] = useState("");

  // =====================================================
  // GEOLOCATION
  // =====================================================

  const {
    loading: locationLoading,
    error: locationError,
    getLocation,
  } = useGeolocation();

  // =====================================================
  // COORDINATES
  // =====================================================

  const hasCoordinates =
    latitude !== null &&
    longitude !== null &&
    latitude !== undefined &&
    longitude !== undefined;

  // =====================================================
  // LOCATION TEXT
  // =====================================================

  const locationText = [
    selectedLocation.lga,
    selectedLocation.city,
    selectedLocation.state,
  ]
    .filter(Boolean)
    .join(", ");

  // =====================================================
  // FETCH ARTISANS
  // =====================================================

  const fetchArtisans = useCallback(
    async (pageNumber = 1, append = false) => {
      try {
        if (append) {
          setLoadingMore(true);
        } else {
          setLoading(true);
          setError("");
        }

        const params = new URLSearchParams();

        // Pagination
        params.append(
          "page",
          String(pageNumber)
        );

        params.append(
          "limit",
          String(WORKERS_PER_PAGE)
        );

        // Search
        if (search.trim()) {
          params.append(
            "search",
            search.trim()
          );
        }

        // State
        if (selectedLocation.state) {
          params.append(
            "state",
            selectedLocation.state
          );
        }

        // City
        if (selectedLocation.city) {
          params.append(
            "city",
            selectedLocation.city
          );
        }

        // LGA
        if (selectedLocation.lga) {
          params.append(
            "localGovernment",
            selectedLocation.lga
          );
        }

        // Coordinates
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
            radius
          );
        }

        const url =
          `${process.env.EXPO_PUBLIC_API_URL}/users/workers/all?${params.toString()}`;

        console.log(
          "Fetching artisans:",
          url
        );

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(
            "Failed to fetch artisans."
          );
        }

        const data = await response.json();

        console.log(
          "Artisans response:",
          data
        );

        const workers =
          data.workers || [];

        // Pagination information
        setPage(
          data.currentPage ||
            pageNumber
        );

        setTotalPages(
          data.totalPages || 1
        );

        setTotal(
          Number(data.total) || 0
        );

        // Add or replace workers
        if (append) {
          setArtisans(
            (previous) => [
              ...previous,
              ...workers,
            ]
          );
        } else {
          setArtisans(workers);
        }
      } catch (fetchError) {
        console.error(
          "Fetch artisans error:",
          fetchError
        );

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
      search,
      selectedLocation,
      latitude,
      longitude,
      radius,
      hasCoordinates,
    ]
  );

  // =====================================================
  // FETCH WHEN FILTERS CHANGE
  // =====================================================

  useEffect(() => {
    setPage(1);
    setArtisans([]);

    fetchArtisans(1, false);
  }, [fetchArtisans]);

  // =====================================================
  // LOCATION CHANGE
  // =====================================================

  const handleLocationChange = (
    newLocation
  ) => {
    setSelectedLocation(
      newLocation
    );

    // Manual location search
    // should not use coordinates.
    setLatitude(null);
    setLongitude(null);
  };

  // =====================================================
  // SEARCH WITH MY LOCATION
  // =====================================================

  const handleSearchWithMyLocation =
    async () => {
      try {
        const coordinates =
          await getLocation();

        if (!coordinates) {
          return;
        }

        setLatitude(
          coordinates.latitude
        );

        setLongitude(
          coordinates.longitude
        );

        // Clear manual location
        setSelectedLocation({
          state: "",
          city: "",
          lga: "",
        });
      } catch (locationError) {
        console.error(
          "Location search error:",
          locationError
        );
      }
    };

  // =====================================================
  // CHANGE RADIUS
  // =====================================================

  const handleRadiusChange = (
    value
  ) => {
    setRadius(value);
  };

  // =====================================================
  // LOAD MORE
  // =====================================================

  const handleLoadMore = () => {
    if (
      loading ||
      loadingMore
    ) {
      return;
    }

    if (page >= totalPages) {
      return;
    }

    fetchArtisans(
      page + 1,
      true
    );
  };

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {
    setSearch("");

    setSelectedLocation({
      state: "",
      city: "",
      lga: "",
    });

    setLatitude(null);
    setLongitude(null);
  };

  // =====================================================
  // RETRY
  // =====================================================

  const handleRetry = () => {
    fetchArtisans(1, false);
  };

  // =====================================================
  // ACTIVE FILTER COUNT
  // =====================================================

  const activeFilterCount =
    Number(Boolean(search.trim())) +
    Number(Boolean(selectedLocation.state)) +
    Number(Boolean(selectedLocation.city)) +
    Number(Boolean(selectedLocation.lga));

  // =====================================================
  // LOADING SCREEN
  // =====================================================

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

          <Text style={styles.loadingText}>
            Finding artisans...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // =====================================================
  // ERROR SCREEN
  // =====================================================

  if (error) {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <StatusBar style="light" />

        <Navbar />

        <View style={styles.center}>
          <Text style={styles.errorText}>
            {error}
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleRetry}
          >
            <Text style={styles.retryText}>
              Try again
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // =====================================================
  // SCREEN
  // =====================================================

  return (
    <SafeAreaView
      style={styles.container}
    >
      <StatusBar style="light" />

      <Navbar />

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
        showsVerticalScrollIndicator={
          false
        }
        onEndReached={
          handleLoadMore
        }
        onEndReachedThreshold={0.5}

        // =================================================
        // HEADER
        // =================================================

        ListHeaderComponent={
          <View>
            {/* PAGE TITLE */}

            <View style={styles.header}>
              <Text style={styles.title}>
                Find a trusted artisan
              </Text>

              <Text
                style={styles.subtitle}
              >
                Search verified electricians,
                plumbers, mechanics,
                cleaners and other skilled
                professionals.
              </Text>
            </View>

            {/* SEARCH */}

            <View
              style={styles.searchCard}
            >
              <View
                style={styles.searchRow}
              >
                <Text
                  style={styles.searchIcon}
                >
                  🔍
                </Text>

                <TextInput
                  value={search}
                  onChangeText={
                    setSearch
                  }
                  placeholder="Search by name, skill or service..."
                  placeholderTextColor="#6b7280"
                  style={
                    styles.searchInput
                  }
                />

                {search ? (
                  <TouchableOpacity
                    onPress={() =>
                      setSearch("")
                    }
                  >
                    <Text
                      style={
                        styles.clearIcon
                      }
                    >
                      ✕
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>

              {/* FILTER BUTTON */}

              <TouchableOpacity
                style={[
                  styles.filterButton,
                  showFilters &&
                    styles.filterButtonActive,
                ]}
                onPress={() =>
                  setShowFilters(
                    (value) =>
                      !value
                  )
                }
              >
                <Text
                  style={
                    showFilters
                      ? styles.filterButtonTextActive
                      : styles.filterButtonText
                  }
                >
                  ⚙️{" "}
                  {showFilters
                    ? "Hide filters"
                    : "Filters"}
                </Text>

                {activeFilterCount >
                0 ? (
                  <View
                    style={
                      styles.filterBadge
                    }
                  >
                    <Text
                      style={
                        styles.filterBadgeText
                      }
                    >
                      {
                        activeFilterCount
                      }
                    </Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            </View>

            {/* FILTER PANEL */}

            {showFilters ? (
              <View
                style={
                  styles.filterPanel
                }
              >
                <View
                  style={
                    styles.filterHeader
                  }
                >
                  <View
                    style={
                      styles.filterHeaderText
                    }
                  >
                    <Text
                      style={
                        styles.filterTitle
                      }
                    >
                      Search by location
                    </Text>

                    <Text
                      style={
                        styles.filterSubtitle
                      }
                    >
                      Select a state, city and
                      LGA to narrow your search.
                    </Text>
                  </View>

                  {activeFilterCount >
                  0 ? (
                    <TouchableOpacity
                      onPress={
                        clearFilters
                      }
                    >
                      <Text
                        style={
                          styles.clearAllText
                        }
                      >
                        Clear all
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>

                {/* LOCATION SELECTOR */}

                <LocationSelector
                  selectedLocation={
                    selectedLocation
                  }
                  onLocationChange={
                    handleLocationChange
                  }
                />

                {/* MY LOCATION */}

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    styles.myLocationButton,
                    locationLoading &&
                      styles.disabledButton,
                  ]}
                  onPress={
                    handleSearchWithMyLocation
                  }
                  disabled={
                    locationLoading
                  }
                >
                  <Text
                    style={
                      styles.myLocationIcon
                    }
                  >
                    📍
                  </Text>

                  <Text
                    style={
                      styles.myLocationText
                    }
                  >
                    {locationLoading
                      ? "Finding your location..."
                      : "Search with my location"}
                  </Text>
                </TouchableOpacity>

                {locationError ? (
                  <Text
                    style={
                      styles.locationError
                    }
                  >
                    {locationError}
                  </Text>
                ) : null}
              </View>
            ) : null}

            {/* RESULTS HEADER */}

            <View
              style={styles.resultsHeader}
            >
              <View
                style={
                  styles.resultsHeaderText
                }
              >
                <Text
                  style={
                    styles.resultsTitle
                  }
                >
                  {hasCoordinates
                    ? "Artisans Near You"
                    : activeFilterCount
                    ? "Matching Artisans"
                    : "Verified Workers"}
                </Text>

                <Text
                  style={
                    styles.resultsSubtitle
                  }
                >
                  {hasCoordinates
                    ? `Professionals within ${radius} km of your location`
                    : activeFilterCount
                    ? "Results matching your current search"
                    : "Discover skilled professionals across Nigeria"}
                </Text>
              </View>

              <View
                style={
                  styles.countContainer
                }
              >
                <Text
                  style={
                    styles.countNumber
                  }
                >
                  {total}
                </Text>

                <Text
                  style={
                    styles.countText
                  }
                >
                  {total === 1
                    ? "artisan"
                    : "artisans"}
                </Text>
              </View>
            </View>

            {/* LOCATION BANNER */}

            {hasCoordinates ? (
              <View
                style={
                  styles.locationBanner
                }
              >
                <Text
                  style={
                    styles.locationTitle
                  }
                >
                  📍 Searching near your
                  location
                </Text>

                <View
                  style={
                    styles.radiusRow
                  }
                >
                  {DISTANCE_OPTIONS.map(
                    (option) => (
                      <TouchableOpacity
                        key={
                          option.value
                        }
                        onPress={() =>
                          handleRadiusChange(
                            option.value
                          )
                        }
                        style={[
                          styles.radiusButton,
                          radius ===
                            option.value &&
                            styles.radiusButtonActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.radiusText,
                            radius ===
                              option.value &&
                              styles.radiusTextActive,
                          ]}
                        >
                          {
                            option.label
                          }
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>
              </View>
            ) : null}

            {/* SELECTED LOCATION */}

            {!hasCoordinates &&
            locationText ? (
              <View
                style={
                  styles.selectedLocationBanner
                }
              >
                <Text
                  style={
                    styles.selectedLocationText
                  }
                >
                  📍 {locationText}
                </Text>
              </View>
            ) : null}
          </View>
        }

        // =================================================
        // EMPTY
        // =================================================

        ListEmptyComponent={
          <View style={styles.empty}>
            <Text
              style={styles.emptyIcon}
            >
              🔍
            </Text>

            <Text
              style={styles.emptyTitle}
            >
              No artisans found
            </Text>

            <Text
              style={styles.emptyText}
            >
              We couldn't find any artisans
              matching your current search.
              Try another skill or location.
            </Text>

            {activeFilterCount >
            0 ? (
              <TouchableOpacity
                style={
                  styles.showAllButton
                }
                onPress={
                  clearFilters
                }
              >
                <Text
                  style={
                    styles.showAllText
                  }
                >
                  Show all artisans
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        }

        // =================================================
        // FOOTER
        // =================================================

        ListFooterComponent={
          <View style={styles.footer}>
            {loadingMore ? (
              <>
                <ActivityIndicator
                  size="small"
                  color="#f97316"
                />

                <Text
                  style={
                    styles.loadingMoreText
                  }
                >
                  Loading more artisans...
                </Text>
              </>
            ) : null}

            {!loadingMore &&
            artisans.length > 0 &&
            page >= totalPages ? (
              <Text
                style={
                  styles.endText
                }
              >
                You've reached the end.
              </Text>
            ) : null}
          </View>
        }
      />
    </SafeAreaView>
  );
};

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030712",
  },

  listContent: {
    padding: 20,
    paddingBottom: 40,
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
    lineHeight: 21,
    marginTop: 8,
  },

  // SEARCH

  searchCard: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 16,
    padding: 12,
    marginBottom: 18,
  },

  searchRow: {
    height: 50,
    backgroundColor: "#030712",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    color: "#ffffff",
    fontSize: 14,
  },

  clearIcon: {
    color: "#6b7280",
    fontSize: 16,
    paddingLeft: 10,
  },

  filterButton: {
    height: 46,
    marginTop: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1f2937",
    backgroundColor: "#030712",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  filterButtonActive: {
    backgroundColor: "#f97316",
    borderColor: "#f97316",
  },

  filterButtonText: {
    color: "#d1d5db",
    fontSize: 14,
    fontWeight: "700",
  },

  filterButtonTextActive: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },

  filterBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  filterBadgeText: {
    color: "#f97316",
    fontSize: 12,
    fontWeight: "800",
  },

  // FILTER PANEL

  filterPanel: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },

  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },

  filterHeaderText: {
    flex: 1,
    paddingRight: 10,
  },

  filterTitle: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
  },

  filterSubtitle: {
    color: "#6b7280",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },

  clearAllText: {
    color: "#f97316",
    fontSize: 13,
    fontWeight: "700",
  },

  // MY LOCATION

  myLocationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
    backgroundColor: "#f97316",
    borderRadius: 12,
    marginTop: 14,
  },

  myLocationIcon: {
    fontSize: 17,
    marginRight: 8,
  },

  myLocationText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },

  disabledButton: {
    opacity: 0.65,
  },

  locationError: {
    color: "#ef4444",
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
  },

  // RESULTS

  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
  },

  resultsHeaderText: {
    flex: 1,
    paddingRight: 12,
  },

  resultsTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "800",
  },

  resultsSubtitle: {
    color: "#6b7280",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },

  countContainer: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 11,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
  },

  countNumber: {
    color: "#f97316",
    fontSize: 18,
    fontWeight: "800",
  },

  countText: {
    color: "#6b7280",
    fontSize: 10,
  },

  // LOCATION

  locationBanner: {
    backgroundColor: "#172033",
    borderWidth: 1,
    borderColor: "#1e3a5f",
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
  },

  locationTitle: {
    color: "#60a5fa",
    fontSize: 14,
    fontWeight: "700",
  },

  radiusRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },

  radiusButton: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 9,
    backgroundColor: "#1f2937",
  },

  radiusButtonActive: {
    backgroundColor: "#f97316",
  },

  radiusText: {
    color: "#9ca3af",
    fontSize: 12,
    fontWeight: "700",
  },

  radiusTextActive: {
    color: "#ffffff",
  },

  selectedLocationBanner: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 12,
    padding: 12,
    marginBottom: 18,
  },

  selectedLocationText: {
    color: "#d1d5db",
    fontSize: 13,
  },

  // EMPTY

  empty: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },

  emptyIcon: {
    fontSize: 32,
    marginBottom: 12,
  },

  emptyTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
  },

  emptyText: {
    color: "#6b7280",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 8,
    maxWidth: 320,
  },

  showAllButton: {
    backgroundColor: "#f97316",
    borderRadius: 11,
    paddingHorizontal: 18,
    paddingVertical: 11,
    marginTop: 18,
  },

  showAllText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },

  // LOADING

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

  endText: {
    color: "#4b5563",
    fontSize: 12,
  },

  // ERROR

  errorText: {
    color: "#ef4444",
    fontSize: 14,
    textAlign: "center",
  },

  retryButton: {
    backgroundColor: "#f97316",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 15,
  },

  retryText: {
    color: "#ffffff",
    fontWeight: "700",
  },
});

export default WorkersScreen;