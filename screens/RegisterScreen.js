import React, { useState } from "react";

import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useNavigation } from "@react-navigation/native";

import { useAuth } from "../context/AuthContext";

const RegisterScreen = () => {
  const navigation = useNavigation();

  const { register } = useAuth();

  // ======================================
  // FORM STATE
  // ======================================

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [role, setRole] = useState("customer");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  // ======================================
  // UI STATE
  // ======================================

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState("");

  // ======================================
  // VALIDATION
  // ======================================

  const validateForm = () => {
    if (!fullName.trim()) {
      return "Full name is required";
    }

    if (fullName.trim().length < 3) {
      return "Full name is too short";
    }

    if (!email.trim()) {
      return "Email is required";
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      return "Invalid email";
    }

    if (!phone.trim()) {
      return "Phone number is required";
    }

    if (!/^[0-9]{11}$/.test(phone.trim())) {
      return "Phone number must be 11 digits";
    }

    if (!password) {
      return "Password is required";
    }

    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      return "Confirm password is required";
    }

    if (password !== confirmPassword) {
      return "Passwords do not match";
    }

    return "";
  };

  // ======================================
  // REGISTER
  // ======================================

  const handleRegister = async () => {
    setError("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      await register(
        fullName.trim(),
        email.trim(),
        phone.trim(),
        role,
        password
      );

      // Registration automatically
      // authenticates the user.

      navigation.navigate("Home");
    } catch (error) {
      setError(
        error.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.scrollContent
        }
      >
        <View style={styles.card}>

          {/* ======================================
              HEADER
          ====================================== */}

          <Text style={styles.title}>
            Create Account
          </Text>

          <Text style={styles.subtitle}>
            Join FindArtisans and get started.
          </Text>

          {/* ERROR */}

          {error ? (
            <Text style={styles.error}>
              {error}
            </Text>
          ) : null}

          {/* ======================================
              FULL NAME
          ====================================== */}

          <Text style={styles.label}>
            Full Name
          </Text>

          <TextInput
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your full name"
            placeholderTextColor="#6b7280"
            style={styles.input}
            autoCapitalize="words"
          />

          {/* ======================================
              EMAIL
          ====================================== */}

          <Text style={styles.label}>
            Email
          </Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#6b7280"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* ======================================
              PHONE
          ====================================== */}

          <Text style={styles.label}>
            Phone Number
          </Text>

          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="08012345678"
            placeholderTextColor="#6b7280"
            style={styles.input}
            keyboardType="phone-pad"
            maxLength={11}
          />

          {/* ======================================
              ROLE
          ====================================== */}

          <Text style={styles.label}>
            I want to join as
          </Text>

          <View style={styles.roleContainer}>

            {/* CUSTOMER */}

            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.roleButton,
                role === "customer" &&
                  styles.selectedRole,
              ]}
              onPress={() =>
                setRole("customer")
              }
            >
              <Text
                style={[
                  styles.roleText,
                  role === "customer" &&
                    styles.selectedRoleText,
                ]}
              >
                Customer
              </Text>
            </TouchableOpacity>

            {/* WORKER */}

            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.roleButton,
                role === "worker" &&
                  styles.selectedRole,
              ]}
              onPress={() =>
                setRole("worker")
              }
            >
              <Text
                style={[
                  styles.roleText,
                  role === "worker" &&
                    styles.selectedRoleText,
                ]}
              >
                Worker
              </Text>
            </TouchableOpacity>

          </View>

          {/* ======================================
              PASSWORD
          ====================================== */}

          <Text style={styles.label}>
            Password
          </Text>

          <View style={styles.passwordContainer}>

            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              placeholderTextColor="#6b7280"
              style={styles.passwordInput}
              secureTextEntry={!showPassword}
            />

            <TouchableOpacity
              onPress={() =>
                setShowPassword(
                  !showPassword
                )
              }
            >
              <Text style={styles.eye}>
                {showPassword ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>

          </View>

          {/* ======================================
              CONFIRM PASSWORD
          ====================================== */}

          <Text style={styles.label}>
            Confirm Password
          </Text>

          <View style={styles.passwordContainer}>

            <TextInput
              value={confirmPassword}
              onChangeText={
                setConfirmPassword
              }
              placeholder="Confirm password"
              placeholderTextColor="#6b7280"
              style={styles.passwordInput}
              secureTextEntry={
                !showConfirmPassword
              }
            />

            <TouchableOpacity
              onPress={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
            >
              <Text style={styles.eye}>
                {showConfirmPassword
                  ? "Hide"
                  : "Show"}
              </Text>
            </TouchableOpacity>

          </View>

          {/* ======================================
              SUBMIT
          ====================================== */}

          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.registerButton,
              loading &&
                styles.disabledButton,
            ]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text
              style={
                styles.registerButtonText
              }
            >
              {loading
                ? "Creating..."
                : "Create Account"}
            </Text>
          </TouchableOpacity>

          {/* ======================================
              LOGIN
          ====================================== */}

          <View style={styles.loginContainer}>

            <Text style={styles.loginText}>
              Already have an account?
            </Text>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Login")
              }
            >
              <Text style={styles.loginLink}>
                Login
              </Text>
            </TouchableOpacity>

          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;


// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#030712",
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },

  card: {
    width: "100%",
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 20,
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
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
  },

  error: {
    color: "#ef4444",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },

  label: {
    color: "#d1d5db",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 7,
    marginTop: 14,
  },

  input: {
    minHeight: 52,
    backgroundColor: "#1f2937",
    borderRadius: 12,
    paddingHorizontal: 14,
    color: "#ffffff",
    fontSize: 15,
  },

  roleContainer: {
    flexDirection: "row",
    gap: 10,
  },

  roleButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#374151",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1f2937",
  },

  selectedRole: {
    backgroundColor: "#f97316",
    borderColor: "#f97316",
  },

  roleText: {
    color: "#9ca3af",
    fontSize: 15,
    fontWeight: "600",
  },

  selectedRoleText: {
    color: "#ffffff",
  },

  passwordContainer: {
    minHeight: 52,
    backgroundColor: "#1f2937",
    borderRadius: 12,
    paddingLeft: 14,
    paddingRight: 12,

    flexDirection: "row",
    alignItems: "center",
  },

  passwordInput: {
    flex: 1,
    color: "#ffffff",
    fontSize: 15,
  },

  eye: {
    color: "#fb923c",
    fontSize: 13,
    fontWeight: "600",
  },

  registerButton: {
    minHeight: 54,
    backgroundColor: "#f97316",
    borderRadius: 12,

    alignItems: "center",
    justifyContent: "center",

    marginTop: 24,
  },

  disabledButton: {
    opacity: 0.6,
  },

  registerButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    marginTop: 20,
  },

  loginText: {
    color: "#9ca3af",
    fontSize: 14,
  },

  loginLink: {
    color: "#f97316",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 5,
  },
});