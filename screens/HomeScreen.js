import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import LocationSelector from "../components/LocationSelector";
import ServiceSearch from "../components/ServiceSearch";
import { useNavigation } from "@react-navigation/native";
import useGeolocation from "../hooks/useGeolocation";
import Navbar from "../components/Navbar";
import TrustIndicators from "../components/TrustIndicators";
import FindWaysSection from "../components/FindWaysSection";
import HowItWorks from "../components/HowItWorks";
import WhyFindArtisans from "../components/WhyFindArtisans";
import PopularCategories from "../components/PopularCategories";
import Testimonials from "../components/Testimonials";
import FinalCTA from "../components/FinalCTA";
import Footer from "../components/Footer";
import ArtisanCard from "../components/ArtisanCard";

const HomeScreen = () => {
  const [selectedLocation, setSelectedLocation] = useState({
    state: "",
    city: "",
    lga: "",
  });
  const [selectedService, setSelectedService] = useState("");
  const [featuredArtisans, setFeaturedArtisans] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);

  const navigation = useNavigation();

  const {
    location,
    loading: locationLoading,
    error: locationError,
    getLocation,
  } = useGeolocation();

  const handleSearch = () => {
    navigation.navigate("Workers", {
      service: selectedService,
      location: selectedLocation,
      latitude: null,
      longitude: null,
    });
  };

  const handleFindNearMe = async () => {
    try {
      const coordinates = await getLocation();

      if (!coordinates) {
        return;
      }

      navigation.navigate("Workers", {
        service: "",
        location: {
          state: "",
          city: "",
          lga: "",
        },
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      });
    } catch (error) {
      console.error("Find near me error:", error);
    }
  };

  // ==========================================
  // FETCH FEATURED ARTISANS
  // ==========================================
  useEffect(() => {
    const fetchFeaturedArtisans = async () => {
      try {
        setFeaturedLoading(true);

        const params = new URLSearchParams();
        params.append("page", "1");
        params.append("limit", "4");

        const url = `${process.env.EXPO_PUBLIC_API_URL}/users/workers/all?${params.toString()}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch featured artisans.");
        }

        const data = await response.json();

        setFeaturedArtisans(data.workers || []);
      } catch (error) {
        console.error("Failed to fetch featured artisans:", error);
      } finally {
        setFeaturedLoading(false);
      }
    };

    fetchFeaturedArtisans();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Navbar />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* HERO CONTAINER */}
        <View style={styles.heroContainer}>
          <ImageBackground
            source={require("../assets/images/download.jpeg")}
            style={styles.heroBackground}
            resizeMode="cover"
          >
            {/* Dark tint overlay */}
            <View style={styles.heroOverlay}>
              <View style={styles.content}>
                {/* Badge */}
                <View style={styles.badge}>
                  <Text style={styles.badgeIcon}>✓</Text>
                  <Text style={styles.badgeText}>
                    Nigeria's trusted artisan marketplace
                  </Text>
                </View>

                {/* Heading */}
                <Text style={styles.title}>
                  Find the Right <Text style={styles.orangeText}>Artisan</Text>
                  {"\n"}
                  Without the Guesswork.
                </Text>

                {/* Description */}
                <Text style={styles.description}>
                  Find verified electricians, plumbers, mechanics, cleaners,
                  carpenters and other skilled professionals — wherever you are in
                  Nigeria.
                </Text>

                {/* Search panel */}
                <View style={styles.searchPanel}>
                  <Text style={styles.searchTitle}>Find an artisan</Text>

                  <Text style={styles.searchSubtitle}>
                    Search an area or let us find artisans around you.
                  </Text>

                  {/* Service Search */}
                  <View style={styles.dropdownWrapper}>
                    <ServiceSearch
                      value={selectedService}
                      onServiceChange={setSelectedService}
                    />
                  </View>

                  {/* Location Selector */}
                  <View style={styles.dropdownWrapper}>
                    <LocationSelector
                      selectedLocation={selectedLocation}
                      onLocationChange={setSelectedLocation}
                    />
                  </View>

                  {/* Search artisans */}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.searchButton}
                    onPress={handleSearch}
                  >
                    <Text style={styles.searchButtonText}>Search artisans</Text>
                  </TouchableOpacity>

                  {/* Find near me */}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[
                      styles.nearMeButton,
                      locationLoading && styles.disabledNearMeButton,
                    ]}
                    onPress={handleFindNearMe}
                    disabled={locationLoading}
                  >
                    <Text style={styles.nearMeIcon}>📍</Text>
                    <Text style={styles.nearMeText}>
                      {locationLoading
                        ? "Finding your location..."
                        : "Find artisans near me"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.browseButton}
                    onPress={() => {
                      navigation.navigate("Workers", {
                        service: "",
                        location: { state: "", city: "", lga: "" },
                        latitude: null,
                        longitude: null,
                      });
                    }}
                  >
                    <Text style={styles.browseButtonText}>
                      Browse all artisans
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* FEATURED ARTISANS */}
        <View style={styles.featuredSection}>
          <Text style={styles.sectionEyebrow}>FEATURED ARTISANS</Text>

          <Text style={styles.featuredTitle}>Find trusted professionals</Text>

          <Text style={styles.featuredSubtitle}>
            Meet some of the skilled artisans available on FindArtisans.
          </Text>

          {featuredLoading ? (
            <View style={styles.featuredLoading}>
              <ActivityIndicator size="small" color="#f97316" />
              <Text style={styles.featuredLoadingText}>
                Loading artisans...
              </Text>
            </View>
          ) : (
            <>
              {featuredArtisans.map((artisan) => (
                <ArtisanCard
                  key={artisan._id}
                  artisan={artisan}
                  onPress={() =>
                    navigation.navigate("WorkerDetails", {
                      id: artisan._id,
                    })
                  }
                />
              ))}
            </>
          )}

          {!featuredLoading && featuredArtisans.length === 0 ? (
            <Text style={styles.noFeaturedText}>
              No artisans available yet.
            </Text>
          ) : null}

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.viewAllButton}
            onPress={() => {
              navigation.navigate("Workers", {
                service: "",
                location: { state: "", city: "", lga: "" },
                latitude: null,
                longitude: null,
              });
            }}
          >
            <Text style={styles.viewAllButtonText}>View all artisans →</Text>
          </TouchableOpacity>
        </View>

        <TrustIndicators />

        <FindWaysSection
          onBrowse={() => {
            navigation.navigate("Workers", {
              service: "",
              location: { state: "", city: "", lga: "" },
              latitude: null,
              longitude: null,
            });
          }}
        />

        <HowItWorks />

        <WhyFindArtisans
          onBrowse={() => {
            navigation.navigate("Workers", {
              service: "",
              location: { state: "", city: "", lga: "" },
              latitude: null,
              longitude: null,
            });
          }}
        />

        <PopularCategories
          onViewAll={() => {
            navigation.navigate("Workers", {
              service: "",
              location: { state: "", city: "", lga: "" },
              latitude: null,
              longitude: null,
            });
          }}
          onCategoryPress={(category) => {
            navigation.navigate("Workers", {
              service: category.replace(/s$/, ""),
              location: { state: "", city: "", lga: "" },
              latitude: null,
              longitude: null,
            });
          }}
        />

        <Testimonials />

        <FinalCTA
          onBrowse={() => {
            navigation.navigate("Workers", {
              service: "",
              location: { state: "", city: "", lga: "" },
              latitude: null,
              longitude: null,
            });
          }}
          onJoin={() => {
            navigation.navigate("Register");
          }}
        />

        <Footer
          onHome={() => {}}
          onWorkers={() => {
            navigation.navigate("Workers", {
              service: "",
              location: { state: "", city: "", lga: "" },
              latitude: null,
              longitude: null,
            });
          }}
          onRegister={() => {
            navigation.navigate("Register");
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030712",
  },

  scrollContent: {
    flexGrow: 1,
  },

  heroContainer: {
    width: "100%",
  },

  heroBackground: {
    width: "100%",
  },

  heroOverlay: {
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.82)",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
    alignItems: "center",
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 30,
    backgroundColor: "rgba(249, 115, 22, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(249, 115, 22, 0.35)",
    marginBottom: 24,
  },

  badgeIcon: {
    color: "#22c55e",
    fontSize: 15,
    fontWeight: "800",
    marginRight: 7,
  },

  badgeText: {
    color: "#fb923c",
    fontSize: 12,
    fontWeight: "700",
  },

  title: {
    color: "#ffffff",
    fontSize: 34,
    lineHeight: 42,
    fontWeight: "800",
    textAlign: "center",
  },

  orangeText: {
    color: "#f97316",
  },

  description: {
    color: "#d1d5db",
    fontSize: 15,
    lineHeight: 24,
    textAlign: "center",
    marginTop: 20,
    maxWidth: 370,
  },

  searchPanel: {
    width: "100%",
    marginTop: 30,
    padding: 18,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.10)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    elevation: 3, // Required for Android view layering
  },

  dropdownWrapper: {
    zIndex: 10,
    elevation: 10,
    marginBottom: 10,
  },

  searchTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },

  searchSubtitle: {
    color: "#9ca3af",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 5,
    marginBottom: 16,
  },

  nearMeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f97316",
    borderRadius: 14,
    minHeight: 54,
    marginTop: 12,
  },

  nearMeIcon: {
    fontSize: 18,
    marginRight: 8,
  },

  nearMeText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },

  searchButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f97316",
    borderRadius: 14,
    minHeight: 54,
    marginTop: 12,
  },

  searchButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },

  disabledNearMeButton: {
    opacity: 0.7,
  },

  browseButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 14,
    minHeight: 54,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },

  browseButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },

  featuredSection: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 35,
    backgroundColor: "#030712",
  },

  sectionEyebrow: {
    color: "#f97316",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },

  featuredTitle: {
    color: "#ffffff",
    fontSize: 25,
    fontWeight: "800",
    marginTop: 6,
  },

  featuredSubtitle: {
    color: "#9ca3af",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 7,
    marginBottom: 18,
  },

  featuredLoading: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },

  featuredLoadingText: {
    color: "#9ca3af",
    fontSize: 13,
    marginTop: 10,
  },

  noFeaturedText: {
    color: "#6b7280",
    fontSize: 13,
    textAlign: "center",
    paddingVertical: 25,
  },

  viewAllButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#374151",
    backgroundColor: "#111827",
    marginTop: 12,
  },

  viewAllButtonText: {
    color: "#f97316",
    fontSize: 14,
    fontWeight: "800",
  },
});

export default HomeScreen;