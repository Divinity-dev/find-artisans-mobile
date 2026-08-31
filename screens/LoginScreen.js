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

  const { login } = useAuth();

  // ======================================
  // FORM STATE
  // ======================================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ======================================
  // UI STATE
  // ======================================

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ======================================
  // LOGIN
  // ======================================

  const handleLogin = async () => {
    setError("");

    // ====================================
    // VALIDATION
    // ====================================

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

      // ====================================
      // LOGIN THROUGH AUTH CONTEXT
      // ====================================

      const data = await login(
        email.trim().toLowerCase(),
        password
      );

      // ====================================
      // VERIFY RESPONSE
      // ====================================

      if (!data?.user) {
        throw new Error(
          "Login failed. Please try again."
        );
      }

      // ====================================
      // EMAIL VERIFICATION
      // ====================================

      if (!data.user.isEmailVerified) {
        setError(
          "Please verify your email before logging in."
        );

        return;
      }

      /*
       * IMPORTANT:
       *
       * We do NOT navigate manually here.
       *
       * AuthContext.login() has already updated:
       *
       *   setToken(data.token)
       *   setUser(data.user)
       *
       * AppNavigator watches those values.
       *
       * It will automatically switch to:
       *
       *   worker   → WorkerDashboard
       *   customer → CustomerDashboard
       *
       * This prevents a navigation race condition
       * between LoginScreen and AppNavigator.
       */

    } catch (error) {
      console.error(
        "Mobile login error:",
        error
      );

      const message =
        error?.message ||
        "Login failed. Please try again.";

      // ====================================
      // EMAIL VERIFICATION ERROR
      // ====================================

      if (
        message
          .toLowerCase()
          .includes("verify your email")
      ) {
        setError(
          "Your email has not been verified yet. Please check your email and click the verification link before logging in."
        );

        return;
      }

      // ====================================
      // SUSPENDED ACCOUNT
      // ====================================

      if (
        message
          .toLowerCase()
          .includes("account suspended")
      ) {
        setError(
          "Your account has been suspended. Please contact FindArtisans support."
        );

        return;
      }

      // ====================================
      // GENERAL ERROR
      // ====================================

      setError(message);

    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // REGISTER
  // ======================================

  const handleRegister = () => {
    navigation.navigate("Register");
  };

  // ======================================
  // FORGOT PASSWORD
  // ======================================

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  // ======================================
  // RENDER
  // ======================================

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

          <View style={styles.header}>

            <Text style={styles.title}>
              Welcome Back
            </Text>

            <Text style={styles.subtitle}>
              Login to access your FindArtisans account
            </Text>

          </View>


          {/* ==================================
              EMAIL
          ================================== */}

          <View style={styles.field}>

            <Text style={styles.label}>
              Email
            </Text>

            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor="#6b7280"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setError("");
              }}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              autoComplete="email"
              editable={!loading}
            />

          </View>


          {/* ==================================
              PASSWORD
          ================================== */}

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
                onChangeText={(text) => {
                  setPassword(text);
                  setError("");
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="password"
                editable={!loading}
              />

              <TouchableOpacity
                onPress={() =>
                  setShowPassword(!showPassword)
                }
                disabled={loading}
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
              onPress={handleForgotPassword}
              disabled={loading}
            >

              <Text style={styles.forgotText}>
                Forgot password?
              </Text>

            </TouchableOpacity>

          </View>


          {/* ==================================
              ERROR
          ================================== */}

          {error ? (
            <View style={styles.errorContainer}>

              <Text style={styles.error}>
                {error}
              </Text>

              {error
                .toLowerCase()
                .includes("verify") && (

                <Text
                  style={
                    styles.verificationHint
                  }
                >
                  Check your inbox and spam folder
                  for the FindArtisans verification
                  email.
                </Text>

              )}

            </View>
          ) : null}


          {/* ==================================
              LOGIN BUTTON
          ================================== */}

          <TouchableOpacity
            style={[
              styles.loginButton,
              loading &&
                styles.disabledButton,
            ]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >

            {loading ? (

              <ActivityIndicator
                color="#ffffff"
              />

            ) : (

              <Text
                style={
                  styles.loginButtonText
                }
              >
                Login
              </Text>

            )}

          </TouchableOpacity>


          {/* ==================================
              REGISTER
          ================================== */}

          <View
            style={styles.registerContainer}
          >

            <Text
              style={styles.registerText}
            >
              Don't have an account?
            </Text>

            <TouchableOpacity
              onPress={handleRegister}
              disabled={loading}
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


// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({

// ==========================================
// CONTAINER
// ==========================================

container: {
flex: 1,
backgroundColor: "#030712",
},

keyboardView: {
flex: 1,
justifyContent: "center",
paddingHorizontal: 20,
paddingVertical: 30,
},

// ==========================================
// LOGIN CARD
// ==========================================

card: {
width: "100%",
maxWidth: 450,
alignSelf: "center",


backgroundColor: "#111827",

borderRadius: 24,

borderWidth: 1,
borderColor: "#1f2937",

padding: 24,

// Important for Expo Web
overflow: "hidden",


},

// ==========================================
// HEADER
// ==========================================

header: {
alignItems: "center",
marginBottom: 30,
},

title: {
color: "#ffffff",
fontSize: 30,
fontWeight: "800",
textAlign: "center",
},

subtitle: {
color: "#9ca3af",
fontSize: 14,


textAlign: "center",

marginTop: 8,

lineHeight: 20,

maxWidth: 360,


},

// ==========================================
// FORM FIELD
// ==========================================

field: {
width: "100%",
marginBottom: 18,


// Prevent children from expanding the field
minWidth: 0,


},

label: {
color: "#d1d5db",


fontSize: 14,
fontWeight: "600",

marginBottom: 8,


},

// ==========================================
// EMAIL INPUT
// ==========================================

input: {
width: "100%",
minWidth: 0,


backgroundColor: "#1f2937",

borderWidth: 1,
borderColor: "#374151",

borderRadius: 12,

color: "#ffffff",

paddingHorizontal: 14,
paddingVertical: 13,

fontSize: 15,

// Prevent text/input from causing overflow
flexShrink: 1,


},

// ==========================================
// PASSWORD
// ==========================================

passwordContainer: {
width: "100%",
minWidth: 0,


flexDirection: "row",
alignItems: "center",

backgroundColor: "#1f2937",

borderWidth: 1,
borderColor: "#374151",

borderRadius: 12,

// Important
overflow: "hidden",

flexShrink: 1,


},

passwordInput: {
flex: 1,
minWidth: 0,


color: "#ffffff",

paddingHorizontal: 14,
paddingVertical: 13,

fontSize: 15,

// Prevent input from pushing the Show button outside
flexShrink: 1,


},

showText: {
color: "#fb923c",


fontWeight: "600",

marginRight: 14,

flexShrink: 0,


},

// ==========================================
// FORGOT PASSWORD
// ==========================================

forgotButton: {
alignSelf: "flex-end",


marginTop: 8,


},

forgotText: {
color: "#fb923c",


fontSize: 13,

fontWeight: "600",


},

// ==========================================
// ERROR
// ==========================================

errorContainer: {
width: "100%",


marginBottom: 15,

paddingHorizontal: 4,


},

error: {
color: "#ef4444",


fontSize: 14,

textAlign: "center",

lineHeight: 20,


},

verificationHint: {
color: "#9ca3af",


fontSize: 13,

textAlign: "center",

lineHeight: 19,

marginTop: 6,


},

// ==========================================
// LOGIN BUTTON
// ==========================================

loginButton: {
width: "100%",


backgroundColor: "#f97316",

minHeight: 54,

borderRadius: 14,

alignItems: "center",
justifyContent: "center",

flexShrink: 1,


},

disabledButton: {
opacity: 0.7,
},

loginButtonText: {
color: "#ffffff",


fontSize: 16,

fontWeight: "700",


},

// ==========================================
// REGISTER
// ==========================================

registerContainer: {
flexDirection: "row",


justifyContent: "center",
alignItems: "center",

marginTop: 22,

flexWrap: "wrap",


},

registerText: {
color: "#9ca3af",


fontSize: 14,


},

registerLink: {
color: "#f97316",


fontSize: 14,

fontWeight: "700",

marginLeft: 5,


},

});


export default LoginScreen;

