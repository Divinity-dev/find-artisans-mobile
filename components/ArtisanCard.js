import React from "react";
import {
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const ArtisanCard = ({ artisan, onPress }) => {
  const getWhatsAppNumber = (phone) => {
    if (!phone) return null;

    const cleaned = phone.replace(/\D/g, "");

    if (!cleaned) return null;

    return cleaned.replace(/^0/, "234");
  };

  const whatsappNumber = getWhatsAppNumber(artisan.phone);

  const handleWhatsApp = () => {
    if (!whatsappNumber) return;

    Linking.openURL(
      `https://wa.me/${whatsappNumber}`
    );
  };

  const skills = Array.isArray(artisan.skills)
    ? artisan.skills
    : [];

  return (
    <View style={styles.card}>

      {/* =====================================================
          IMAGE
      ====================================================== */}

      <View style={styles.imageContainer}>

        <Image
          source={
            artisan.profilePhoto
              ? { uri: artisan.profilePhoto }
              : require("../assets/images/download.jpeg")
          }
          style={styles.image}
          resizeMode="cover"
        />

        {/* Dark gradient-like overlay */}
        <View style={styles.imageOverlay} />

        {/* VERIFIED */}
        {artisan.verification?.isVerified && (
          <View style={styles.verifiedBadge}>

            <Text style={styles.verifiedIcon}>
              ✓
            </Text>

            <Text style={styles.verifiedText}>
              Verified
            </Text>

          </View>
        )}

      </View>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <View style={styles.content}>

        {/* NAME + ICON */}

        <View style={styles.nameRow}>

          <View style={styles.nameContainer}>

            <Text
              style={styles.name}
              numberOfLines={1}
            >
              {artisan.fullName ||
                "Unnamed Artisan"}
            </Text>

            {/* PRIMARY SKILL */}

            <Text
              style={styles.primarySkill}
              numberOfLines={1}
            >
              {artisan.skill ||
                "Skilled Artisan"}
            </Text>

          </View>

          <View style={styles.workerIcon}>
            <Text style={styles.workerIconText}>
              👤
            </Text>
          </View>

        </View>

        {/* =====================================================
            LOCATION
        ====================================================== */}

        <View style={styles.infoRow}>

          <Text style={styles.infoIcon}>
            📍
          </Text>

          <Text
            style={styles.infoText}
            numberOfLines={1}
          >
            {artisan.location?.city ||
              "Location unavailable"}

            {artisan.location?.state
              ? `, ${artisan.location.state}`
              : ""}
          </Text>

        </View>

        {/* =====================================================
            EXPERIENCE
        ====================================================== */}

        <View style={styles.infoRow}>

          <Text style={styles.infoIcon}>
            👤
          </Text>

          <Text style={styles.experienceText}>
            {artisan.yearsOfExperience || 0}{" "}
            {artisan.yearsOfExperience === 1
              ? "year"
              : "years"}{" "}
            experience
          </Text>

        </View>

        {/* =====================================================
            ADDITIONAL SKILLS
        ====================================================== */}

        {skills.length > 0 && (
          <View style={styles.skillsContainer}>

            {skills
              .slice(0, 3)
              .map((skill, index) => (
                <View
                  key={`${skill}-${index}`}
                  style={styles.skillTag}
                >
                  <Text style={styles.skillTagText}>
                    {skill}
                  </Text>
                </View>
              ))}

            {skills.length > 3 && (
              <View style={styles.skillTag}>

                <Text style={styles.moreSkills}>
                  +{skills.length - 3}
                </Text>

              </View>
            )}

          </View>
        )}

        {/* =====================================================
            ACTIONS
        ====================================================== */}

        <View style={styles.actions}>

          {/* VIEW PROFILE */}

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={styles.profileButton}
          >
            <Text style={styles.profileButtonText}>
              View Profile
            </Text>

            <Text style={styles.arrow}>
              →
            </Text>
          </TouchableOpacity>

          {/* WHATSAPP */}

          {whatsappNumber && (
           <Pressable
  onPress={handleWhatsApp}
  style={styles.whatsappButton}
  accessibilityLabel={`Chat with ${
    artisan.fullName || "artisan"
  } on WhatsApp`}
>
  <FontAwesome
    name="whatsapp"
    size={20}
    color="#ffffff"
  />
</Pressable>
          )}

        </View>

      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 16,
  },

  imageContainer: {
    width: "100%",
    height: 220,
    position: "relative",
  },

  image: {
    width: "100%",
    height: "100%",
    backgroundColor: "#1f2937",
  },

  imageOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 90,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },

  verifiedBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(22, 163, 74, 0.95)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  verifiedIcon: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "800",
    marginRight: 5,
  },

  verifiedText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "600",
  },

  content: {
    padding: 18,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  nameContainer: {
    flex: 1,
    minWidth: 0,
  },

  name: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
  },

  primarySkill: {
    color: "#f97316",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },

  workerIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(249, 115, 22, 0.10)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },

  workerIconText: {
    fontSize: 17,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 14,
  },

  infoIcon: {
    width: 22,
    fontSize: 14,
  },

  infoText: {
    flex: 1,
    color: "#9ca3af",
    fontSize: 13,
  },

  experienceText: {
    color: "#6b7280",
    fontSize: 13,
  },

  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 16,
  },

  skillTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: "#1f2937",
  },

  skillTagText: {
    color: "#9ca3af",
    fontSize: 11,
  },

  moreSkills: {
    color: "#6b7280",
    fontSize: 11,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#1f2937",
  },

  profileButton: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#f97316",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  profileButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "800",
  },

  arrow: {
    color: "#ffffff",
    fontSize: 16,
    marginLeft: 7,
  },

  whatsappButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#16a34a",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ArtisanCard;
