import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import { useAuth } from "../context/AuthContext";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useGeolocation from "../hooks/useGeolocation";
import LocationSelector from "../components/LocationSelector";


const WorkerProfileEditScreen = ({ navigation }) => {

  // ======================================
  // AUTH
  // ======================================

  const {
    token,
    isAuthenticated,
  } = useAuth();

  const {
  loading: locationLoading,
  error: locationError,
  getLocation,
} = useGeolocation();


  // ======================================
  // API
  // ======================================

  const API_URL =
    process.env.EXPO_PUBLIC_API_URL;


  // ======================================
  // LOADING / ERROR
  // ======================================

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);


  const [uploadingImage, setUploadingImage] =
    useState(false);

  const [error, setError] =
    useState("");
    const [locationUpdated, setLocationUpdated] = useState(false);


  // ======================================
  // PROFILE PHOTO
  // ======================================

  const [profilePhoto, setProfilePhoto] =
    useState("");

    // ======================================
// VERIFICATION
// ======================================

const [nin, setNin] = useState("");

const [governmentId, setGovernmentId] =
  useState(null);

const [verificationLoading, setVerificationLoading] =
  useState(false);

  // ======================================
// PICK GOVERNMENT ID
// ======================================

const pickGovernmentId = async () => {
  try {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert(
        "Please allow access to your photos so you can upload your government ID."
      );

      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.8,
      });

    if (result.canceled) {
      return;
    }

    const image = result.assets?.[0];

    if (!image) {
      return;
    }

    setGovernmentId(image);

    setError("");

  } catch (error) {
    console.error(
      "Government ID picker error:",
      error
    );

    setError(
      "Unable to select your government ID."
    );
  }
};

// ======================================
// SUBMIT VERIFICATION
// ======================================

