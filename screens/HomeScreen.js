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
  // ======================================
  // SEARCH PARAMETERS
  // ======================================

  const {
    service = "",
    location = {},
    latitude: routeLatitude = null,
    longitude: routeLongitude = null,
  } = route.params || {};

  // ======================================
  // ARTISANS
  // ======================================

  const [artisans, setArtisans] = useState([]);

  // ======================================
  // LOADING / ERROR
  // ======================================

  const [loading, setLoading] = useState(true);

  const [loadingMore, setLoadingMore] =
    useState(false);

  const [error, setError] = useState("");

  // ======================================
  // SEARCH
  // ======================================

  const [search, setSearch] = useState(
    service || ""
  );

  // ======================================
  // LOCATION
  // ======================================

  const [selectedLocation, setSelectedLocation] =
    useState({
      state: location.state || "",
      city: location.city || "",
      lga: location.lga || "",
    });

  // ======================================
  // FILTER PANEL
  // ======================================

  const [showFilters, setShowFilters] =
    useState(false);

  // ======================================
  // GEOLOCATION
  // ======================================

  const {
    loading: locationLoading,
    error: locationError,
    getLocation,
  } = useGeolocation();

  const [latitude, setLatitude] =
    useState(routeLatitude);

  const [longitude, setLongitude] =
    useState(routeLongitude);

  // ======================================
  // RADIUS
  // ======================================

  const [radius, setRadius] =
    useState("25");

  // ======================================
  // PAGINATION
  // ======================================

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [total, setTotal] = useState(0);

  // ======================================
  // HAS COORDINATES
  // ======================================

  const hasCoordinates =
    latitude !== null &&
    longitude !== null &&
    latitude !== undefined &&
    longitude !== undefined;

  // ======================================
  // LOCATION TEXT
  // ======================================

  const locationText = [
    selectedLocation.lga,
    selectedLocation.city,
    selectedLocation.state,
  ]
    .filter(Boolean)
    .join(", ");

  // ======================================
  // ACTIVE FILTER COUNT
  // ======================================

  const activeFilterCount =
    Number(Boolean(search.trim())) +
    Number(Boolean(selectedLocation.state)) +
    Number(Boolean(selectedLocation.city)) +
    Number(Boolean(selectedLocation.lga));

  // ======================================
  // LOCATION CHANGE
  // ======================================

  const handleLocationChange = (
    newLocation
  ) => {
    setSelectedLocation(newLocation);

    // Once the user manually selects a location,
    // stop using nearby-coordinate search.
    setLatitude(null);
    setLongitude(null);
  };

  // ======================================
  // SEARCH WITH MY LOCATION
  // ======================================

  const handleSearchWithMyLocation =
    async () => {
      try {
        const coordinates =
          await getLocation();

        if (!coordinates) {
          return;
        }

        // Save coordinates
        setLatitude(
          coordinates.latitude
        );

        setLongitude(
          coordinates.longitude
        );

        // Clear manually selected location
        setSelectedLocation({
          state: "",
          city: "",
          lga: "",
        });

        // Reset pagination
        setPage(1);
        setTotalPages(1);
        setArtisans([]);
        setError("");
      } catch (locationSearchError) {
        console.error(
          "Search with location error:",
          locationSearchError
        );
      }
    };

  // ======================================
  // FETCH ARTISANS
  // ======================================

  const fetchArtisans = useCallback(
    async (
      pageNumber = 1,
      append = false
    ) => {
      try {
        // ==================================
        // LOADING
        // ==================================

        if (append) {
          setLoadingMore(true);
        } else {
          setLoading(true);
          setError("");
        }

        // ==================================
        // QUERY PARAMETERS
        // ==================================

        const params =
          new URLSearchParams();

        params.append(
          "page",
          String(pageNumber)
        );

        params.append(
          "limit",
          String(WORKERS_PER_PAGE)
        );

        // ==================================
        // SEARCH
        // ==================================

        if (search.trim()) {
          params.append(
            "search",
            search.trim()
          );
        }

        // ==================================
        // STATE
        // ==================================

        if (selectedLocation.state) {
          params.append(
            "state",
            selectedLocation.state
          );
        }

        // ==================================
        // CITY
        // ==================================

        if (selectedLocation.city) {
          params.append(
            "city",
            selectedLocation.city
          );
        }

        // ==================================
        // LGA
        // ==================================

        if (selectedLocation.lga) {
          params.append(
            "localGovernment",
            selectedLocation.lga
          );
        }

        // ==================================
        // GEOLOCATION
        // ==================================

        const hasValidCoordinates =
          latitude !== null &&
          longitude !== null &&
          latitude !== undefined &&
          longitude !== undefined;

        if (hasValidCoordinates) {
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

        // ==================================
        // URL
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

        const response =
          await fetch(url);

        if (!response.ok) {
          throw new Error(
            "Failed to fetch artisans."
          );
        }

        const data =
          await response.json();

        console.log(
          "Workers API response:",
          data
        );

        // ==================================
        // PAGINATION
        // ==================================

        setTotalPages(
          data.totalPages || 1
        );

        setPage(
          data.currentPage ||
            pageNumber
        );

        setTotal(
          Number(data.total) || 0
        );

        // ==================================
        // ARTISANS
        // ==================================

        if (append) {
          setArtisans(
            (previousArtisans) => [
              ...previousArtisans,
              ...(data.workers || []),
            ]
          );
        } else {
          setArtisans(
            data.workers || []
          );
        }
      } catch (fetchError) {
        console.error(
          "Failed to fetch artisans:",
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
    ]
  );

  // ======================================
  // FETCH WHEN SEARCH / FILTER CHANGES
  // ======================================

  useEffect(() => {
    setPage(1);
    setTotalPages(1);
    setArtisans([]);

    fetchArtisans(1, false);
  }, [fetchArtisans]);

  // ======================================
  // CLEAR ALL FILTERS
  // ======================================

  const clearAllFilters = () => {
    setSearch("");

    setSelectedLocation({
      state: "",
      city: "",
      lga: "",
    });

    setLatitude(null);
    setLongitude(null);

    setPage(1);
    setTotalPages(1);
    setError("");
  };

  // ======================================
  // CHANGE RADIUS
  // ======================================

  const handleRadiusChange = (
    value
  ) => {
    setRadius(value);
    setPage(1);
  };

  // ======================================
  // LOAD MORE
  // ======================================

  const handleLoadMore = () => {
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
  // RETRY
  // ======================================

  const handleRetry = () => {
    fetchArtisans(1, false);
  };

  // ======================================
  // LOADING
  // ======================================

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
      <SafeAreaView
        style={styles.container}
      >
        <StatusBar style="light" />

        <Navbar />

        <View style={styles.center}>
          <Text
            style={styles.errorText}
          >
            {error}
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleRetry}
          >
            <Text
              style={styles.retryText}
            >
              Try again
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ======================================
  // SCREEN
  // ======================================

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

        // ==================================
        // HEADER
        // ==================================

        ListHeaderComponent={
          <View>

            {/* ==============================
                PAGE HEADER
            =============================== */}

            <View
              style={styles.header}
            >
              <Text
                style={styles.title}
              >
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

            {/* ==============================
                SEARCH
            =============================== */}

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
                    (previous) =>
                      !previous
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

            {/* ==============================
                FILTER PANEL
            =============================== */}

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
                        clearAllFilters
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

                {/* =================================
                    REUSABLE LOCATION SELECTOR
                ================================== */}

                <LocationSelector
                  selectedLocation={
                    selectedLocation
                  }
                  onLocationChange={
                    handleLocationChange
                  }
                />

                {/* =================================
                    SEARCH WITH MY LOCATION
                ================================== */}

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

            {/* ==============================
                RESULTS HEADER
            =============================== */}

            <View
              style={styles.resultsHeader}
            >
              <View
                style={
                  styles.resultsHeaderText
                }
              >
                <Text
                  style={styles.resultsTitle}
                >
                  {hasCoordinates
                    ? "Artisans Near You"
                    : activeFilterCount >
                      0
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
                    : activeFilterCount >
                      0
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

            {/* ==============================
                LOCATION BANNER
            =============================== */}

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

            {/* ==============================
                LOCATION TEXT
            =============================== */}

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

            {/* ==============================
                ACTIVE FILTERS
            =============================== */}

            {activeFilterCount >
            0 ? (
              <View
                style={
                  styles.activeFilters
                }
              >
                <Text
                  style={
                    styles.filteringText
                  }
                >
                  Filtering by:
                </Text>

                {search.trim() ? (
                  <View
                    style={
                      styles.filterChip
                    }
                  >
                    <Text
                      style={
                        styles.filterChipText
                      }
                    >
                      🔍 {search}
                    </Text>

                    <TouchableOpacity
                      onPress={() =>
                        setSearch("")
                      }
                    >
                      <Text
                        style={
                          styles.chipClose
                        }
                      >
                        ✕
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : null}

                {selectedLocation.state ? (
                  <View
                    style={
                      styles.filterChip
                    }
                  >
                    <Text
                      style={
                        styles.filterChipText
                      }
                    >
                      {selectedLocation.state}
                    </Text>

                    <TouchableOpacity
                      onPress={() =>
                        setSelectedLocation(
                          (previous) => ({
                            ...previous,
                            state: "",
                            city: "",
                            lga: "",
                          })
                        )
                      }
                    >
                      <Text
                        style={
                          styles.chipClose
                        }
                      >
                        ✕
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : null}

                {selectedLocation.city ? (
                  <View
                    style={
                      styles.filterChip
                    }
                  >
                    <Text
                      style={
                        styles.filterChipText
                      }
                    >
                      {selectedLocation.city}
                    </Text>

                    <TouchableOpacity
                      onPress={() =>
                        setSelectedLocation(
                          (previous) => ({
                            ...previous,
                            city: "",
                            lga: "",
                          })
                        )
                      }
                    >
                      <Text
                        style={
                          styles.chipClose
                        }
                      >
                        ✕
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : null}

                {selectedLocation.lga ? (
                  <View
                    style={
                      styles.filterChip
                    }
                  >
                    <Text
                      style={
                        styles.filterChipText
                      }
                    >
                      {selectedLocation.lga}
                    </Text>

                    <TouchableOpacity
                      onPress={() =>
                        setSelectedLocation(
                          (previous) => ({
                            ...previous,
                            lga: "",
                          })
                        )
                      }
                    >
                      <Text
                        style={
                          styles.chipClose
                        }
                      >
                        ✕
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            ) : null}
          </View>
        }

        // ==================================
        // EMPTY
        // ==================================

        ListEmptyComponent={
          <View
            style={styles.empty}
          >
            <Text
              style={styles.emptyIcon}
            >
              🔍
            </Text>

            <Text
              style={
                styles.emptyTitle
              }
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
                  clearAllFilters
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

        // ==================================
        // FOOTER
        // ==================================

        ListFooterComponent={
          <View>
            {loadingMore ? (
              <View
                style={styles.footer}
              >
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
              </View>
            ) : null}

            {!loadingMore &&
            total > 0 &&
            totalPages > 1 ? (
              <Text
                style={
                  styles.paginationText
                }
              >
                Page {page} of{" "}
                {totalPages}
              </Text>
            ) : null}
          </View>
        }
      />
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

  // ========================================
  // SEARCH
  // ========================================

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

  // ========================================
  // FILTER PANEL
  // ========================================

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

  // ========================================
  // MY LOCATION
  // ========================================

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

  // ========================================
  // RESULTS
  // ========================================

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

  // ========================================
  // LOCATION
  // ========================================

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

  // ========================================
  // FILTER CHIPS
  // ========================================

  activeFilters: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 7,
    marginBottom: 18,
  },

  filteringText: {
    color: "#4b5563",
    fontSize: 12,
  },

  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#431407",
    borderWidth: 1,
    borderColor: "#7c2d12",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  filterChipText: {
    color: "#fdba74",
    fontSize: 11,
  },

  chipClose: {
    color: "#fb923c",
    fontSize: 11,
    marginLeft: 7,
  },

  // ========================================
  // EMPTY
  // ========================================

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

  // ========================================
  // LOADING
  // ========================================

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

  // ========================================
  // ERROR
  // ========================================

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

  // ========================================
  // PAGINATION
  // ========================================

  paginationText: {
    color: "#4b5563",
    fontSize: 12,
    textAlign: "center",
    paddingVertical: 15,
  },
});

export default WorkersScreen;