import React, { useState } from "react";

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { useNavigation } from "@react-navigation/native";

import { useAuth } from "../context/AuthContext";

const LoginScreen = () => {
  const navigation = useNavigation();

  const {
    login,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  // ======================================
  // HANDLE LOGIN
  // ======================================

  const handleLogin = async () => {
    setError("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    try {
      setLoading(true);

      await login(
        email.trim().toLowerCase(),
        password
      );

      // Login succeeded
      navigation.replace("Home");
    } catch (error) {
      setError(
        error.message ||
          "Login failed. Please try again."
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

          {/* HEADER */}

          <View style={styles.header}>
            <Text style={styles.title}>
              Welcome Back
            </Text>

            <Text style={styles.subtitle}>
              Login to access your
              artisan account
            </Text>
          </View>

          {/* EMAIL */}

          <View style={styles.field}>
            <Text style={styles.label}>
              Email
            </Text>

            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor="#6b7280"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
          </View>

          {/* PASSWORD */}

          <View style={styles.field}>
            <Text style={styles.label}>
              Password
            </Text>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="••••••••"
                placeholderTextColor="#6b7280"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password"
              />

              <TouchableOpacity
                onPress={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                <Text style={styles.showText}>
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* FORGOT PASSWORD */}

            <TouchableOpacity
              style={styles.forgotButton}
               onPress={() =>
    navigation.navigate("ForgotPassword")
  }
            >
              <Text style={styles.forgotText}>
                Forgot password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* ERROR */}

          {error ? (
            <Text style={styles.error}>
              {error}
            </Text>
          ) : null}

          {/* LOGIN */}

          <TouchableOpacity
            style={[
              styles.loginButton,
              loading &&
                styles.disabledButton,
            ]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator
                color="#ffffff"
              />
            ) : (
              <Text
                style={styles.loginButtonText}
              >
                Login
              </Text>
            )}
          </TouchableOpacity>

          {/* REGISTER */}

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>
              Don't have an account?{" "}
            </Text>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate(
                  "Register"
                )
              }
            >
              <Text
                style={styles.registerLink}
              >
                Sign up
              </Text>
            </TouchableOpacity>
          </View>

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

  header: {
    alignItems: "center",
    marginBottom: 30,
  },

  title: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "800",
  },

  subtitle: {
    color: "#9ca3af",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },

  field: {
    marginBottom: 18,
  },

  label: {
    color: "#d1d5db",
    fontSize: 14,
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#1f2937",
    borderWidth: 1,
    borderColor: "#374151",
    borderRadius: 12,
    color: "#ffffff",
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
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

  forgotButton: {
    alignSelf: "flex-end",
    marginTop: 8,
  },

  forgotText: {
    color: "#fb923c",
    fontSize: 13,
  },

  error: {
    color: "#ef4444",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 15,
  },

  loginButton: {
    backgroundColor: "#f97316",
    minHeight: 54,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  disabledButton: {
    opacity: 0.7,
  },

  loginButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },

  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 22,
  },

  registerText: {
    color: "#9ca3af",
    fontSize: 14,
  },

  registerLink: {
    color: "#f97316",
    fontSize: 14,
    fontWeight: "700",
  },
});

export default LoginScreen;