const submitVerification = async () => {
  try {
    setError("");

    // Validate NIN
    if (!/^\d{11}$/.test(nin)) {
      setError(
        "NIN must be exactly 11 digits."
      );

      return;
    }

    // Validate government ID
    if (!governmentId) {
      setError(
        "Please upload your government ID."
      );

      return;
    }

    setVerificationLoading(true);

    // ==================================
    // STEP 1: UPLOAD GOVERNMENT ID
    // ==================================

    const uploadData = new FormData();

    uploadData.append("document", {
      uri: governmentId.uri,
      type:
        governmentId.mimeType ||
        "image/jpeg",
      name:
        governmentId.fileName ||
        `government-id-${Date.now()}.jpg`,
    });

    const uploadResponse =
      await fetch(
        `${API_URL}/verification/upload-id`,
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },

          body: uploadData,
        }
      );

    const uploadResult =
      await uploadResponse.json();

    if (!uploadResponse.ok) {
      throw new Error(
        uploadResult?.message ||
        "Failed to upload government ID."
      );
    }

    const documentUrl =
      uploadResult?.imageUrl ||
      uploadResult?.url ||
      uploadResult?.data?.imageUrl;

    if (!documentUrl) {
      throw new Error(
        "Upload failed: no document URL returned."
      );
    }

    // ==================================
    // STEP 2: SUBMIT VERIFICATION
    // ==================================

    const verificationResponse =
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

          body: JSON.stringify({
            nin,
            governmentId: documentUrl,
          }),
        }
      );

    const verificationResult =
      await verificationResponse.json();

    if (!verificationResponse.ok) {
      throw new Error(
        verificationResult?.message ||
        "Failed to submit verification."
      );
    }

    alert(
      "Verification submitted successfully."
    );

    // Clear selected document
    setGovernmentId(null);

  } catch (error) {
    console.error(
      "Verification error:",
      error
    );

    setError(
      error.message ||
      "Failed to submit verification."
    );

  } finally {
    setVerificationLoading(false);
  }
};


  // ======================================
  // FORM
  // ======================================

 const [formData, setFormData] = useState({
  fullName: "",
  email: "",
  phone: "",
  skill: "",
  about: "",
  yearsOfExperience: "",
  specialization: "",
  hourlyRate: "",
  availability: "available",

  location: {
    state: "",
    city: "",
    localGovernment: "",
    address: "",
    coordinates: null,
  },
});

  const [portfolioForm, setPortfolioForm] = useState({
    title: "",
    location: "",
    image: "",
    description: "",
  });

  

  const [portfolioItems, setPortfolioItems] = useState([]);

  const [portfolioUploading, setPortfolioUploading] =
    useState(false);

  // ======================================
  // SKILLS
  // ======================================

  const [newSkill, setNewSkill] = useState("");

  const [skills, setSkills] = useState([]);

  const pickPortfolioImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        alert(
          "Please allow access to your photos so you can upload a portfolio image."
        );

        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [16, 9],
          quality: 0.8,
        });

      if (result.canceled) {
        return;
      }

      const image = result.assets?.[0];

      if (!image) {
        return;
      }

      await uploadPortfolioImage(image);

    } catch (error) {
      console.error(
        "Portfolio image picker error:",
        error
      );

      setError(
        "Unable to select portfolio image."
      );
    }
  };

  const uploadPortfolioImage = async (image) => {
    try {
      setPortfolioUploading(true);
      setError("");

      const formData = new FormData();

      formData.append("file", {
        uri: image.uri,
        type:
          image.mimeType ||
          "image/jpeg",
        name:
          image.fileName ||
          `portfolio-${Date.now()}.jpg`,
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error?.message ||
          "Portfolio image upload failed."
        );
      }

      if (!data?.secure_url) {
        throw new Error(
          "Cloudinary did not return an image URL."
        );
      }

      setPortfolioForm((prev) => ({
        ...prev,
        image: data.secure_url,
      }));

    } catch (error) {
      console.error(
        "Portfolio image upload error:",
        error
      );

      setError(
        error.message ||
        "Failed to upload portfolio image."
      );

    } finally {
      setPortfolioUploading(false);
    }
  };


  const addPortfolioItem = async () => {
    if (!portfolioForm.title.trim()) {
      setError("Project title is required.");
      return;
    }

    if (!portfolioForm.description.trim()) {
      setError("Project description is required.");
      return;
    }

    if (!portfolioForm.image) {
      setError("Please upload a project image.");
      return;
    }

    try {
      setPortfolioUploading(true);
      setError("");

      const newPortfolio = {
        title: portfolioForm.title.trim(),
        location: portfolioForm.location.trim(),
        image: portfolioForm.image,
        description:
          portfolioForm.description.trim(),
      };

      const response = await fetch(
        `${API_URL}/portfolio`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body:
            JSON.stringify(newPortfolio),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to save portfolio item."
        );
      }

      const updatedPortfolio =
        data?.user?.portfolio ||
        [
          ...portfolioItems,
          newPortfolio,
        ];

      setPortfolioItems(
        updatedPortfolio
      );

      setPortfolioForm({
        title: "",
        location: "",
        image: "",
        description: "",
      });

    } catch (error) {
      console.error(
        "Add portfolio error:",
        error
      );

      setError(
        error.message ||
        "Failed to save portfolio item."
      );

    } finally {
      setPortfolioUploading(false);
    }
  };

  const removePortfolioItem = async (index) => {
    const portfolio =
      portfolioItems[index];

    try {
      setError("");

      if (portfolio._id) {
        const response = await fetch(
          `${API_URL}/portfolio/${portfolio._id}`,
          {
            method: "DELETE",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
            "Failed to remove portfolio item."
          );
        }
      }

      setPortfolioItems((prev) =>
        prev.filter(
          (_, i) => i !== index
        )
      );

    } catch (error) {
      console.error(
        "Remove portfolio error:",
        error
      );

      setError(
        error.message ||
        "Failed to remove portfolio item."
      );
    }
  };

  // ======================================
  // FETCH PROFILE
  // ======================================

  useEffect(() => {

    const fetchProfile = async () => {

      if (!isAuthenticated || !token) {

        setLoading(false);

        return;

      }

      try {

        setLoading(true);

        setError("");


        const response =
          await fetch(
            `${API_URL}/users/me`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Failed to load profile"
          );

        }


        const user =
          data.data ||
          data.user ||
          data.worker ||
          data;


        if (!user) {

          throw new Error(
            "Worker profile not found"
          );

        }


        // ==================================
        // SET FORM DATA
        // ==================================

        setFormData({
          fullName: user.fullName || "",
          email: user.email || "",
          phone: user.phone || "",
          skill: user.skill || "",
          about: user.about || "",
          yearsOfExperience: user.yearsOfExperience ?? "",
          specialization: user.specialization ?? "",
          hourlyRate: user.hourlyRate ?? "",
          availability: user.availability || "available",

         location: {
  state: user.location?.state || "",
  city: user.location?.city || "",
  localGovernment:
    user.location?.localGovernment || "",
  address: user.location?.address || "",
  coordinates:
    user.location?.coordinates || null,
},
        });

        setSkills(user.skills || []);
        setPortfolioItems(user.portfolio || []);

        // ==================================
        // PROFILE PHOTO
        // ==================================

        setProfilePhoto(
          user.profilePhoto || ""
        );


      } catch (error) {

        console.error(
          "Worker profile error:",
          error
        );

        setError(
          error.message ||
          "Failed to load profile"
        );

      } finally {

        setLoading(false);

      }

    };


    fetchProfile();

  }, [
    token,
    isAuthenticated,
  ]);


  // ======================================
  // HANDLE INPUT
  // ======================================

  const handleChange = (
    field,
    value
  ) => {

    setFormData((prev) => ({

      ...prev,

      [field]: value,

    }));

  };

  // ======================================
  // LOCATION
  // ======================================

  const handleStateChange = (value) => {
    setFormData((prev) => ({
      ...prev,

      location: {
        ...prev.location,
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

  const handleAddressChange = (value) => {
    setFormData((prev) => ({
      ...prev,

      location: {
        ...prev.location,
        address: value,
      },
    }));
  };

  // ======================================
  // ADD SKILL
  // ======================================

  const addSkill = () => {
    const trimmedSkill = newSkill.trim();

    if (!trimmedSkill) {
      return;
    }

    // Prevent duplicate skills
    if (
      skills.some(
        (skill) =>
          skill.toLowerCase() ===
          trimmedSkill.toLowerCase()
      )
    ) {
      setNewSkill("");
      return;
    }

    setSkills((prev) => [
      ...prev,
      trimmedSkill,
    ]);

    setNewSkill("");
  };


  // ======================================
  // REMOVE SKILL
  // ======================================

  const removeSkill = (index) => {
    setSkills((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );
  };


  // ======================================
  // SAVE PROFILE
  // ======================================

  const saveProfile = async () => {

    try {

      setSaving(true);

      setError("");


      const payload = {
  fullName: formData.fullName,
  email: formData.email,
  phone: formData.phone,
  skill: formData.skill,
  about: formData.about,

  yearsOfExperience:
    formData.yearsOfExperience,

  specialization:
    formData.specialization,

  hourlyRate:
    formData.hourlyRate,

  availability:
    formData.availability,

  profilePhoto:
    profilePhoto,

  skills:
    skills,

  location: {
    state: formData.location.state,
    city: formData.location.city,
    localGovernment:
      formData.location.localGovernment,
    address:
      formData.location.address,
    coordinates:
      formData.location.coordinates,
  },
};


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
              JSON.stringify(payload),

          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to save profile"
        );

      }


      console.log(
        "Profile updated:",
        data
      );


      alert(
        "Profile updated successfully"
      );


    } catch (error) {

      console.error(
        "Save profile error:",
        error
      );

      setError(
        error.message ||
        "Failed to save profile"
      );

    } finally {

      setSaving(false);

    }

  };

  // ======================================
  // PICK PROFILE IMAGE
  // ======================================

  const pickProfileImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        alert(
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

      console.error(
        "Image picker error:",
        error
      );

      setError(
        "Unable to select profile photo."
      );
    }
  };

  // ======================================
  // UPLOAD PROFILE PHOTO
  // ======================================

  const uploadProfilePhoto = async (image) => {
    try {

      setUploadingImage(true);

      setError("");


      const formData =
        new FormData();


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


      const response =
        await fetch(
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


      // Store Cloudinary URL
      // in our form state

      setProfilePhoto(
        data.secure_url
      );


    } catch (error) {

      console.error(
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

 const handleGetCurrentLocation = async () => {
  try {
    setError("");

    const coordinates = await getLocation();

    if (!coordinates) {
      return;
    }

    setFormData((prev) => ({
      ...prev,

      location: {
        ...prev.location,

        coordinates: {
          type: "Point",

          coordinates: [
            coordinates.longitude,
            coordinates.latitude,
          ],
        },
      },
    }));

    setLocationUpdated(true);

  } catch (error) {
    console.error(
      "Get current location error:",
      error
    );

    setError(
      error.message ||
      "Unable to get your current location."
    );
  }
};


  // ======================================
  // LOGIN REQUIRED
  // ======================================

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
            You need to login to edit
            your worker profile.
          </Text>

          <TouchableOpacity
            style={styles.orangeButton}
            onPress={() =>
              navigation.navigate("Login")
            }
          >

            <Text
              style={styles.buttonText}
            >
              Login
            </Text>

          </TouchableOpacity>

        </View>

      </SafeAreaView>
    );

  }


  // ======================================
  // LOADING
  // ======================================

  if (loading) {

    return (
      <SafeAreaView
        style={styles.container}
      >

        <Navbar />

        <View
          style={styles.centerContainer}
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


  // ======================================
  // RENDER
  // ======================================

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

        <View style={styles.header}>

          <Text style={styles.title}>
            Edit Profile
          </Text>

          <Text style={styles.subtitle}>
            Complete your profile to attract
            more customers.
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
              color="#ef4444"
            />

            <Text
              style={styles.errorText}
            >
              {error}
            </Text>

          </View>

        ) : null}


        {/* ==================================
            PROFILE SECTION
        ================================== */}

        <View
          style={styles.card}
        >

          <Text
            style={styles.sectionTitle}
          >
            Basic Information
          </Text>


          {/* PROFILE PHOTO */}

          <View
            style={styles.photoContainer}
          >

            <View
              style={styles.profileImageWrapper}
            >

              {profilePhoto ? (

                <Image
                  source={{
                    uri: profilePhoto,
                  }}
                  style={
                    styles.profileImage
                  }
                />

              ) : (

                <View
                  style={
                    styles.profilePlaceholder
                  }
                >

                  <Ionicons
                    name="person"
                    size={42}
                    color="#6b7280"
                  />

                </View>

              )}

            </View>


            <TouchableOpacity
              style={styles.changePhotoButton}
              onPress={pickProfileImage}
              disabled={uploadingImage}
            >

              {uploadingImage ? (

                <ActivityIndicator
                  size="small"
                  color="#f97316"
                />

              ) : (

                <Ionicons
                  name="camera-outline"
                  size={18}
                  color="#f97316"
                />

              )}

              <Text
                style={styles.changePhotoText}
              >
                {uploadingImage
                  ? "Uploading..."
                  : "Change Photo"}
              </Text>

            </TouchableOpacity>

          </View>


          {/* FULL NAME */}

          <View
            style={styles.inputGroup}
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
              placeholder="Full Name"
              placeholderTextColor="#6b7280"
              style={styles.input}
            />

          </View>


          {/* PROFESSION */}

          <View
            style={styles.inputGroup}
          >

            <Text
              style={styles.label}
            >
              Profession
            </Text>

            <TextInput
              value={
                formData.skill
              }
              onChangeText={(value) =>
                handleChange(
                  "skill",
                  value
                )
              }
              placeholder="e.g. Plumber"
              placeholderTextColor="#6b7280"
              style={styles.input}
            />

          </View>

          {/* ==================================
    LOCATION
================================== */}

          <View style={styles.inputGroup}>

            <Text style={styles.label}>
              Location
            </Text>

            <LocationSelector
              state={formData.location.state}
              city={formData.location.city}
              lga={formData.location.localGovernment}
              onStateChange={handleStateChange}
              onCityChange={handleCityChange}
              onLgaChange={handleLgaChange}
            />

          </View>

          <View style={styles.inputGroup}>

            <Text style={styles.label}>
              Address
            </Text>

            <TextInput
              value={formData.location.address}
              onChangeText={handleAddressChange}
              placeholder="Enter your work address"
              placeholderTextColor="#6b7280"
              style={styles.input}
            />

          </View>

          <View style={styles.exactLocationContainer}>

  <View style={styles.exactLocationHeader}>

    <View style={styles.exactLocationIcon}>
      <Ionicons
        name="navigate-outline"
        size={20}
        color="#f97316"
      />
    </View>

    <View style={styles.exactLocationTextContainer}>

      <Text style={styles.exactLocationTitle}>
        Set Your Exact Location
      </Text>

      <Text style={styles.exactLocationDescription}>
        Help customers find artisans near them by
        sharing your current location.
      </Text>

    </View>

  </View>

  <TouchableOpacity
    style={[
      styles.locationButton,
      locationLoading &&
        styles.disabledButton,
    ]}
    onPress={handleGetCurrentLocation}
    disabled={locationLoading}
  >

    {locationLoading ? (

      <ActivityIndicator
        size="small"
        color="#ffffff"
      />

    ) : (

      <Ionicons
        name="locate-outline"
        size={20}
        color="#ffffff"
      />

    )}

    <Text style={styles.locationButtonText}>

      {locationLoading
        ? "Getting Location..."
        : formData.location.coordinates
          ? "Update My Location"
          : "Use My Current Location"}

    </Text>

  </TouchableOpacity>

 {formData.location.coordinates ? (

  <View style={styles.locationSaved}>

    <Ionicons
      name="checkmark-circle"
      size={18}
      color="#22c55e"
    />

    <Text style={styles.locationSavedText}>
      {locationUpdated
        ? "Exact location updated"
        : "Exact location already set"}
    </Text>

  </View>

) : (

  <Text style={styles.locationHint}>
    Your exact GPS location will not be displayed
    publicly. It is used to improve nearby artisan
    searches.
  </Text>

)}

</View>


          {/* PHONE */}

          <View
            style={styles.inputGroup}
          >

            <Text
              style={styles.label}
            >
              Phone Number
            </Text>

            <TextInput
              value={
                formData.phone
              }
              onChangeText={(value) =>
                handleChange(
                  "phone",
                  value
                )
              }
              placeholder="Phone Number"
              placeholderTextColor="#6b7280"
              keyboardType="phone-pad"
              style={styles.input}
            />

          </View>


          {/* EMAIL */}

          <View
            style={styles.inputGroup}
          >

            <Text
              style={styles.label}
            >
              Email
            </Text>

            <TextInput
              value={
                formData.email
              }
              editable={false}
              style={[
                styles.input,
                styles.disabledInput,
              ]}
            />

          </View>

        </View>


        {/* ==================================
            ABOUT
        ================================== */}

        <View
          style={styles.card}
        >

          <Text
            style={styles.sectionTitle}
          >
            About You
          </Text>

          <Text
            style={styles.sectionDescription}
          >
            Tell customers about yourself,
            your experience and the services
            you provide.
          </Text>

          <TextInput
            value={
              formData.about
            }
            onChangeText={(value) =>
              handleChange(
                "about",
                value
              )
            }
            placeholder="Tell customers about yourself..."
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
    SKILLS & SERVICES
================================== */}

        <View style={styles.card}>

          <Text style={styles.sectionTitle}>
            Skills & Services
          </Text>

          <Text style={styles.sectionDescription}>
            Add the skills and services you provide
            so customers know what you can help them with.
          </Text>


          {/* ADD SKILL */}

          <View style={styles.skillInputRow}>

            <TextInput
              value={newSkill}
              onChangeText={setNewSkill}
              placeholder="e.g. Pipe Installation"
              placeholderTextColor="#6b7280"
              style={[
                styles.input,
                styles.skillInput,
              ]}
            />

            <TouchableOpacity
              style={styles.addSkillButton}
              onPress={addSkill}
            >

              <Ionicons
                name="add"
                size={20}
                color="#ffffff"
              />

              <Text style={styles.addSkillText}>
                Add
              </Text>

            </TouchableOpacity>

          </View>


          {/* SKILL CHIPS */}

          {skills.length > 0 ? (

            <View style={styles.skillsContainer}>

              {skills.map((skill, index) => (

                <View
                  key={`${skill}-${index}`}
                  style={styles.skillChip}
                >

                  <Text style={styles.skillText}>
                    {skill}
                  </Text>

                  <TouchableOpacity
                    onPress={() =>
                      removeSkill(index)
                    }
                    hitSlop={{
                      top: 8,
                      bottom: 8,
                      left: 8,
                      right: 8,
                    }}
                  >

                    <Ionicons
                      name="close-circle"
                      size={18}
                      color="#f97316"
                    />

                  </TouchableOpacity>

                </View>

              ))}

            </View>

          ) : (

            <Text style={styles.emptySkillsText}>
              No additional skills added yet.
            </Text>

          )}

        </View>

        {/* ==================================
    WORK EXPERIENCE
================================== */}

        <View style={styles.card}>

          <Text style={styles.sectionTitle}>
            Work Experience
          </Text>

          <Text style={styles.sectionDescription}>
            Tell customers about your experience
            and area of specialization.
          </Text>


          {/* YEARS OF EXPERIENCE */}

          <View style={styles.inputGroup}>

            <Text style={styles.label}>
              Years of Experience
            </Text>

            <TextInput
              value={formData.yearsOfExperience}
              onChangeText={(value) =>
                handleChange(
                  "yearsOfExperience",
                  value
                )
              }
              placeholder="e.g. 5"
              placeholderTextColor="#6b7280"
              keyboardType="numeric"
              style={styles.input}
            />

          </View>


          {/* SPECIALIZATION */}

          <View style={styles.inputGroup}>

            <Text style={styles.label}>
              Specialization
            </Text>

            <TextInput
              value={formData.specialization}
              onChangeText={(value) =>
                handleChange(
                  "specialization",
                  value
                )
              }
              placeholder="e.g. Residential Plumbing"
              placeholderTextColor="#6b7280"
              style={styles.input}
            />

          </View>

        </View>

        {/* ==================================
    CHARGE PER HOUR
================================== */}

        <View style={styles.card}>

          <Text style={styles.sectionTitle}>
            Charge Per Hour
          </Text>

          <Text style={styles.sectionDescription}>
            Set your hourly rate so customers know
            what you charge for your services.
          </Text>

          <View style={styles.inputGroup}>

            <Text style={styles.label}>
              Charge Per Hour (₦)
            </Text>

            <View style={styles.rateInputContainer}>

              <Text style={styles.currencySymbol}>
                ₦
              </Text>

              <TextInput
                value={formData.hourlyRate}
                onChangeText={(value) =>
                  handleChange(
                    "hourlyRate",
                    value
                  )
                }
                placeholder="e.g. 5000"
                placeholderTextColor="#6b7280"
                keyboardType="numeric"
                style={styles.rateInput}
              />

            </View>

            {formData.hourlyRate ? (
              <Text style={styles.ratePreview}>
                ₦{Number(formData.hourlyRate).toLocaleString()}/hr
              </Text>
            ) : null}

          </View>

        </View>

        {/* ==================================
    PORTFOLIO
================================== */}

        <View style={styles.card}>

          <Text style={styles.sectionTitle}>
            Portfolio
          </Text>

          <Text style={styles.sectionDescription}>
            Showcase your previous work to attract
            more customers.
          </Text>


          {/* EXISTING PORTFOLIO */}

          {portfolioItems.length > 0 ? (

            <View style={styles.portfolioContainer}>

              {portfolioItems.map(
                (item, index) => (

                  <View
                    key={
                      item._id ||
                      `${item.title}-${index}`
                    }
                    style={
                      styles.portfolioCard
                    }
                  >

                    {item.image ? (

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

                      <View
                        style={
                          styles.portfolioHeader
                        }
                      >

                        <View
                          style={
                            styles.portfolioTitleContainer
                          }
                        >

                          <Text
                            style={
                              styles.portfolioTitle
                            }
                          >
                            {item.title}
                          </Text>

                          {item.location ? (

                            <Text
                              style={
                                styles.portfolioLocation
                              }
                            >
                              {item.location}
                            </Text>

                          ) : null}

                        </View>


                        <TouchableOpacity
                          onPress={() =>
                            removePortfolioItem(
                              index
                            )
                          }
                          hitSlop={{
                            top: 10,
                            bottom: 10,
                            left: 10,
                            right: 10,
                          }}
                        >

                          <Ionicons
                            name="trash-outline"
                            size={20}
                            color="#ef4444"
                          />

                        </TouchableOpacity>

                      </View>


                      <Text
                        style={
                          styles.portfolioDescription
                        }
                      >
                        {item.description}
                      </Text>

                    </View>

                  </View>

                )
              )}

            </View>

          ) : (

            <Text
              style={
                styles.emptyPortfolioText
              }
            >
              No portfolio items added yet.
            </Text>

          )}


          {/* ADD PORTFOLIO */}

          <View
            style={
              styles.addPortfolioContainer
            }
          >

            <Text
              style={
                styles.addPortfolioTitle
              }
            >
              Add Portfolio Item
            </Text>


            {/* TITLE */}

            <TextInput
              value={portfolioForm.title}
              onChangeText={(value) =>
                setPortfolioForm(
                  (prev) => ({
                    ...prev,
                    title: value,
                  })
                )
              }
              placeholder="Project Title"
              placeholderTextColor="#6b7280"
              style={styles.input}
            />


            {/* LOCATION */}

            <TextInput
              value={portfolioForm.location}
              onChangeText={(value) =>
                setPortfolioForm(
                  (prev) => ({
                    ...prev,
                    location: value,
                  })
                )
              }
              placeholder="Location"
              placeholderTextColor="#6b7280"
              style={styles.input}
            />


            {/* DESCRIPTION */}

            <TextInput
              value={
                portfolioForm.description
              }
              onChangeText={(value) =>
                setPortfolioForm(
                  (prev) => ({
                    ...prev,
                    description: value,
                  })
                )
              }
              placeholder="Describe the project and the work you did..."
              placeholderTextColor="#6b7280"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              style={[
                styles.input,
                styles.portfolioDescriptionInput,
              ]}
            />


            {/* IMAGE */}

            <TouchableOpacity
              style={
                styles.portfolioImageButton
              }
              onPress={pickPortfolioImage}
              disabled={portfolioUploading}
            >

              {portfolioUploading ? (

                <ActivityIndicator
                  size="small"
                  color="#f97316"
                />

              ) : (

                <Ionicons
                  name="camera-outline"
                  size={22}
                  color="#f97316"
                />

              )}

              <Text
                style={
                  styles.portfolioImageButtonText
                }
              >
                {portfolioUploading
                  ? "Uploading..."
                  : "Upload Project Image"}
              </Text>

            </TouchableOpacity>


            {/* IMAGE PREVIEW */}

            {portfolioForm.image ? (

              <Image
                source={{
                  uri: portfolioForm.image,
                }}
                style={
                  styles.portfolioPreview
                }
              />

            ) : null}


            {/* ADD BUTTON */}

            <TouchableOpacity
              style={[
                styles.addPortfolioButton,
                portfolioUploading &&
                styles.disabledButton,
              ]}
              onPress={addPortfolioItem}
              disabled={portfolioUploading}
            >

              <Ionicons
                name="add"
                size={20}
                color="#ffffff"
              />

              <Text
                style={
                  styles.addPortfolioButtonText
                }
              >
                Add Portfolio
              </Text>

            </TouchableOpacity>

          </View>

        </View>

        {/* =========================================
    AVAILABILITY
========================================= */}
<View style={styles.card}>
  <Text style={styles.sectionTitle}>
    Availability
  </Text>

  <Text style={styles.sectionDescription}>
    Let customers know whether you're currently available for work.
  </Text>

  <View style={styles.availabilityContainer}>

    {/* AVAILABLE */}
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        setFormData((prev) => ({
          ...prev,
          availability: "available",
        }))
      }
      style={[
        styles.availabilityOption,
        formData.availability === "available" &&
          styles.availabilityAvailableActive,
      ]}
    >
      <View
        style={[
          styles.availabilityIcon,
          formData.availability === "available" &&
            styles.availabilityIconAvailable,
        ]}
      >
        <Ionicons
          name="checkmark-circle"
          size={24}
          color={
            formData.availability === "available"
              ? "#22c55e"
              : "#9ca3af"
          }
        />
      </View>

      <View style={styles.availabilityTextContainer}>
        <Text
          style={[
            styles.availabilityTitle,
            formData.availability === "available" &&
              styles.availabilityTitleActive,
          ]}
        >
          Available
        </Text>

        <Text style={styles.availabilityDescription}>
          Currently accepting jobs
        </Text>
      </View>

      {formData.availability === "available" && (
        <Ionicons
          name="checkmark"
          size={22}
          color="#22c55e"
        />
      )}
    </TouchableOpacity>


    {/* BUSY */}
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        setFormData((prev) => ({
          ...prev,
          availability: "busy",
        }))
      }
      style={[
        styles.availabilityOption,
        formData.availability === "busy" &&
          styles.availabilityBusyActive,
      ]}
    >
      <View
        style={[
          styles.availabilityIcon,
          formData.availability === "busy" &&
            styles.availabilityIconBusy,
        ]}
      >
        <Ionicons
          name="time-outline"
          size={24}
          color={
            formData.availability === "busy"
              ? "#f97316"
              : "#9ca3af"
          }
        />
      </View>

      <View style={styles.availabilityTextContainer}>
        <Text
          style={[
            styles.availabilityTitle,
            formData.availability === "busy" &&
              styles.availabilityTitleActive,
          ]}
        >
          Busy
        </Text>

        <Text style={styles.availabilityDescription}>
          Temporarily unavailable
        </Text>
      </View>

      {formData.availability === "busy" && (
        <Ionicons
          name="checkmark"
          size={22}
          color="#f97316"
        />
      )}
    </TouchableOpacity>


    {/* OFFLINE */}
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        setFormData((prev) => ({
          ...prev,
          availability: "offline",
        }))
      }
      style={[
        styles.availabilityOption,
        formData.availability === "offline" &&
          styles.availabilityOfflineActive,
      ]}
    >
      <View
        style={[
          styles.availabilityIcon,
          formData.availability === "offline" &&
            styles.availabilityIconOffline,
        ]}
      >
        <Ionicons
          name="power-outline"
          size={24}
          color={
            formData.availability === "offline"
              ? "#9ca3af"
              : "#9ca3af"
          }
        />
      </View>

      <View style={styles.availabilityTextContainer}>
        <Text
          style={[
            styles.availabilityTitle,
            formData.availability === "offline" &&
              styles.availabilityTitleActive,
          ]}
        >
          Offline
        </Text>

        <Text style={styles.availabilityDescription}>
          Not currently available
        </Text>
      </View>

      {formData.availability === "offline" && (
        <Ionicons
          name="checkmark"
          size={22}
          color="#9ca3af"
        />
      )}
    </TouchableOpacity>

  </View>
</View>


        {/* ==================================
            SAVE
        ================================== */}

        <View
          style={styles.saveContainer}
        >

          <TouchableOpacity
            style={[
              styles.saveButton,
              (saving || uploadingImage) &&
              styles.disabledButton,
            ]}
            onPress={saveProfile}
            disabled={
              saving ||
              uploadingImage
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
              style={styles.saveButtonText}
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

<View style={styles.card}>

  <View style={styles.verificationHeader}>

    <View style={styles.verificationIcon}>
      <Ionicons
        name="shield-checkmark-outline"
        size={24}
        color="#22c55e"
      />
    </View>

    <View style={styles.verificationHeaderText}>

      <Text style={styles.sectionTitle}>
        Verification
      </Text>

      <Text style={styles.sectionDescription}>
        Verified workers get more visibility
        and build greater trust with customers.
      </Text>

    </View>

  </View>


  {/* NIN */}

  <View style={styles.inputGroup}>

    <Text style={styles.label}>
      NIN Number
    </Text>

    <TextInput
      value={nin}
      onChangeText={(value) => {

        // Only allow digits
        const digits =
          value.replace(/\D/g, "");

        // NIN is exactly 11 digits
        setNin(
          digits.slice(0, 11)
        );

      }}
      placeholder="Enter your 11-digit NIN"
      placeholderTextColor="#6b7280"
      keyboardType="number-pad"
      maxLength={11}
      style={styles.input}
    />

    <Text style={styles.verificationHint}>
      Your NIN is used only for identity
      verification.
    </Text>

  </View>


  {/* GOVERNMENT ID */}

  <View style={styles.inputGroup}>

    <Text style={styles.label}>
      Government ID
    </Text>

    <TouchableOpacity
      style={[
        styles.governmentIdButton,
        governmentId &&
          styles.governmentIdSelected,
      ]}
      onPress={pickGovernmentId}
      disabled={verificationLoading}
    >

      <Ionicons
        name={
          governmentId
            ? "checkmark-circle-outline"
            : "document-attach-outline"
        }
        size={22}
        color={
          governmentId
            ? "#22c55e"
            : "#f97316"
        }
      />

      <Text
        style={
          styles.governmentIdButtonText
        }
      >
        {governmentId
          ? "Government ID Selected"
          : "Upload Government ID"}
      </Text>

    </TouchableOpacity>

  </View>


  {/* DOCUMENT PREVIEW */}

  {governmentId ? (

    <View style={styles.governmentIdPreview}>

      <Image
        source={{
          uri: governmentId.uri,
        }}
        style={styles.governmentIdImage}
      />

      <TouchableOpacity
        style={styles.changeIdButton}
        onPress={pickGovernmentId}
        disabled={verificationLoading}
      >

        <Ionicons
          name="refresh-outline"
          size={18}
          color="#f97316"
        />

        <Text style={styles.changeIdText}>
          Change ID
        </Text>

      </TouchableOpacity>

    </View>

  ) : null}


  {/* SUBMIT */}

  <TouchableOpacity
    style={[
      styles.verificationButton,
      verificationLoading &&
        styles.disabledButton,
    ]}
    onPress={submitVerification}
    disabled={verificationLoading}
  >

    {verificationLoading ? (

      <>
        <ActivityIndicator
          size="small"
          color="#ffffff"
        />

        <Text style={styles.verificationButtonText}>
          Processing...
        </Text>
      </>

    ) : (

      <>
        <Ionicons
          name="shield-checkmark-outline"
          size={20}
          color="#ffffff"
        />

        <Text style={styles.verificationButtonText}>
          Submit Verification
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
            navigation.navigate("Home")
          }

          onWorkers={() =>
            navigation.navigate("Workers")
          }

          onRegister={() =>
            navigation.navigate("Register")
          }

        />

      </ScrollView>

    </SafeAreaView>
  );

};


export default WorkerProfileEditScreen;


// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#030712",
  },

  content: {
    paddingBottom: 40,
  },


  // ========================================
  // HEADER
  // ========================================

  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
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
    marginBottom: 16,

    padding: 20,

    backgroundColor: "#111827",

    borderWidth: 1,
    borderColor: "#1f2937",

    borderRadius: 20,
  },

  sectionTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
  },

  sectionDescription: {
    marginTop: 7,
    marginBottom: 16,

    color: "#6b7280",

    fontSize: 13,
    lineHeight: 20,
  },


  // ========================================
  // PHOTO
  // ========================================

  photoContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 25,
  },

  profileImageWrapper: {
    width: 130,
    height: 130,

    borderRadius: 25,

    overflow: "hidden",

    backgroundColor: "#1f2937",

    borderWidth: 1,
    borderColor: "#374151",
  },

  profileImage: {
    width: "100%",
    height: "100%",
  },

  profilePlaceholder: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",
  },

  changePhotoButton: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: 12,

    gap: 7,
  },

  changePhotoText: {
    color: "#f97316",
    fontSize: 14,
    fontWeight: "600",
  },


  // ========================================
  // INPUTS
  // ========================================

  inputGroup: {
    marginBottom: 17,
  },

  label: {
    marginBottom: 8,

    color: "#9ca3af",

    fontSize: 13,
    fontWeight: "500",
  },

  input: {
    minHeight: 52,

    paddingHorizontal: 15,

    backgroundColor: "#1f2937",

    borderWidth: 1,
    borderColor: "#374151",

    borderRadius: 15,

    color: "#ffffff",

    fontSize: 14,
  },

  disabledInput: {
    color: "#6b7280",
    backgroundColor: "#171f2d",
  },

  textArea: {
    minHeight: 150,

    paddingTop: 15,
    paddingBottom: 15,
  },

  // ========================================
  // SKILLS
  // ========================================

  skillInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  skillInput: {
    flex: 1,
  },

  addSkillButton: {
    minHeight: 52,

    paddingHorizontal: 16,

    borderRadius: 15,

    backgroundColor: "#f97316",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 5,
  },

  addSkillText: {
    color: "#ffffff",

    fontSize: 14,
    fontWeight: "700",
  },

  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",

    gap: 10,

    marginTop: 18,
  },

  skillChip: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 14,
    paddingVertical: 10,

    backgroundColor: "rgba(249,115,22,0.1)",

    borderWidth: 1,
    borderColor: "rgba(249,115,22,0.2)",

    borderRadius: 999,

    gap: 8,
  },

  skillText: {
    color: "#f97316",

    fontSize: 13,
    fontWeight: "600",
  },

  emptySkillsText: {
    marginTop: 16,

    color: "#6b7280",

    fontSize: 13,
  },


  // ========================================
  // ERROR
  // ========================================

  errorBox: {
    marginHorizontal: 20,
    marginBottom: 16,

    padding: 14,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor:
      "rgba(239,68,68,0.1)",

    borderWidth: 1,
    borderColor:
      "rgba(239,68,68,0.2)",

    borderRadius: 15,
  },

  errorText: {
    flex: 1,

    marginLeft: 9,

    color: "#ef4444",

    fontSize: 13,
    lineHeight: 19,
  },


  // ========================================
  // SAVE
  // ========================================

  saveContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  saveButton: {
    minHeight: 54,

    borderRadius: 15,

    backgroundColor: "#f97316",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 9,
  },

  disabledButton: {
    opacity: 0.6,
  },

  saveButtonText: {
    color: "#ffffff",

    fontSize: 15,
    fontWeight: "700",
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
    marginTop: 15,

    color: "#ffffff",

    fontSize: 20,
    fontWeight: "700",
  },

  centerText: {
    marginTop: 8,

    color: "#6b7280",

    fontSize: 14,
    lineHeight: 21,

    textAlign: "center",
  },

  loadingText: {
    marginTop: 12,

    color: "#9ca3af",

    fontSize: 14,
  },


  // ========================================
  // BUTTON
  // ========================================

  orangeButton: {
    marginTop: 20,

    paddingHorizontal: 30,
    paddingVertical: 13,

    borderRadius: 12,

    backgroundColor: "#f97316",
  },

  buttonText: {
    color: "#ffffff",

    fontSize: 14,
    fontWeight: "700",
  },

  rateInputContainer: {
    minHeight: 52,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#1f2937",

    borderWidth: 1,
    borderColor: "#374151",

    borderRadius: 15,
  },

  currencySymbol: {
    marginLeft: 15,

    color: "#f97316",

    fontSize: 18,
    fontWeight: "700",
  },

  rateInput: {
    flex: 1,

    minHeight: 52,

    paddingHorizontal: 10,

    color: "#ffffff",

    fontSize: 14,
  },

  ratePreview: {
    marginTop: 8,

    color: "#f97316",

    fontSize: 13,
    fontWeight: "600",
  },

  portfolioContainer: {
    marginTop: 18,
    gap: 15,
  },

  portfolioCard: {
    overflow: "hidden",

    backgroundColor: "#1f2937",

    borderWidth: 1,
    borderColor: "#374151",

    borderRadius: 18,
  },

  portfolioImage: {
    width: "100%",
    height: 190,
  },

  portfolioContent: {
    padding: 16,
  },

  portfolioHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },

  portfolioTitleContainer: {
    flex: 1,
  },

  portfolioTitle: {
    color: "#ffffff",

    fontSize: 17,
    fontWeight: "700",
  },

  portfolioLocation: {
    marginTop: 5,

    color: "#9ca3af",

    fontSize: 12,
  },

  portfolioDescription: {
    marginTop: 12,

    color: "#9ca3af",

    fontSize: 13,
    lineHeight: 20,
  },

  emptyPortfolioText: {
    marginTop: 16,

    color: "#6b7280",

    fontSize: 13,

    textAlign: "center",
  },

  addPortfolioContainer: {
    marginTop: 22,

    padding: 16,

    backgroundColor: "#030712",

    borderWidth: 1,
    borderColor: "#1f2937",

    borderRadius: 18,

    gap: 12,
  },

  addPortfolioTitle: {
    marginBottom: 3,

    color: "#ffffff",

    fontSize: 17,
    fontWeight: "700",
  },

  portfolioDescriptionInput: {
    minHeight: 130,

    paddingTop: 15,
    paddingBottom: 15,
  },

  portfolioImageButton: {
    minHeight: 52,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 8,

    backgroundColor: "#1f2937",

    borderWidth: 1,
    borderColor: "#374151",

    borderRadius: 15,
  },

  portfolioImageButtonText: {
    color: "#f97316",

    fontSize: 14,
    fontWeight: "600",
  },

  portfolioPreview: {
    width: "100%",
    height: 190,

    borderRadius: 15,
  },

  addPortfolioButton: {
    minHeight: 52,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 7,

    backgroundColor: "#f97316",

    borderRadius: 15,
  },

  addPortfolioButtonText: {
    color: "#ffffff",

    fontSize: 14,
    fontWeight: "700",
  },

  exactLocationContainer: {
  marginTop: 5,
  padding: 16,

  backgroundColor: "#030712",

  borderWidth: 1,
  borderColor: "#1f2937",

  borderRadius: 18,
},

