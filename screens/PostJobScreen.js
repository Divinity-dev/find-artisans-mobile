import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../context/AuthContext";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import LocationSelector from "../components/LocationSelector";
import ServiceSearch from "../components/ServiceSearch";

const PostJobScreen = ({ navigation }) => {
  // ==========================================
  // AUTH
  // ==========================================

  const {
    token,
    isAuthenticated,
  } = useAuth();

  // ==========================================
  // API
  // ==========================================

  const API_URL =
    process.env.EXPO_PUBLIC_API_URL;

  // ==========================================
  // FORM
  // ==========================================

  const [title, setTitle] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [state, setState] =
    useState("");

  const [city, setCity] =
    useState("");

  const [lga, setLga] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [budget, setBudget] =
    useState("");

  const [urgency, setUrgency] =
    useState("Normal");

  // ==========================================
  // IMAGES
  // ==========================================

  const [images, setImages] =
    useState([]);

  // ==========================================
  // UI
  // ==========================================

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // ==========================================
  // IMAGE PICKER
  // ==========================================

  const pickImages = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photos so you can add job images."
        );

        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsMultipleSelection: true,
          selectionLimit: 5,
          quality: 0.8,
        });

      if (result.canceled) {
        return;
      }

      const selectedImages =
        result.assets || [];

      if (selectedImages.length > 5) {
        Alert.alert(
          "Maximum Images",
          "You can upload a maximum of 5 images."
        );

        return;
      }

      setImages(selectedImages);
    } catch (error) {
      console.error(
        "Image picker error:",
        error
      );

      Alert.alert(
        "Error",
        "Unable to select images."
      );
    }
  };

  // ==========================================
  // REMOVE IMAGE
  // ==========================================

  const removeImage = (index) => {
    setImages((currentImages) =>
      currentImages.filter(
        (_, imageIndex) =>
          imageIndex !== index
      )
    );
  };

  // ==========================================
  // CLOUDINARY UPLOAD
  // ==========================================

  const uploadToCloudinary =
    async () => {
      if (!images.length) {
        return [];
      }

      const uploadedUrls = [];

      for (const image of images) {
        const formData =
          new FormData();

        formData.append(
          "file",
          {
            uri: image.uri,
            type:
              image.mimeType ||
              "image/jpeg",
            name:
              image.fileName ||
              `job-image-${Date.now()}.jpg`,
          }
        );

        formData.append(
          "upload_preset",
          process.env
            .EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET
        );

        const response =
          await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
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
              "Failed to upload image."
          );
        }

        if (data.secure_url) {
          uploadedUrls.push(
            data.secure_url
          );
        }
      }

      return uploadedUrls;
    };

  // ==========================================
  // VALIDATION
  // ==========================================

  const validateForm = () => {
    if (!title.trim()) {
      return "Job title is required.";
    }

    if (title.trim().length < 5) {
      return "Job title is too short.";
    }

    if (!category) {
      return "Please select a category.";
    }

    if (!description.trim()) {
      return "Job description is required.";
    }

    if (description.trim().length < 30) {
      return "Description should be at least 30 characters.";
    }

    if (!state) {
      return "State is required.";
    }

    if (!city) {
      return "City is required.";
    }

    if (!lga) {
      return "Local Government Area is required.";
    }

    if (!address.trim()) {
      return "Address is required.";
    }

    if (budget) {
      const numericBudget =
        Number(budget);

      if (
        Number.isNaN(numericBudget) ||
        numericBudget <= 0
      ) {
        return "Budget must be a positive number.";
      }
    }

    return null;
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    // ----------------------------------------
    // AUTH
    // ----------------------------------------

    if (!isAuthenticated || !token) {
      Alert.alert(
        "Login Required",
        "Please login before posting a job.",
        [
          {
            text: "Login",
            onPress: () =>
              navigation.navigate(
                "Login"
              ),
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]
      );

      return;
    }

    // ----------------------------------------
    // VALIDATION
    // ----------------------------------------

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      // ======================================
      // UPLOAD IMAGES
      // ======================================

      const imageUrls =
        await uploadToCloudinary();

      // ======================================
      // PAYLOAD
      // ======================================

      const payload = {
        title:
          title.trim(),

        category,

        description:
          description.trim(),

        budget:
          budget
            ? Number(budget)
            : null,

        location: {
          state,
          city,
          localGovernment: lga,
          address:
            address.trim(),
        },

        images:
          imageUrls,

        urgency,
      };

      // ======================================
      // CREATE JOB
      // ======================================

      const response =
        await fetch(
          `${API_URL}/jobs/create`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body:
              JSON.stringify(
                payload
              ),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to post job."
        );
      }

      // ======================================
      // SUCCESS
      // ======================================

      setSuccess(
        "Job posted successfully!"
      );

      Alert.alert(
        "Job Posted",
        "Your job has been posted successfully.",
        [
          {
            text: "View Dashboard",
            onPress: () =>
              navigation.navigate(
                "CustomerDashboard"
              ),
          },
        ]
      );
    } catch (error) {
      console.error(
        "Post job error:",
        error
      );

      setError(
        error.message ||
          "Failed to post job. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // NOT AUTHENTICATED
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
            You need to login before you
            can post a job.
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
            Post a Job
          </Text>

          <Text
            style={styles.subtitle}
          >
            Tell workers what you need
            and get responses quickly.
          </Text>
        </View>

        {/* ==================================
            FORM
        ================================== */}

        <View
          style={styles.card}
        >
          {/* ERROR */}

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

          {/* SUCCESS */}

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
              TITLE
          ================================== */}

          <View
            style={styles.field}
          >
            <Text
              style={styles.label}
            >
              Job Title
            </Text>

            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Need a plumber to fix leaking pipes"
              placeholderTextColor="#6b7280"
              style={styles.input}
            />
          </View>

          {/* ==================================
              CATEGORY
          ================================== */}

          <View
            style={styles.field}
          >
            <Text
              style={styles.label}
            >
              Category
            </Text>

         <ServiceSearch
  value={category}
  onServiceChange={setCategory}
/>
          </View>

          {/* ==================================
              DESCRIPTION
          ================================== */}

          <View
            style={styles.field}
          >
            <Text
              style={styles.label}
            >
              Job Description
            </Text>

            <TextInput
              value={description}
              onChangeText={
                setDescription
              }
              placeholder="Describe the work you need done..."
              placeholderTextColor="#6b7280"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              style={[
                styles.input,
                styles.textArea,
              ]}
            />

            <Text
              style={styles.helperText}
            >
              Minimum 30 characters
            </Text>
          </View>

          {/* ==================================
              IMAGES
          ================================== */}

          <View
            style={styles.field}
          >
            <View
              style={styles.labelRow}
            >
              <Text
                style={styles.label}
              >
                Job Images
              </Text>

              <Text
                style={styles.optional}
              >
                Optional · Max 5
              </Text>
            </View>

            <TouchableOpacity
              style={styles.imagePicker}
              onPress={pickImages}
            >
              <Ionicons
                name="images-outline"
                size={28}
                color="#f97316"
              />

              <Text
                style={
                  styles.imagePickerTitle
                }
              >
                Add Job Images
              </Text>

              <Text
                style={
                  styles.imagePickerText
                }
              >
                Show workers what needs to be done
              </Text>
            </TouchableOpacity>

            {images.length > 0 && (
              <View
                style={styles.imageGrid}
              >
                {images.map(
                  (image, index) => (
                    <View
                      key={image.uri}
                      style={
                        styles.imageWrapper
                      }
                    >
                      <Image
                        source={{
                          uri: image.uri,
                        }}
                        style={
                          styles.previewImage
                        }
                      />

                      <TouchableOpacity
                        style={
                          styles.removeImageButton
                        }
                        onPress={() =>
                          removeImage(index)
                        }
                      >
                        <Ionicons
                          name="close"
                          size={16}
                          color="#ffffff"
                        />
                      </TouchableOpacity>
                    </View>
                  )
                )}
              </View>
            )}
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
              selectedLocation={{
                state,
                city,
                lga,
              }}
              onLocationChange={(
                location
              ) => {
                setState(
                  location.state
                );

                setCity(
                  location.city
                );

                setLga(
                  location.lga
                );
              }}
            />
          </View>

          {/* ==================================
              ADDRESS
          ================================== */}

          <View
            style={styles.field}
          >
            <Text
              style={styles.label}
            >
              Address
            </Text>

            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="Enter detailed address or nearby landmark"
              placeholderTextColor="#6b7280"
              style={styles.input}
            />
          </View>

          {/* ==================================
              BUDGET
          ================================== */}

          <View
            style={styles.field}
          >
            <Text
              style={styles.label}
            >
              Budget (₦)
            </Text>

            <TextInput
              value={budget}
              onChangeText={setBudget}
              placeholder="50000"
              placeholderTextColor="#6b7280"
              keyboardType="numeric"
              style={styles.input}
            />
          </View>

          {/* ==================================
              URGENCY
          ================================== */}

          <View
            style={styles.field}
          >
            <Text
              style={styles.label}
            >
              Urgency
            </Text>

            <View
              style={
                styles.urgencyContainer
              }
            >
              {[
                "Normal",
                "Urgent",
                "Very Urgent",
              ].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.urgencyButton,
                    urgency === option &&
                      styles.selectedUrgency,
                  ]}
                  onPress={() =>
                    setUrgency(option)
                  }
                >
                  <Text
                    style={[
                      styles.urgencyText,
                      urgency === option &&
                        styles.selectedUrgencyText,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ==================================
              SUBMIT
          ================================== */}

          <TouchableOpacity
            style={[
              styles.submitButton,
              loading &&
                styles.disabledButton,
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <ActivityIndicator
                  size="small"
                  color="#ffffff"
                />

                <Text
                  style={
                    styles.submitButtonText
                  }
                >
                  Posting Job...
                </Text>
              </>
            ) : (
              <>
                <Ionicons
                  name="add-circle-outline"
                  size={20}
                  color="#ffffff"
                />

                <Text
                  style={
                    styles.submitButtonText
                  }
                >
                  Post Job
                </Text>
              </>
            )}
          </TouchableOpacity>
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

export default PostJobScreen;

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
    padding: 20,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 20,
  },

  // ========================================
  // FIELD
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

  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  optional: {
    marginBottom: 8,
    color: "#6b7280",
    fontSize: 12,
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

  helperText: {
    marginTop: 6,
    color: "#6b7280",
    fontSize: 11,
  },

  // ========================================
  // IMAGES
  // ========================================

  imagePicker: {
    minHeight: 125,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#374151",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
  },

  imagePickerTitle: {
    marginTop: 8,
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },

  imagePickerText: {
    marginTop: 4,
    color: "#6b7280",
    fontSize: 11,
    textAlign: "center",
  },

  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12,
  },

  imageWrapper: {
    width: "30%",
    height: 90,
    position: "relative",
  },

  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },

  removeImageButton: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#ef4444",
    alignItems: "center",
    justifyContent: "center",
  },

  // ========================================
  // URGENCY
  // ========================================

  urgencyContainer: {
    flexDirection: "row",
    gap: 8,
  },

  urgencyButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#374151",
    backgroundColor: "#030712",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },

  selectedUrgency: {
    backgroundColor: "#f97316",
    borderColor: "#f97316",
  },

  urgencyText: {
    color: "#9ca3af",
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },

  selectedUrgencyText: {
    color: "#ffffff",
  },

  // ========================================
  // SUBMIT
  // ========================================

  submitButton: {
    minHeight: 52,
    borderRadius: 12,
    backgroundColor: "#f97316",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },

  disabledButton: {
    opacity: 0.6,
  },

  submitButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },

  // ========================================
  // MESSAGES
  // ========================================

  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#450a0a",
    borderWidth: 1,
    borderColor: "#7f1d1d",
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },

  errorText: {
    flex: 1,
    marginLeft: 8,
    color: "#fca5a5",
    fontSize: 13,
    lineHeight: 19,
  },

  successBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#052e16",
    borderWidth: 1,
    borderColor: "#166534",
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },

  successText: {
    flex: 1,
    marginLeft: 8,
    color: "#86efac",
    fontSize: 13,
  },

  // ========================================
  // CENTER
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