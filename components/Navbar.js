import React, { useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  Image,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigation = useNavigation();

  const [isOpen, setIsOpen] = useState(false);

  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  // ======================================
  // NAVIGATION
  // ======================================

  const handleNavigation = (screen) => {
    setIsOpen(false);
    navigation.navigate(screen);
  };

  // ======================================
  // LOGOUT
  // ======================================

  const handleLogout = async () => {
    setIsOpen(false);

    await logout();

    navigation.navigate("Home");
  };

  // ======================================
  // DASHBOARD
  // ======================================

  const handleDashboard = () => {
    setIsOpen(false);

    if (user?.role === "admin") {
      // We'll add this screen later
      // navigation.navigate("Admin");
    } else if (user?.role === "worker") {
      // We'll add this screen later
      // navigation.navigate("WorkersDashboard");
    } else {
      // We'll add this screen later
      // navigation.navigate("CustomersDashboard");
    }
  };

  return (
    <>
      {/* ======================================
          NAVBAR
      ====================================== */}

      <View style={styles.navbar}>

        {/* LOGO */}

        <TouchableOpacity
          onPress={() => handleNavigation("Home")}
          style={styles.logoContainer}
        >
          <Text style={styles.logoFind}>
            Find
          </Text>

          <Text style={styles.logoArtisans}>
            Artisans
          </Text>
        </TouchableOpacity>

        {/* RIGHT SIDE */}

        <View style={styles.rightContainer}>

          {isAuthenticated && (
  <TouchableOpacity
    onPress={() => setIsOpen(true)}
    style={styles.profileButton}
  >
    {user?.profilePhoto ? (
      <Image
        source={{
          uri: user.profilePhoto,
        }}
        style={styles.profileImage}
      />
    ) : (
      <View style={styles.profilePlaceholder}>
        <Text style={styles.profileIcon}>
          👤
        </Text>
      </View>
    )}
  </TouchableOpacity>
)}

          {/* MENU BUTTON */}

          <TouchableOpacity
            onPress={() => setIsOpen(true)}
            style={styles.menuButton}
          >
            <Text style={styles.menuIcon}>
              ☰
            </Text>
          </TouchableOpacity>

        </View>
      </View>

      {/* ======================================
          MOBILE MENU
      ====================================== */}

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsOpen(false)}
        >

          <Pressable
            style={styles.menuContainer}
            onPress={(event) =>
              event.stopPropagation()
            }
          >

            {/* MENU HEADER */}

            <View style={styles.menuHeader}>

              <View style={styles.menuLogo}>
                <Text style={styles.logoFind}>
                  Find
                </Text>

                <Text style={styles.logoArtisans}>
                  Artisans
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setIsOpen(false)}
              >
                <Text style={styles.closeIcon}>
                  ×
                </Text>
              </TouchableOpacity>

            </View>

            {/* ======================================
                NAVIGATION LINKS
            ====================================== */}

            <View style={styles.linksContainer}>

              {/* HOME */}

              <TouchableOpacity
                style={styles.navLink}
                onPress={() =>
                  handleNavigation("Home")
                }
              >
                <Text style={styles.navLinkText}>
                  Home
                </Text>
              </TouchableOpacity>

              {/* FIND WORKERS */}

              <TouchableOpacity
                style={styles.navLink}
                onPress={() =>
                  handleNavigation("Workers")
                }
              >
                <Text style={styles.navLinkText}>
                  Find Workers
                </Text>
              </TouchableOpacity>

              {/* JOBS */}

<TouchableOpacity
  style={styles.navLink}
  onPress={() =>
    handleNavigation("Jobs")
  }
>
  <Text style={styles.navLinkText}>
    Jobs
  </Text>