exactLocationHeader: {
  flexDirection: "row",
  alignItems: "flex-start",
},

exactLocationIcon: {
  width: 42,
  height: 42,

  alignItems: "center",
  justifyContent: "center",

  backgroundColor: "rgba(249,115,22,0.1)",

  borderRadius: 12,
},

exactLocationTextContainer: {
  flex: 1,
  marginLeft: 12,
},

exactLocationTitle: {
  color: "#ffffff",

  fontSize: 15,
  fontWeight: "700",
},

exactLocationDescription: {
  marginTop: 5,

  color: "#9ca3af",

  fontSize: 12,
  lineHeight: 18,
},

locationButton: {
  minHeight: 50,

  marginTop: 15,

  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",

  gap: 8,

  backgroundColor: "#f97316",

  borderRadius: 14,
},

locationButtonText: {
  color: "#ffffff",

  fontSize: 14,
  fontWeight: "700",
},

locationSaved: {
  marginTop: 12,

  flexDirection: "row",
  alignItems: "center",

  gap: 7,
},

locationSavedText: {
  color: "#22c55e",

  fontSize: 12,
  fontWeight: "600",
},

locationHint: {
  marginTop: 12,

  color: "#6b7280",

  fontSize: 11,
  lineHeight: 17,
},

availabilityContainer: {
  gap: 12,
},

