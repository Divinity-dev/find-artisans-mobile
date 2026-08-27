import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

import { State, City } from "country-state-city";
import NaijaStates from "naija-state-local-government";

import { useAuth } from "../context/AuthContext";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LocationSelector from "../components/LocationSelector";

const CustomerProfileEditScreen = ({ navigation }) => {
  // ==========================================
  // AUTH
  // ==========================================

  const { user, token, isAuthenticated } = useAuth();

  // ==========================================
  // API
  // ==========================================

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  // ==========================================
  // UI STATE
  // ==========================================

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingId, setUploadingId] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // FORM DATA
  // ==========================================

  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
    profilePhoto: "",
    nin: "",

    location: {
      state: "",
      city: "",
      localGovernment: "",
    },

    verification: {
      ninStatus: "unverified",
      governmentId: "",
      isVerified: false,
    },
  });

  // ==========================================
  // FETCH PROFILE
  // ==========================================

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/users/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to load profile."
        );
      }

      const fetchedUser =
        data?.data ||
        data?.user ||
        data;

      setFormData({
        fullName: fetchedUser?.fullName || "",

        bio: fetchedUser?.bio || "",

        profilePhoto:
          fetchedUser?.profilePhoto || "",

        nin:
          fetchedUser?.verification?.nin || "",

        location: {
          state:
            fetchedUser?.location?.state || "",

          city:
            fetchedUser?.location?.city || "",

          localGovernment:
            fetchedUser?.location?.localGovernment || "",
        },

        verification: {
          ninStatus:
            fetchedUser?.verification?.ninStatus ||
            "unverified",

          governmentId:
            fetchedUser?.verification?.governmentId || "",

          isVerified:
            fetchedUser?.verification?.isVerified ||
            false,
        },
      });
    } catch (error) {
      console.log("Fetch profile error:", error);

      setError(
        error.message ||
          "Failed to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD PROFILE
  // ==========================================

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  // ==========================================
  // STATES
  // ==========================================

  const states = useMemo(() => {
    return State.getStatesOfCountry("NG");
  }, []);

  // ==========================================
  // CITIES
  // ==========================================

  const cities = useMemo(() => {
    if (!formData.location.state) {
      return [];
    }

    const selectedState = states.find(
      (state) =>
        state.name === formData.location.state
    );

    if (!selectedState) {
      return [];
    }

    return City.getCitiesOfState(
      "NG",
      selectedState.isoCode
    );
  }, [
    formData.location.state,
    states,
  ]);

  // ==========================================
  // LOCAL GOVERNMENTS
  // ==========================================

  const localGovernments = useMemo(() => {
    if (!formData.location.state) {
      return [];
    }

    try {
      const result = NaijaStates.lgas(
        formData.location.state
      );

      if (Array.isArray(result)) {
        return result;
      }

      if (Array.isArray(result?.lgas)) {
        return result.lgas;
      }

      return [];
    } catch (error) {
      console.log(
        "LGA error:",
        error
      );

      return [];
    }
  }, [formData.location.state]);

  // ==========================================
  // HANDLE BASIC CHANGE
  // ==========================================

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // HANDLE LOCATION CHANGE
  // ==========================================

  const handleStateChange = (value) => {
    setFormData((prev) => ({
      ...prev,

      location: {
        state: value,
        city: "",
        localGovernment: "",
      },
    }));
  };

  const handleCityChange = (value) => {
    setFormData((prev) => ({
      ...prev,

      location: {
        ...prev.location,
        city: value,
        localGovernment: "",
      },
    }));
  };

  const handleLgaChange = (value) => {
    setFormData((prev) => ({
      ...prev,

      location: {
        ...prev.location,
        localGovernment: value,
      },
    }));
  };

  // ==========================================
  // PICK PROFILE IMAGE
  // ==========================================

  const pickProfileImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photos so you can change your profile photo."
        );

        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

      if (result.canceled) {
        return;
      }

      const image = result.assets?.[0];

      if (!image) {
        return;
      }

      await uploadProfilePhoto(image);
    } catch (error) {
      console.log(
        "Image picker error:",
        error
      );

      setError(
        "Unable to select profile photo."
      );
    }
  };

  // ==========================================
  // UPLOAD PROFILE PHOTO
  // ==========================================

  const uploadProfilePhoto = async (image) => {
    try {
      setUploadingImage(true);
      setError("");
      setSuccess("");

      const formData = new FormData();

      formData.append("file", {
        uri: image.uri,
        type:
          image.mimeType ||
          "image/jpeg",
        name:
          image.fileName ||
          `profile-${Date.now()}.jpg`,
      });

      formData.append(
        "upload_preset",
        process.env
          .EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET
      );

      const cloudName =
        process.env
          .EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error?.message ||
            "Image upload failed."
        );
      }

      if (!data?.secure_url) {
        throw new Error(
          "Cloudinary did not return an image URL."
        );
      }

      setFormData((prev) => ({
        ...prev,
        profilePhoto:
          data.secure_url,
      }));

      setSuccess(
        "Profile photo uploaded successfully."
      );
    } catch (error) {
      console.log(
        "Profile photo upload error:",
        error
      );

      setError(
        error.message ||
          "Failed to upload profile photo."
      );
    } finally {
      setUploadingImage(false);
    }
  };

  // ==========================================
  // PICK GOVERNMENT ID
  // ==========================================

  const pickGovernmentId = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photos so you can upload your government ID."
        );

        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: false,
          quality: 0.8,
        });

      if (result.canceled) {
        return;
      }

      const image = result.assets?.[0];

      if (!image) {
        return;
      }

      await uploadGovernmentId(image);
    } catch (error) {
      console.log(
        "Government ID picker error:",
        error
      );

      setError(
        "Unable to select government ID."
      );
    }
  };

  // ==========================================
  // UPLOAD GOVERNMENT ID
  // ==========================================

  const uploadGovernmentId = async (image) => {
    try {
      setUploadingId(true);
      setError("");
      setSuccess("");

      const formData = new FormData();

      formData.append("document", {
        uri: image.uri,
        type:
          image.mimeType ||
          "image/jpeg",
        name:
          image.fileName ||
          `government-id-${Date.now()}.jpg`,
      });

      const response = await fetch(
        `${API_URL}/verification/upload-id`,
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },

          body: formData,
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to upload government ID."
        );
      }

      const uploadedDocument =
        data?.imageUrl ||
        data?.data?.imageUrl ||
        data?.secure_url ||
        data?.data?.secure_url ||
        data?.url ||
        data?.data?.url;

      if (!uploadedDocument) {
        throw new Error(
          "The server did not return the uploaded document."
        );
      }

      setFormData((prev) => ({
        ...prev,

        verification: {
          ...prev.verification,

          governmentId:
            uploadedDocument,
        },
      }));

      setSuccess(
        "Government ID uploaded successfully."
      );
    } catch (error) {
      console.log(
        "Government ID upload error:",
        error
      );

      setError(
        error.message ||
          "Failed to upload government ID."
      );
    } finally {
      setUploadingId(false);
    }
  };

  // ==========================================
  // SAVE PROFILE
  // ==========================================

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        fullName:
          formData.fullName.trim(),

        bio:
          formData.bio.trim(),

        profilePhoto:
          formData.profilePhoto,

        location: {
          state:
            formData.location.state,

          city:
            formData.location.city,

          localGovernment:
            formData.location.localGovernment,
        },
      };

      const response = await fetch(
        `${API_URL}/users/me`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify(
            payload
          ),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to update profile."
        );
      }

      setSuccess(
        "Profile updated successfully."
      );

      Alert.alert(
        "Success",
        "Your profile has been updated successfully."
      );
    } catch (error) {
      console.log(
        "Update profile error:",
        error
      );

      setError(
        error.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // SUBMIT VERIFICATION
  // ==========================================

  const submitVerification = async () => {
    try {
      setError("");
      setSuccess("");

      if (!formData.nin.trim()) {
        setError(
          "Please enter your NIN."
        );

        return;
      }

      if (
        !formData.verification
          .governmentId
      ) {
        setError(
          "Please upload a government ID first."
        );

        return;
      }

      setSaving(true);

      const payload = {
        nin:
          formData.nin.trim(),

        governmentId:
          formData.verification
            .governmentId,
      };

      const response = await fetch(
        `${API_URL}/verification`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify(
            payload
          ),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Verification submission failed."
        );
      }

      setFormData((prev) => ({
        ...prev,

        verification: {
          ...prev.verification,
          ninStatus: "pending",
        },
      }));

      setSuccess(
        "Verification submitted successfully."
      );

      Alert.alert(
        "Verification Submitted",
        "Your identity verification has been submitted and is awaiting review."
      );
    } catch (error) {
      console.log(
        "Verification error:",
        error
      );

      setError(
        error.message ||
          "Verification submission failed."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOGIN REQUIRED
  // ==========================================

  if (!isAuthenticated) {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <Navbar />

        <View
          style={styles.centerContainer}
        >
          <Ionicons
            name="lock-closed-outline"
            size={50}
            color="#4b5563"
          />

          <Text
            style={styles.centerTitle}
          >
            Login Required
          </Text>

          <Text
            style={styles.centerText}
          >
            You need to login before
            you can edit your profile.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() =>
              navigation.navigate(
                "Login"
              )
            }
          >
            <Text
              style={
                styles.primaryButtonText
              }
            >
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ==========================================
  // LOADING
  // ==========================================

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
            Loading profile...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ==========================================
  // RENDER
  // ==========================================

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
            HEADER
        ================================== */}

        <View
          style={styles.header}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() =>
              navigation.goBack()
            }
          >
            <Ionicons
              name="arrow-back"
              size={20}
              color="#ffffff"
            />
          </TouchableOpacity>

          <Text
            style={styles.title}
          >
            Edit Profile
          </Text>

          <Text
            style={styles.subtitle}
          >
            Update your information
            and complete your identity
            verification.
          </Text>
        </View>

        {/* ==================================
            ERROR
        ================================== */}

        {error ? (
          <View
            style={styles.errorBox}
          >
            <Ionicons
              name="alert-circle-outline"
              size={20}
              color="#f87171"
            />

            <Text
              style={styles.errorText}
            >
              {error}
            </Text>
          </View>
        ) : null}

        {/* ==================================
            SUCCESS
        ================================== */}

        {success ? (
          <View
            style={styles.successBox}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color="#4ade80"
            />

            <Text
              style={styles.successText}
            >
              {success}
            </Text>
          </View>
        ) : null}

        {/* ==================================
            PROFILE
        ================================== */}

        <View
          style={styles.card}
        >
          {/* PROFILE PHOTO */}

          <View
            style={styles.profileSection}
          >
            <View
              style={styles.imageContainer}
            >
              <Image
                source={{
                  uri:
                    formData.profilePhoto ||
                    "https://via.placeholder.com/300",
                }}
                style={styles.profileImage}
              />

              <TouchableOpacity
                style={
                  styles.cameraButton
                }
                onPress={
                  pickProfileImage
                }
                disabled={
                  uploadingImage
                }
              >
                {uploadingImage ? (
                  <ActivityIndicator
                    size="small"
                    color="#ffffff"
                  />
                ) : (
                  <Ionicons
                    name="camera"
                    size={20}
                    color="#ffffff"
                  />
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={
                pickProfileImage
              }
              disabled={
                uploadingImage
              }
            >
              <Text
                style={
                  styles.changePhotoText
                }
              >
                Change Photo
              </Text>
            </TouchableOpacity>
          </View>

          {/* ==================================
              FULL NAME
          ================================== */}

          <View
            style={styles.field}
          >
            <Text
              style={styles.label}
            >
              Full Name
            </Text>

            <TextInput
              value={
                formData.fullName
              }
              onChangeText={(value) =>
                handleChange(
                  "fullName",
                  value
                )
              }
              placeholder="Your full name"
              placeholderTextColor="#6b7280"
              style={styles.input}
            />
          </View>

          {/* ==================================
              LOCATION
          ================================== */}

          <View
            style={styles.field}
          >
            <Text
              style={styles.label}
            >
              Location
            </Text>

            <LocationSelector
              state={
                formData.location.state
              }
              city={
                formData.location.city
              }
              lga={
                formData.location
                  .localGovernment
              }
              onStateChange={
                handleStateChange
              }
              onCityChange={
                handleCityChange
              }
              onLgaChange={
                handleLgaChange
              }
            />
          </View>

          {/* ==================================
              ABOUT
          ================================== */}

          <View
            style={styles.field}
          >
            <Text
              style={styles.label}
            >
              About You
            </Text>

            <TextInput
              value={formData.bio}
              onChangeText={(value) =>
                handleChange(
                  "bio",
                  value
                )
              }
              placeholder="Tell workers a little about yourself..."
              placeholderTextColor="#6b7280"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              style={[
                styles.input,
                styles.textArea,
              ]}
            />
          </View>

          {/* ==================================
              SAVE
          ================================== */}

          <TouchableOpacity
            style={[
              styles.saveButton,
              saving &&
                styles.disabledButton,
            ]}
            onPress={handleSubmit}
            disabled={
              saving ||
              uploadingImage ||
              uploadingId
            }
          >
            {saving ? (
              <ActivityIndicator
                size="small"
                color="#ffffff"
              />
            ) : (
              <Ionicons
                name="save-outline"
                size={20}
                color="#ffffff"
              />
            )}

            <Text
              style={
                styles.saveButtonText
              }
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ==================================
            VERIFICATION
        ================================== */}

        <View
          style={styles.card}
        >
          <View
            style={
              styles.verificationHeader
            }
          >
            <View
              style={
                styles.verificationIcon
              }
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={24}
                color="#22c55e"
              />
            </View>

            <View
              style={
                styles.verificationHeaderText
              }
            >
              <Text
                style={
                  styles.sectionTitle
                }
              >
                Identity Verification
              </Text>

              <Text
                style={
                  styles.sectionSubtitle
                }
              >
                Verify your identity
                using your NIN and
                Government ID.
              </Text>
            </View>
          </View>

          {/* NIN */}

          <View
            style={styles.field}
          >
            <Text
              style={styles.label}
            >
              NIN Number
            </Text>

            <TextInput
              value={formData.nin}
              onChangeText={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  nin: value,
                }))
              }
              placeholder="Enter your NIN"
              placeholderTextColor="#6b7280"
              keyboardType="numeric"
              maxLength={11}
              style={styles.input}
            />

            {/* STATUS */}

            <View
              style={styles.statusRow}
            >
              {formData.verification
                .ninStatus ===
              "verified" ? (
                <>
                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color="#22c55e"
                  />

                  <Text
                    style={
                      styles.verifiedText
                    }
                  >
                    Verified
                  </Text>
                </>
              ) : formData
                  .verification
                  .ninStatus ===
                "pending" ? (
                <>
                  <Ionicons
                    name="time-outline"
                    size={18}
                    color="#facc15"
                  />

                  <Text
                    style={
                      styles.pendingText
                    }
                  >
                    Pending Verification
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons
                    name="alert-circle-outline"
                    size={18}
                    color="#f87171"
                  />

                  <Text
                    style={
                      styles.notVerifiedText
                    }
                  >
                    Not Verified
                  </Text>
                </>
              )}
            </View>
          </View>

          {/* GOVERNMENT ID */}

          <View
            style={styles.field}
          >
            <Text
              style={styles.label}
            >
              Government ID
            </Text>

            <TouchableOpacity
              style={
                styles.uploadBox
              }
              onPress={
                pickGovernmentId
              }
              disabled={
                uploadingId
              }
            >
              <View
                style={
                  styles.uploadIcon
                }
              >
                {uploadingId ? (
                  <ActivityIndicator
                    size="small"
                    color="#f97316"
                  />
                ) : (
                  <Ionicons
                    name="id-card-outline"
                    size={25}
                    color="#f97316"
                  />
                )}
              </View>

              <View
                style={
                  styles.uploadContent
                }
              >
                <Text
                  style={
                    styles.uploadTitle
                  }
                >
                  {uploadingId
                    ? "Uploading..."
                    : formData
                        .verification
                        .governmentId
                    ? "Government ID Uploaded"
                    : "Upload Government ID"}
                </Text>

                <Text
                  style={
                    styles.uploadSubtitle
                  }
                >
                  {formData
                    .verification
                    .governmentId
                    ? "Document ready for verification"
                    : "Tap here to select an ID image"}
                </Text>
              </View>

              <Ionicons
                name={
                  formData
                    .verification
                    .governmentId
                    ? "checkmark-circle"
                    : "cloud-upload-outline"
                }
                size={22}
                color={
                  formData
                    .verification
                    .governmentId
                    ? "#22c55e"
                    : "#9ca3af"
                }
              />
            </TouchableOpacity>
          </View>

          {/* SUBMIT VERIFICATION */}

          <TouchableOpacity
            style={[
              styles.verifyButton,
              saving &&
                styles.disabledButton,
            ]}
            onPress={
              submitVerification
            }
            disabled={
              saving ||
              uploadingId
            }
          >
            {saving ? (
              <ActivityIndicator
                size="small"
                color="#ffffff"
              />
            ) : (
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color="#ffffff"
              />
            )}

            <Text
              style={
                styles.verifyButtonText
              }
            >
              {saving
                ? "Submitting..."
                : "Submit for Verification"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ==================================
            WHY VERIFY
        ================================== */}

        <View
          style={styles.infoBox}
        >
          <Ionicons
            name="information-circle-outline"
            size={24}
            color="#facc15"
          />

          <View
            style={styles.infoContent}
          >
            <Text
              style={styles.infoTitle}
            >
              Why verify your identity?
            </Text>

            <Text
              style={styles.infoText}
            >
              Verified customers can
              build more trust with
              workers and may receive
              faster responses to their
              jobs.
            </Text>
          </View>
        </View>

        {/* ==================================
            FOOTER
        ================================== */}

        <Footer
          onHome={() =>
            navigation.navigate(
              "Home"
            )
          }
          onWorkers={() =>
            navigation.navigate(
              "Workers"
            )
          }
          onRegister={() =>
            navigation.navigate(
              "Register"
            )
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CustomerProfileEditScreen;

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030712",
  },

  content: {
    paddingBottom: 30,
  },

  // ========================================
  // HEADER
  // ========================================

  header: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 18,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
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
  // CARD
  // ========================================

  card: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 20,
  },

  // ========================================
  // PROFILE
  // ========================================

  profileSection: {
    alignItems: "center",
    marginBottom: 25,
  },

  imageContainer: {
    position: "relative",
  },

  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#030712",
    borderWidth: 2,
    borderColor: "#1f2937",
  },

  cameraButton: {
    position: "absolute",
    right: 2,
    bottom: 2,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#f97316",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#111827",
  },

  changePhotoText: {
    marginTop: 12,
    color: "#f97316",
    fontSize: 14,
    fontWeight: "600",
  },

  // ========================================
  // FIELDS
  // ========================================

  field: {
    marginBottom: 20,
  },

  label: {
    marginBottom: 8,
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },

  input: {
    minHeight: 48,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#030712",
    borderWidth: 1,
    borderColor: "#1f2937",
    color: "#ffffff",
    fontSize: 14,
  },

  textArea: {
    minHeight: 130,
    paddingTop: 14,
  },

  // ========================================
  // SAVE BUTTON
  // ========================================

  saveButton: {
    minHeight: 52,
    borderRadius: 12,
    backgroundColor: "#f97316",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },

  saveButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },

  disabledButton: {
    opacity: 0.6,
  },

  // ========================================
  // VERIFICATION
  // ========================================

  verificationHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 25,
  },

  verificationIcon: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: "#052e16",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  verificationHeaderText: {
    flex: 1,
  },

  sectionTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
  },

  sectionSubtitle: {
    marginTop: 5,
    color: "#9ca3af",
    fontSize: 13,
    lineHeight: 19,
  },

  // ========================================
  // STATUS
  // ========================================

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 6,
  },

  verifiedText: {
    color: "#22c55e",
    fontSize: 13,
    fontWeight: "600",
  },

  pendingText: {
    color: "#facc15",
    fontSize: 13,
    fontWeight: "600",
  },

  notVerifiedText: {
    color: "#f87171",
    fontSize: 13,
    fontWeight: "600",
  },

  // ========================================
  // ID UPLOAD
  // ========================================

  uploadBox: {
    minHeight: 85,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#030712",
    borderWidth: 1,
    borderColor: "#1f2937",
    flexDirection: "row",
    alignItems: "center",
  },

  uploadIcon: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: "#431407",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  uploadContent: {
    flex: 1,
  },

  uploadTitle: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
  },

  uploadSubtitle: {
    marginTop: 4,
    color: "#6b7280",
    fontSize: 11,
    lineHeight: 16,
  },

  // ========================================
  // VERIFY BUTTON
  // ========================================

  verifyButton: {
    minHeight: 52,
    borderRadius: 12,
    backgroundColor: "#22c55e",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },

  verifyButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },

  // ========================================
  // INFO
  // ========================================

  infoBox: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 18,
    borderRadius: 18,
    backgroundColor: "#422006",
    borderWidth: 1,
    borderColor: "#854d0e",
    flexDirection: "row",
    alignItems: "flex-start",
  },

  infoContent: {
    flex: 1,
    marginLeft: 12,
  },

  infoTitle: {
    color: "#facc15",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 6,
  },

  infoText: {
    color: "#d1d5db",
    fontSize: 13,
    lineHeight: 20,
  },

  // ========================================
  // MESSAGES
  // ========================================

  errorBox: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#450a0a",
    borderWidth: 1,
    borderColor: "#7f1d1d",
    flexDirection: "row",
    alignItems: "center",
  },

  errorText: {
    flex: 1,
    marginLeft: 8,
    color: "#fca5a5",
    fontSize: 13,
    lineHeight: 19,
  },

  successBox: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#052e16",
    borderWidth: 1,
    borderColor: "#166534",
    flexDirection: "row",
    alignItems: "center",
  },

  successText: {
    flex: 1,
    marginLeft: 8,
    color: "#86efac",
    fontSize: 13,
    lineHeight: 19,
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
  // LOGIN
  // ========================================

  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  centerTitle: {
    marginTop: 14,
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },

  centerText: {
    marginTop: 8,
    color: "#6b7280",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },

  primaryButton: {
    minHeight: 46,
    marginTop: 20,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: "#f97316",
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
});