</TouchableOpacity>

              {/* ======================================
                  AUTHENTICATED USER
              ====================================== */}

              {isAuthenticated && (
                <>
                  <TouchableOpacity
                    style={styles.navLink}
                    onPress={handleDashboard}
                  >
                    <Text style={styles.navIcon}>
                      ▣
                    </Text>

                    <Text
                      style={[
                        styles.navLinkText,
                        styles.iconLinkText,
                      ]}
                    >
                      Dashboard
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.navLink}
                    onPress={handleDashboard}
                  >
                    {user?.profilePhoto ? (
                      <Image
                        source={{
                          uri: user.profilePhoto,
                        }}
                        style={styles.smallProfileImage}
                      />
                    ) : (
                      <Text style={styles.navIcon}>
                        👤
                      </Text>
                    )}

                    <Text
                      style={[
                        styles.navLinkText,
                        styles.iconLinkText,
                      ]}
                    >
                      Profile
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.divider} />

                  {/* LOGOUT */}

                  <TouchableOpacity
                    style={styles.navLink}
                    onPress={handleLogout}
                  >
                    <Text style={styles.logoutIcon}>
                      ↪
                    </Text>

                    <Text
                      style={[
                        styles.navLinkText,
                        styles.logoutText,
                        styles.iconLinkText,
                      ]}
                    >
                      Logout
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              {/* ======================================
                  LOGGED OUT USER
              ====================================== */}

              {!isAuthenticated && (
                <>
                  <View style={styles.divider} />

                  <TouchableOpacity
                    style={styles.navLink}
                    onPress={() =>
                      handleNavigation("Login")
                    }
                  >
                    <Text style={styles.navLinkText}>
                      Login
                    </Text>
                  </TouchableOpacity>

                  {/* Register screen will be added later */}

                  <TouchableOpacity
  style={styles.signupButton}
  onPress={() =>
    handleNavigation("Register")
  }
>
  <Text style={styles.signupText}>
    Sign Up
  </Text>
</TouchableOpacity>
                </>
              )}

            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

export default Navbar;


// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({

  navbar: {
    height: 64,

    backgroundColor: "#111827",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: 18,

    borderBottomWidth: 1,
    borderBottomColor: "#1f2937",
  },

  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  menuLogo: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoFind: {
    fontSize: 22,
    fontWeight: "800",
    color: "#ffffff",
  },

  logoArtisans: {
    fontSize: 22,
    fontWeight: "800",
    color: "#f97316",
  },

  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  loginText: {
    color: "#d1d5db",
    fontSize: 16,
    fontWeight: "500",
  },

  menuButton: {
    marginLeft: 18,
    padding: 2,
  },

  menuIcon: {
    color: "#ffffff",
    fontSize: 28,
    lineHeight: 30,
  },

  profileButton: {
    alignItems: "center",
    justifyContent: "center",
  },

  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,

    borderWidth: 2,
    borderColor: "#374151",
  },

  profilePlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,

    backgroundColor: "#1f2937",

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 2,
    borderColor: "#374151",
  },

  profileIcon: {
    fontSize: 18,
  },

  // ========================================
  // MODAL
  // ========================================

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  menuContainer: {
    position: "absolute",

    top: 0,
    right: 0,
    bottom: 0,

    width: "78%",

    backgroundColor: "#111827",

    paddingTop: 20,
    paddingHorizontal: 20,
  },

  menuHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingBottom: 20,

    borderBottomWidth: 1,
    borderBottomColor: "#1f2937",
  },

  closeIcon: {
    color: "#ffffff",
    fontSize: 36,
    fontWeight: "300",
  },

  linksContainer: {
    paddingTop: 12,
  },

  navLink: {
    minHeight: 50,

    flexDirection: "row",
    alignItems: "center",

    paddingVertical: 12,
  },

  navLinkText: {
    color: "#d1d5db",
    fontSize: 16,
    fontWeight: "500",
  },

  navIcon: {
    color: "#d1d5db",
    fontSize: 18,
  },

  iconLinkText: {
    marginLeft: 10,
  },

  divider: {
    height: 1,
    backgroundColor: "#374151",
    marginVertical: 10,
  },

  smallProfileImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },

  logoutIcon: {
    color: "#f87171",
    fontSize: 20,
  },

  logoutText: {
    color: "#f87171",
  },

  signupButton: {
    marginTop: 8,

    backgroundColor: "#f97316",

    paddingVertical: 12,

    borderRadius: 8,

    alignItems: "center",
  },

  signupText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});