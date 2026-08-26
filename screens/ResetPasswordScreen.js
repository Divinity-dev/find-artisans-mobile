import React, { useState } from "react";

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { StatusBar } from "expo-status-bar";

import { useNavigation, useRoute } from "@react-navigation/native";

const ResetPasswordScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // ======================================
  // EMAIL
  // ======================================

  const email = route.params?.email || "";

  // ======================================
  // FORM STATE
  // ======================================

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  // ======================================
  // UI STATE
  // ======================================

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ======================================
  // RESET PASSWORD
  // ======================================

  const handleResetPassword = async () => {
    setError("");

    // --------------------------------------
    // VALIDATION
    // --------------------------------------

    if (!password) {
      setError("Password is required.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (!confirmPassword) {
      setError(
        "Confirm password is required."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!email) {
      setError(
        "Email is missing. Please restart the password reset process."
      );
      return;
    }

    // --------------------------------------
    // API REQUEST
    // --------------------------------------

    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/reset-password`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to reset password"
        );
      }

      // --------------------------------------
      // SUCCESS
      // --------------------------------------

      // Password has been changed.
      // Send the user back to login.

      navigation.replace("Login");

    } catch (error) {
      setError(
        error.message ||
          "Failed to reset password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <View style={styles.card}>

          {/* ==================================
              HEADER
          ================================== */}

          <Text style={styles.title}>
            Reset Password
          </Text>

          <Text style={styles.subtitle}>
            Create a new password for your
            account.
          </Text>

          {/* ==================================
              EMAIL
          ================================== */}

          {email ? (
            <Text style={styles.emailText}>
              {email}
            </Text>
          ) : null}

          {/* ==================================
              ERROR
          ================================== */}

          {error ? (
            <Text style={styles.error}>
              {error}
            </Text>
          ) : null}

          {/* ==================================
              NEW PASSWORD
          ================================== */}

          <View style={styles.field}>
            <Text style={styles.label}>
              New Password
            </Text>

            <View
              style={
                styles.passwordContainer
              }
            >
              <TextInput
                style={
                  styles.passwordInput
                }
                placeholder="••••••••"
                placeholderTextColor="#6b7280"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={
                  !showPassword
                }
                autoCapitalize="none"
              />

              <TouchableOpacity
                onPress={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                <Text
                  style={styles.showText}
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ==================================
              CONFIRM PASSWORD
          ================================== */}

          <View style={styles.field}>
            <Text style={styles.label}>
              Confirm Password
            </Text>

            <View
              style={
                styles.passwordContainer
              }
            >
              <TextInput
                style={
                  styles.passwordInput
                }
                placeholder="••••••••"
                placeholderTextColor="#6b7280"
                value={
                  confirmPassword
                }
                onChangeText={
                  setConfirmPassword
                }
                secureTextEntry={
                  !showConfirmPassword
                }
                autoCapitalize="none"
              />

              <TouchableOpacity
                onPress={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >
                <Text
                  style={styles.showText}
                >
                  {showConfirmPassword
                    ? "Hide"
                    : "Show"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ==================================
              RESET BUTTON
          ================================== */}

          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.resetButton,
              loading &&
                styles.disabledButton,
            ]}
            onPress={
              handleResetPassword
            }
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator
                color="#ffffff"
              />
            ) : (
              <Text
                style={
                  styles.resetButtonText
                }
              >
                Reset Password
              </Text>
            )}
          </TouchableOpacity>

          {/* ==================================
              BACK TO LOGIN
          ================================== */}

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() =>
              navigation.replace("Login")
            }
          >
            <Text
              style={styles.loginText}
            >
              Back to Login
            </Text>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030712",
  },

  keyboardView: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },

  card: {
    width: "100%",
    maxWidth: 450,
    alignSelf: "center",

    backgroundColor: "#111827",

    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#1f2937",

    padding: 24,
  },

  title: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
  },

  subtitle: {
    color: "#9ca3af",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 12,
  },

  emailText: {
    color: "#fb923c",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },

  error: {
    color: "#ef4444",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 15,
  },

  field: {
    marginBottom: 18,
  },

  label: {
    color: "#d1d5db",
    fontSize: 14,
    marginBottom: 8,
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#1f2937",

    borderWidth: 1,
    borderColor: "#374151",

    borderRadius: 12,
  },

  passwordInput: {
    flex: 1,

    color: "#ffffff",

    paddingHorizontal: 14,
    paddingVertical: 13,

    fontSize: 15,
  },

  showText: {
    color: "#fb923c",
    fontWeight: "600",
    marginRight: 14,
  },

  resetButton: {
    backgroundColor: "#f97316",

    minHeight: 54,

    borderRadius: 14,

    alignItems: "center",
    justifyContent: "center",

    marginTop: 5,
  },

  disabledButton: {
    opacity: 0.7,
  },

  resetButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },

  loginButton: {
    alignItems: "center",
    marginTop: 20,
  },

  loginText: {
    color: "#fb923c",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default ResetPasswordScreen;