availabilityOption: {
  flexDirection: "row",
  alignItems: "center",
  padding: 16,
  borderRadius: 18,
  backgroundColor: "#1f2937",
  borderWidth: 1,
  borderColor: "#374151",
},

availabilityAvailableActive: {
  backgroundColor: "#14532d",
  borderColor: "#22c55e",
},

availabilityBusyActive: {
  backgroundColor: "#431407",
  borderColor: "#f97316",
},

availabilityOfflineActive: {
  backgroundColor: "#374151",
  borderColor: "#6b7280",
},

availabilityIcon: {
  width: 44,
  height: 44,
  borderRadius: 14,
  backgroundColor: "#111827",
  alignItems: "center",
  justifyContent: "center",
  marginRight: 14,
},

availabilityIconAvailable: {
  backgroundColor: "#166534",
},

availabilityIconBusy: {
  backgroundColor: "#7c2d12",
},

availabilityIconOffline: {
  backgroundColor: "#4b5563",
},

availabilityTextContainer: {
  flex: 1,
},

availabilityTitle: {
  color: "#ffffff",
  fontSize: 16,
  fontWeight: "700",
},

availabilityTitleActive: {
  fontWeight: "800",
},

availabilityDescription: {
  color: "#9ca3af",
  fontSize: 13,
  marginTop: 4,
},

