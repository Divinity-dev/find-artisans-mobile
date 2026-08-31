import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

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
import * as ImageManipulator from "expo-image-manipulator";

import * as FileSystem from "expo-file-system/legacy";

import { Ionicons } from "@expo/vector-icons";

import { State, City } from "country-state-city";
import NaijaStates from "naija-state-local-government";

import { useAuth } from "../context/AuthContext";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LocationSelector from "../components/LocationSelector";


// ============================================================
// COMPONENT
// ============================================================

const CustomerProfileEditScreen = ({ navigation }) => {

  // ============================================================
  // AUTH
  // ============================================================

  const {
    user,
    token,
    isAuthenticated,
  } = useAuth();


  // ============================================================
  // API
  // ============================================================

  const API_URL =
    process.env.EXPO_PUBLIC_API_URL;

  const CLOUD_NAME =
    process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;

  const CLOUDINARY_PRESET =
    process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;


  // ============================================================
  // LOADING STATES
  // ============================================================

  const [loading, setLoading] =
    useState(true);

  const [savingProfile, setSavingProfile] =
    useState(false);

  const [uploadingProfilePhoto, setUploadingProfilePhoto] =
    useState(false);

  const [uploadingGovernmentId, setUploadingGovernmentId] =
    useState(false);

  const [submittingVerification, setSubmittingVerification] =
    useState(false);


  // ============================================================
  // MESSAGES
  // ============================================================

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // ============================================================
  // GOVERNMENT ID PREVIEW
  // ============================================================

  const [governmentIdPreview, setGovernmentIdPreview] =
    useState("");


  // ============================================================
  // PROFILE FORM
  // ============================================================

  const [formData, setFormData] =
    useState({
      fullName: "",
      bio: "",
      profilePhoto: "",

      location: {
        state: "",
        city: "",
        localGovernment: "",
      },
    });


  // ============================================================
  // VERIFICATION FORM
  // ============================================================

  const [verificationData, setVerificationData] =
    useState({
      nin: "",
      governmentId: "",
      ninStatus: "unverified",
      isVerified: false,
    });


  // ============================================================
  // CLEAR MESSAGES
  // ============================================================

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };


  // ============================================================
  // FETCH PROFILE
  // ============================================================

  const fetchProfile = async () => {
    try {
      setLoading(true);

      clearMessages();

      const response =
        await fetch(
          `${API_URL}/users/me`,
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      const data =
        await response.json();


      console.log(
        "PROFILE RESPONSE:",
        data
      );


      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to load profile."
        );
      }


      const fetchedUser =
        data?.data ||
        data?.user ||
        data;


      // ======================================================
      // PROFILE
      // ======================================================

      setFormData({
        fullName:
          fetchedUser?.fullName ||
          "",

        bio:
          fetchedUser?.about ||
          "",

        profilePhoto:
          fetchedUser?.profilePhoto ||
          "",

        location: {
          state:
            fetchedUser?.location?.state ||
            "",

          city:
            fetchedUser?.location?.city ||
            "",

          localGovernment:
            fetchedUser?.location?.localGovernment ||
            "",
        },
      });


      // ======================================================
      // VERIFICATION
      // ======================================================

      const verification =
        fetchedUser?.verification ||
        {};


      setVerificationData({
        nin:
          verification?.nin ||
          "",

        governmentId:
          verification?.governmentId ||
          "",

        ninStatus:
          verification?.ninStatus ||
          (
            verification?.isVerified
              ? "verified"
              : "unverified"
          ),

        isVerified:
          verification?.isVerified ||
          false,
      });


      // ======================================================
      // GOVERNMENT ID PREVIEW
      // ======================================================

      if (
        verification?.governmentId
      ) {
        setGovernmentIdPreview(
          verification.governmentId
        );
      }

    } catch (error) {

      console.log(
        "FETCH PROFILE ERROR:",
        error
      );

      setError(
        error?.message ||
          "Failed to load profile."
      );

    } finally {

      setLoading(false);
    }
  };


  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {

    if (
      isAuthenticated &&
      token
    ) {
      fetchProfile();
    } else {
      setLoading(false);
    }

  }, [
    isAuthenticated,
    token,
  ]);


  // ============================================================
  // STATES
  // ============================================================

  const states = useMemo(() => {

    return State.getStatesOfCountry(
      "NG"
    );

  }, []);


  // ============================================================
  // CITIES
  // ============================================================

  const cities = useMemo(() => {

    if (
      !formData.location.state
    ) {
      return [];
    }


    const selectedState =
      states.find(
        (state) =>
          state.name ===
          formData.location.state
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


  // ============================================================
  // LOCAL GOVERNMENTS
  // ============================================================

  const localGovernments =
    useMemo(() => {

      if (
        !formData.location.state
      ) {
        return [];
      }


      try {

        const result =
          NaijaStates.lgas(
            formData.location.state
          );


        if (
          Array.isArray(result)
        ) {
          return result;
        }


        if (
          Array.isArray(
            result?.lgas
          )
        ) {
          return result.lgas;
        }


        return [];

      } catch (error) {

        console.log(
          "LGA ERROR:",
          error
        );

        return [];
      }

    }, [
      formData.location.state,
    ]);


  // ============================================================
  // PROFILE FIELD CHANGE
  // ============================================================

  const handleProfileChange = (
    field,
    value
  ) => {

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


  // ============================================================
  // LOCATION
  // ============================================================

  const handleStateChange = (
    value
  ) => {

    setFormData((prev) => ({
      ...prev,

      location: {
        state: value,
        city: "",
        localGovernment: "",
      },
    }));
  };


  const handleCityChange = (
    value
  ) => {

    setFormData((prev) => ({
      ...prev,

      location: {
        ...prev.location,
        city: value,
        localGovernment: "",
      },
    }));
  };


  const handleLgaChange = (
    value
  ) => {

    setFormData((prev) => ({
      ...prev,

      location: {
        ...prev.location,
        localGovernment: value,
      },
    }));
  };


  // ============================================================
  // IMAGE PERMISSION
  // ============================================================

  const requestImagePermission =
    async () => {

      const permission =
        await ImagePicker
          .requestMediaLibraryPermissionsAsync();


      if (!permission.granted) {

        Alert.alert(
          "Permission Required",
          "Please allow access to your photos."
        );

        return false;
      }


      return true;
    };


  // ============================================================
  // PICK PROFILE PHOTO
  // ============================================================

  const pickProfilePhoto =
    async () => {

      try {

        const allowed =
          await requestImagePermission();


        if (!allowed) {
          return;
        }


        const result =
          await ImagePicker
            .launchImageLibraryAsync({
              mediaTypes: ["images"],

              allowsEditing: true,

              aspect: [1, 1],

              quality: 0.8,
            });


        console.log(
          "PROFILE IMAGE PICKER RESULT:",
          result
        );


        if (
          result.canceled
        ) {
          return;
        }


        const image =
          result.assets?.[0];


        if (!image?.uri) {

          throw new Error(
            "Could not read the selected image."
          );
        }


        await uploadProfilePhoto(
          image
        );

      } catch (error) {

        console.log(
          "PICK PROFILE PHOTO ERROR:",
          error
        );

        setError(
          error?.message ||
            "Unable to select profile photo."
        );
      }
    };


  // ============================================================
  // UPLOAD PROFILE PHOTO
  //
  // IMPORTANT:
  // We DO NOT use FormData here.
  //
  // FileSystem.uploadAsync handles multipart
  // upload natively in Expo.
  // ============================================================

  const uploadProfilePhoto =
    async (image) => {

      try {

        setUploadingProfilePhoto(
          true
        );

        clearMessages();


        if (!image?.uri) {

          throw new Error(
            "No image selected."
          );
        }


        if (
          !CLOUD_NAME ||
          !CLOUDINARY_PRESET
        ) {

          throw new Error(
            "Cloudinary configuration is missing."
          );
        }


        // ======================================================
        // CONVERT IMAGE TO JPEG
        // ======================================================

        const manipulated =
          await ImageManipulator
            .manipulateAsync(
              image.uri,
              [],
              {
                compress: 0.8,

                format:
                  ImageManipulator
                    .SaveFormat
                    .JPEG,
              }
            );


        console.log(
          "PROFILE IMAGE READY:",
          manipulated.uri
        );


        // ======================================================
        // CLOUDINARY URL
        // ======================================================

        const cloudinaryUrl =
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;


        console.log(
          "UPLOADING PROFILE PHOTO TO CLOUDINARY..."
        );


        // ======================================================
        // NATIVE MULTIPART UPLOAD
        // ======================================================

        const uploadResult =
          await FileSystem.uploadAsync(
            cloudinaryUrl,

            manipulated.uri,

            {
              httpMethod: "POST",

              uploadType:
                FileSystem.FileSystemUploadType
                  .MULTIPART,

              fieldName: "file",

              mimeType:
                "image/jpeg",

              parameters: {
                upload_preset:
                  CLOUDINARY_PRESET,
              },
            }
          );


        console.log(
          "PROFILE CLOUDINARY STATUS:",
          uploadResult.status
        );

        console.log(
          "PROFILE CLOUDINARY BODY:",
          uploadResult.body
        );


        if (
          uploadResult.status < 200 ||
          uploadResult.status >= 300
        ) {

          let cloudinaryError;

          try {
            cloudinaryError =
              JSON.parse(
                uploadResult.body
              );
          } catch {
            cloudinaryError = null;
          }


          throw new Error(
            cloudinaryError
              ?.error
              ?.message ||
              "Profile photo upload failed."
          );
        }


        // ======================================================
        // PARSE CLOUDINARY RESPONSE
        // ======================================================

        let data;

        try {

          data =
            JSON.parse(
              uploadResult.body
            );

        } catch (error) {

          console.log(
            "CLOUDINARY JSON PARSE ERROR:",
            error
          );

          throw new Error(
            "Cloudinary returned an invalid response."
          );
        }


        console.log(
          "PROFILE CLOUDINARY RESPONSE:",
          data
        );


        if (
          !data?.secure_url
        ) {

          throw new Error(
            "Cloudinary did not return an image URL."
          );
        }


        // ======================================================
        // SAVE URL LOCALLY
        // ======================================================

        setFormData((prev) => ({
          ...prev,

          profilePhoto:
            data.secure_url,
        }));


        setSuccess(
          "Profile photo uploaded. Press Save Changes to update your profile."
        );

      } catch (error) {

        console.log(
          "PROFILE PHOTO UPLOAD ERROR:",
          error
        );

        setError(
          error?.message ||
            "Failed to upload profile photo."
        );

      } finally {

        setUploadingProfilePhoto(
          false
        );
      }
    };


  // ============================================================
  // SAVE PROFILE
  //
  // ONLY PROFILE DATA.
  //
  // NO NIN
  // NO GOVERNMENT ID
  // NO VERIFICATION
  // ============================================================

  const handleSubmit =
    async () => {

      try {

        setSavingProfile(true);

        clearMessages();


        const payload = {

          fullName:
            formData.fullName.trim(),

          about:
            formData.bio.trim(),

          profilePhoto:
            formData.profilePhoto,

          location: {

            state:
              formData.location.state,

            city:
              formData.location.city,

            localGovernment:
              formData.location
                .localGovernment,
          },
        };


        console.log(
          "PROFILE UPDATE PAYLOAD:",
          payload
        );


        const response =
          await fetch(
            `${API_URL}/users/me`,
            {
              method: "PATCH",

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


        console.log(
          "PROFILE UPDATE RESPONSE:",
          data
        );


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


        await fetchProfile();

      } catch (error) {

        console.log(
          "PROFILE UPDATE ERROR:",
          error
        );

        setError(
          error?.message ||
            "Failed to update profile."
        );

      } finally {

        setSavingProfile(
          false
        );
      }
    };


  // ============================================================
  // PICK GOVERNMENT ID
  // ============================================================

  const pickGovernmentId =
    async () => {

      try {

        const allowed =
          await requestImagePermission();


        if (!allowed) {
          return;
        }


        const result =
          await ImagePicker
            .launchImageLibraryAsync({

              mediaTypes: ["images"],

              allowsEditing: false,

              quality: 0.8,
            });


        console.log(
          "GOVERNMENT ID PICKER RESULT:",
          result
        );


        if (
          result.canceled
        ) {
          return;
        }


        const image =
          result.assets?.[0];


        if (!image?.uri) {

          throw new Error(
            "Could not read the selected government ID."
          );
        }


        // ======================================================
        // SHOW LOCAL PREVIEW IMMEDIATELY
        // ======================================================

        setGovernmentIdPreview(
          image.uri
        );


        await uploadGovernmentId(
          image
        );

      } catch (error) {

        console.log(
          "GOVERNMENT ID PICKER ERROR:",
          error
        );

        setError(
          error?.message ||
            "Unable to select government ID."
        );
      }
    };


  // ============================================================
  // UPLOAD GOVERNMENT ID
  //
  // IMPORTANT:
  // NO FormData.
  //
  // FileSystem.uploadAsync creates the multipart request.
  // ============================================================

  const uploadGovernmentId =
    async (image) => {

      try {

        setUploadingGovernmentId(
          true
        );

        clearMessages();


        if (!image?.uri) {

          throw new Error(
            "No government ID selected."
          );
        }


        // ======================================================
        // CONVERT TO JPEG
        // ======================================================

        const manipulated =
          await ImageManipulator
            .manipulateAsync(
              image.uri,
              [],
              {
                compress: 0.8,

                format:
                  ImageManipulator
                    .SaveFormat
                    .JPEG,
              }
            );


        console.log(
          "GOVERNMENT ID READY:",
          manipulated.uri
        );


        console.log(
          "UPLOADING GOVERNMENT ID..."
        );


        // ======================================================
        // BACKEND
        // ======================================================

        const uploadResult =
          await FileSystem.uploadAsync(

            `${API_URL}/verification/upload-id`,

            manipulated.uri,

            {
              httpMethod: "POST",

              uploadType:
                FileSystem.FileSystemUploadType
                  .MULTIPART,

              fieldName:
                "document",

              mimeType:
                "image/jpeg",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        console.log(
          "GOVERNMENT ID STATUS:",
          uploadResult.status
        );


        console.log(
          "GOVERNMENT ID BODY:",
          uploadResult.body
        );


        // ======================================================
        // CHECK RESPONSE
        // ======================================================

        if (
          uploadResult.status < 200 ||
          uploadResult.status >= 300
        ) {

          let backendError;

          try {

            backendError =
              JSON.parse(
                uploadResult.body
              );

          } catch {
            backendError = null;
          }


          throw new Error(
            backendError?.message ||
              backendError?.error ||
              "Failed to upload government ID."
          );
        }


        // ======================================================
        // PARSE RESPONSE
        // ======================================================

        let data;

        try {

          data =
            JSON.parse(
              uploadResult.body
            );

        } catch (error) {

          console.log(
            "GOVERNMENT ID JSON PARSE ERROR:",
            error
          );

          throw new Error(
            "Server returned an invalid upload response."
          );
        }


        console.log(
          "GOVERNMENT ID RESPONSE:",
          data
        );


        // ======================================================
        // FIND UPLOADED URL
        // ======================================================

        const uploadedUrl =
          data?.imageUrl ||
          data?.data?.imageUrl ||
          data?.secure_url ||
          data?.data?.secure_url ||
          data?.url ||
          data?.data?.url;


        console.log(
          "UPLOADED GOVERNMENT ID URL:",
          uploadedUrl
        );


        if (!uploadedUrl) {

          throw new Error(
            "Server did not return the government ID URL."
          );
        }


        // ======================================================
        // SAVE GOVERNMENT ID URL
        // ONLY VERIFICATION STATE
        // ======================================================

        setVerificationData(
          (prev) => ({
            ...prev,

            governmentId:
              uploadedUrl,
          })
        );


        // ======================================================
        // SERVER URL AS PREVIEW
        // ======================================================

        setGovernmentIdPreview(
          uploadedUrl
        );


        setSuccess(
          "Government ID uploaded successfully."
        );


      } catch (error) {

        console.log(
          "GOVERNMENT ID UPLOAD ERROR:",
          error
        );

        setError(
          error?.message ||
            "Failed to upload government ID."
        );

      } finally {

        setUploadingGovernmentId(
          false
        );
      }
    };


  // ============================================================
  // SUBMIT NIN VERIFICATION
  // ============================================================

  const submitVerification =
    async () => {

      try {

        setSubmittingVerification(
          true
        );

        clearMessages();


        // ======================================================
        // NIN
        // ======================================================

        const nin =
          verificationData.nin.trim();


        if (!nin) {

          throw new Error(
            "Please enter your NIN."
          );
        }


        if (
          nin.length !== 11
        ) {

          throw new Error(
            "NIN must contain exactly 11 digits."
          );
        }


        // ======================================================
        // GOVERNMENT ID
        // ======================================================

        if (
          !verificationData.governmentId
        ) {

          throw new Error(
            "Please upload your government ID first."
          );
        }


        // ======================================================
        // PAYLOAD
        // ======================================================

        const payload = {

          nin,

          governmentId:
            verificationData
              .governmentId,
        };


        console.log(
          "VERIFICATION PAYLOAD:",
          payload
        );


        // ======================================================
        // VERIFICATION ENDPOINT
        // ======================================================

        const response =
          await fetch(
            `${API_URL}/verification`,
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


        console.log(
          "VERIFICATION RESPONSE:",
          data
        );


        if (!response.ok) {

          throw new Error(
            data?.message ||
              "Verification submission failed."
          );
        }


        // ======================================================
        // LOCAL STATUS
        // ======================================================

        setVerificationData(
          (prev) => ({
            ...prev,

            nin,

            ninStatus:
              "pending",
          })
        );


        setSuccess(
          "Your identity verification has been submitted successfully."
        );


        Alert.alert(
          "Verification Submitted",
          "Your identity verification is now awaiting review."
        );


        await fetchProfile();

      } catch (error) {

        console.log(
          "VERIFICATION ERROR:",
          error
        );

        setError(
          error?.message ||
            "Verification submission failed."
        );

      } finally {

        setSubmittingVerification(
          false
        );
      }
    };


  // ============================================================
  // LOGIN REQUIRED
  // ============================================================

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


  // ============================================================
  // LOADING
  // ============================================================

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


  // ============================================================
  // RENDER
  // ============================================================

  return (
    <SafeAreaView
      style={styles.container}
    >

      <Navbar />

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.content
        }
      >

        {/* =====================================================
            HEADER
        ===================================================== */}

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
            Update your personal
            information below.
          </Text>

        </View>


        {/* =====================================================
            ERROR
        ===================================================== */}

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


        {/* =====================================================
            SUCCESS
        ===================================================== */}

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


        {/* =====================================================
            PROFILE CARD
        ===================================================== */}

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
                style={
                  styles.profileImage
                }
              />


              <TouchableOpacity
                style={
                  styles.cameraButton
                }
                onPress={
                  pickProfilePhoto
                }
                disabled={
                  uploadingProfilePhoto
                }
              >

                {uploadingProfilePhoto ? (

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
                pickProfilePhoto
              }
              disabled={
                uploadingProfilePhoto
              }
            >

              <Text
                style={
                  styles.changePhotoText
                }
              >
                {uploadingProfilePhoto
                  ? "Uploading..."
                  : "Change Photo"}
              </Text>

            </TouchableOpacity>

          </View>


          {/* FULL NAME */}

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
                handleProfileChange(
                  "fullName",
                  value
                )
              }
              placeholder="Your full name"
              placeholderTextColor="#6b7280"
              style={styles.input}
            />

          </View>


          {/* LOCATION */}

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


          {/* ABOUT */}

          <View
            style={styles.field}
          >

            <Text
              style={styles.label}
            >
              About You
            </Text>


            <TextInput
              value={
                formData.bio
              }

              onChangeText={(value) =>
                handleProfileChange(
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


          {/* SAVE PROFILE */}

          <TouchableOpacity
            style={[
              styles.saveButton,

              savingProfile &&
                styles.disabledButton,
            ]}

            onPress={
              handleSubmit
            }

            disabled={
              savingProfile ||
              uploadingProfilePhoto
            }
          >

            {savingProfile ? (

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
              {savingProfile
                ? "Saving..."
                : "Save Changes"}
            </Text>

          </TouchableOpacity>

        </View>


        {/* =====================================================
            VERIFICATION CARD
        ===================================================== */}

        <View
          style={styles.card}
        >

          {/* HEADER */}

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


          {/* =================================================
              NIN
          ================================================= */}

          <View
            style={styles.field}
          >

            <Text
              style={styles.label}
            >
              NIN Number
            </Text>


            <TextInput
              value={
                verificationData.nin
              }

              onChangeText={(value) =>
                setVerificationData(
                  (prev) => ({
                    ...prev,

                    nin:
                      value.replace(
                        /[^0-9]/g,
                        ""
                      ),
                  })
                )
              }

              placeholder="Enter your 11-digit NIN"

              placeholderTextColor="#6b7280"

              keyboardType="numeric"

              maxLength={11}

              style={styles.input}

              editable={
                !verificationData.isVerified
              }
            />


            {/* STATUS */}

            <View
              style={styles.statusRow}
            >

              {verificationData
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

              ) : verificationData
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


          {/* =================================================
              GOVERNMENT ID
          ================================================= */}

          <View
            style={styles.field}
          >

            <Text
              style={styles.label}
            >
              Government ID
            </Text>


            {/* PREVIEW */}

            {governmentIdPreview ? (

              <View
                style={
                  styles.idPreviewContainer
                }
              >

                <Image
                  source={{
                    uri:
                      governmentIdPreview,
                  }}

                  style={
                    styles.idPreviewImage
                  }

                  resizeMode="cover"
                />


                <View
                  style={
                    styles.idPreviewOverlay
                  }
                >

                  <Ionicons
                    name="checkmark-circle"
                    size={22}
                    color="#22c55e"
                  />


                  <Text
                    style={
                      styles.idPreviewText
                    }
                  >
                    Government ID Selected
                  </Text>

                </View>

              </View>

            ) : null}


            {/* UPLOAD BUTTON */}

            <TouchableOpacity
              style={
                styles.uploadBox
              }

              onPress={
                pickGovernmentId
              }

              disabled={
                uploadingGovernmentId
              }
            >

              <View
                style={
                  styles.uploadIcon
                }
              >

                {uploadingGovernmentId ? (

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
                  {uploadingGovernmentId
                    ? "Uploading..."
                    : verificationData
                        .governmentId
                    ? "Change Government ID"
                    : "Upload Government ID"}
                </Text>


                <Text
                  style={
                    styles.uploadSubtitle
                  }
                >
                  {uploadingGovernmentId
                    ? "Uploading your document..."
                    : verificationData
                        .governmentId
                    ? "Tap to select a different document"
                    : "Tap here to select your ID"}
                </Text>

              </View>


              <Ionicons
                name={
                  verificationData
                    .governmentId
                    ? "checkmark-circle"
                    : "cloud-upload-outline"
                }

                size={22}

                color={
                  verificationData
                    .governmentId
                    ? "#22c55e"
                    : "#9ca3af"
                }
              />

            </TouchableOpacity>


            {/* UPLOAD SUCCESS */}

            {verificationData
              .governmentId ? (

              <View
                style={
                  styles.uploadSuccessRow
                }
              >

                <Ionicons
                  name="checkmark-circle"
                  size={17}
                  color="#22c55e"
                />


                <Text
                  style={
                    styles.uploadSuccessText
                  }
                >
                  Government ID uploaded successfully
                </Text>

              </View>

            ) : null}

          </View>


          {/* =================================================
              SUBMIT VERIFICATION
          ================================================= */}

          <TouchableOpacity
            style={[
              styles.verifyButton,

              submittingVerification &&
                styles.disabledButton,
            ]}

            onPress={
              submitVerification
            }

            disabled={
              submittingVerification ||
              uploadingGovernmentId ||
              verificationData
                .ninStatus ===
                "verified"
            }
          >

            {submittingVerification ? (

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
              {submittingVerification
                ? "Submitting..."
                : verificationData
                    .ninStatus ===
                  "verified"
                ? "Identity Verified"
                : "Submit for Verification"}
            </Text>

          </TouchableOpacity>

        </View>


        {/* =====================================================
            INFO
        ===================================================== */}

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


        {/* =====================================================
            FOOTER
        ===================================================== */}

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


// ============================================================
// STYLES
// ============================================================

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: "#030712",
    },

    content: {
      paddingBottom: 30,
    },


    // ========================================================
    // HEADER
    // ========================================================

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


    // ========================================================
    // CARD
    // ========================================================

    card: {
      marginHorizontal: 20,
      marginBottom: 20,
      padding: 20,
      backgroundColor: "#111827",
      borderWidth: 1,
      borderColor: "#1f2937",
      borderRadius: 20,
    },


    // ========================================================
    // PROFILE
    // ========================================================

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


    // ========================================================
    // FIELDS
    // ========================================================

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


    // ========================================================
    // SAVE
    // ========================================================

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


    // ========================================================
    // VERIFICATION
    // ========================================================

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


    // ========================================================
    // STATUS
    // ========================================================

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


    // ========================================================
    // GOVERNMENT ID
    // ========================================================

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

    uploadSuccessRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 8,
    },

    uploadSuccessText: {
      marginLeft: 6,
      color: "#22c55e",
      fontSize: 12,
      fontWeight: "600",
    },


    // ========================================================
    // ID PREVIEW
    // ========================================================

    idPreviewContainer: {
      width: "100%",
      height: 220,
      marginBottom: 14,
      borderRadius: 14,
      overflow: "hidden",
      backgroundColor: "#030712",
      borderWidth: 1,
      borderColor: "#1f2937",
      position: "relative",
    },

    idPreviewImage: {
      width: "100%",
      height: "100%",
    },

    idPreviewOverlay: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      paddingHorizontal: 14,
      paddingVertical: 10,
      backgroundColor:
        "rgba(0, 0, 0, 0.65)",
      flexDirection: "row",
      alignItems: "center",
    },

    idPreviewText: {
      marginLeft: 8,
      color: "#ffffff",
      fontSize: 13,
      fontWeight: "600",
    },


    // ========================================================
    // VERIFY BUTTON
    // ========================================================

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

    disabledButton: {
      opacity: 0.6,
    },


    // ========================================================
    // INFO
    // ========================================================

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


    // ========================================================
    // MESSAGES
    // ========================================================

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


    // ========================================================
    // LOADING
    // ========================================================

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


    // ========================================================
    // LOGIN
    // ========================================================

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