// ========================================
// VERIFICATION
// ========================================

verificationHeader: {
  flexDirection: "row",
  alignItems: "flex-start",
  marginBottom: 20,
},

verificationIcon: {
  width: 46,
  height: 46,

  borderRadius: 14,

  alignItems: "center",
  justifyContent: "center",

  backgroundColor:
    "rgba(34,197,94,0.1)",

  marginRight: 12,
},

verificationHeaderText: {
  flex: 1,
},

verificationHint: {
  marginTop: 7,

  color: "#6b7280",

  fontSize: 11,
  lineHeight: 17,
},

governmentIdButton: {
  minHeight: 54,

  paddingHorizontal: 16,

  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",

  gap: 9,

  backgroundColor: "#1f2937",

  borderWidth: 1,
  borderColor: "#374151",

  borderRadius: 15,
},

governmentIdSelected: {
  borderColor: "#22c55e",
  backgroundColor: "rgba(34,197,94,0.08)",
},

governmentIdButtonText: {
  color: "#f97316",

  fontSize: 14,
  fontWeight: "600",
},

governmentIdPreview: {
  marginTop: 14,

  overflow: "hidden",

  backgroundColor: "#030712",

  borderWidth: 1,
  borderColor: "#1f2937",

  borderRadius: 15,
},

governmentIdImage: {
  width: "100%",
  height: 210,

  resizeMode: "cover",
},

changeIdButton: {
  minHeight: 46,

  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",

  gap: 7,

  borderTopWidth: 1,
  borderTopColor: "#1f2937",
},

changeIdText: {
  color: "#f97316",

  fontSize: 13,
  fontWeight: "600",
},

verificationButton: {
  minHeight: 54,

  marginTop: 5,

  borderRadius: 15,

  backgroundColor: "#f97316",

  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",

  gap: 9,
},

verificationButtonText: {
  color: "#ffffff",

  fontSize: 15,
  fontWeight: "700",
},

});