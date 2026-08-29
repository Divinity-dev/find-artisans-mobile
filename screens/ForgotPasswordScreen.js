import React, { useEffect, useRef, useState } from "react";

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useNavigation } from "@react-navigation/native";

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();

  // ======================================
  // EMAIL
  // ======================================

  const [email, setEmail] = useState("");

  // ======================================
  // OTP
  // ======================================

  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const inputsRef = useRef([]);

  // ======================================
  // UI STATE
  // ======================================

  const [step, setStep] = useState("email");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // ======================================
  // TIMER
  // ======================================

  const [timer, setTimer] = useState(600);

  useEffect(() => {
    if (step !== "otp") {
      return;
    }

    if (timer <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setTimer((previous) =>
        previous <= 1
          ? 0
          : previous - 1
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [step, timer]);

  // ======================================
  // SEND OTP
  // ======================================

  const handleSendOtp = async () => {
    setError("");

    const trimmedEmail =
      email.trim();

    if (!trimmedEmail) {
      setError("Email is required");
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/forgot-password`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: trimmedEmail,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to send OTP"
        );
      }

      setEmail(trimmedEmail);

      setOtp([
        "",
        "",
        "",
        "",
        "",
        "",
      ]);

      setTimer(600);

      setStep("otp");
    } catch (error) {
      setError(
        error.message ||
          "Failed to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // OTP CHANGE
  // ======================================

  const handleOtpChange = (
    value,
    index
  ) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];

    newOtp[index] = value;

    setOtp(newOtp);

    // Move to next input
    if (
      value &&
      index < 5
    ) {
      inputsRef.current[
        index + 1
      ]?.focus();
    }
  };

  // ======================================
  // OTP BACKSPACE
  // ======================================

  const handleOtpKeyPress = (
    event,
    index
  ) => {
    if (
      event.nativeEvent.key ===
        "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputsRef.current[
        index - 1
      ]?.focus();
    }
  };

  // ======================================
  // VERIFY OTP
  // ======================================

  const handleVerifyOtp =
    async () => {
      if (loading) {
        return;
      }

      setError("");

      const finalOtp =
        otp.join("").trim();

      if (finalOtp.length !== 6) {
        setError(
          "Enter full 6-digit OTP"
        );
        return;
      }

      if (!email.trim()) {
        setError(
          "Email missing. Please try again."
        );
        return;
      }

      try {
        setLoading(true);

        const response =
          await fetch(
            `${process.env.EXPO_PUBLIC_API_URL}/auth/verify-otp`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                email:
                  email.trim(),
                otp: finalOtp,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Invalid or expired OTP"
          );
        }

        // OTP verified successfully.
        navigation.navigate(
          "ResetPassword",
          {
            email:
              email.trim(),
          }
        );
      } catch (error) {
        setError(
          error.message ||
            "Invalid or expired OTP"
        );
      } finally {
        setLoading(false);
      }
    };

  // ======================================
  // RESEND OTP
  // ======================================

  const handleResendOtp =
    async () => {
      if (loading) {
        return;
      }

      setError("");

      try {
        setLoading(true);

        const response =
          await fetch(
            `${process.env.EXPO_PUBLIC_API_URL}/auth/forgot-password`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                email:
                  email.trim(),
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to resend OTP"
          );
        }

        setOtp([
          "",
          "",
          "",
          "",
          "",
          "",
        ]);

        setTimer(600);

        // Focus first OTP box
        inputsRef.current[0]?.focus();
      } catch (error) {
        setError(
          error.message ||
            "Failed to resend OTP"
        );
      } finally {
        setLoading(false);
      }
    };

  // ======================================
  // TIMER FORMAT
  // ======================================

  const minutes =
    Math.floor(timer / 60);

  const seconds =
    String(timer % 60).padStart(
      2,
      "0"
    );

  // ======================================
  // RENDER
  // ======================================

  return (
    <SafeAreaView
      style={styles.container}
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={
            styles.scrollContent
          }
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>

            {/* ==================================
                BACK
            ================================== */}

            <TouchableOpacity
              onPress={() =>
                navigation.goBack()
              }
              style={styles.backButton}
            >
              <Text
                style={styles.backText}
              >
                ← Back
              </Text>
            </TouchableOpacity>

            {/* ==================================
                EMAIL STEP
            ================================== */}

            {step === "email" && (
              <>
                <Text
                  style={styles.title}
                >
                  Forgot Password
                </Text>

                <Text
                  style={styles.subtitle}
                >
                  Enter the email address
                  associated with your
                  account and we'll send
                  you an OTP.
                </Text>

                {error ? (
                  <Text
                    style={styles.error}
                  >
                    {error}
                  </Text>
                ) : null}

                <Text
                  style={styles.label}
                >
                  Email
                </Text>

                <TextInput
                  value={email}
                  onChangeText={
                    setEmail
                  }
                  placeholder="Enter email"
                  placeholderTextColor="#6b7280"
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    styles.button,
                    loading &&
                      styles.disabledButton,
                  ]}
                  onPress={
                    handleSendOtp
                  }
                  disabled={loading}
                >
                  <Text
                    style={
                      styles.buttonText
                    }
                  >
                    {loading
                      ? "Sending..."
                      : "Send OTP"}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {/* ==================================
                OTP STEP
            ================================== */}

            {step === "otp" && (
              <>
                <Text
                  style={styles.title}
                >
                  Enter OTP
                </Text>

                <Text
                  style={styles.subtitle}
                >
                  Enter the 6-digit code
                  sent to
                </Text>

                <Text
                  style={styles.emailText}
                >
                  {email}
                </Text>

                <Text
                  style={styles.timer}
                >
                  Expires in{" "}
                  {minutes}:{seconds}
                </Text>

                {error ? (
                  <Text
                    style={styles.error}
                  >
                    {error}
                  </Text>
                ) : null}

                {/* OTP INPUTS */}

                <View
                  style={
                    styles.otpContainer
                  }
                >
                  {otp.map(
                    (value, index) => (
                      <TextInput
                        key={index}
                        ref={(ref) => {
                          inputsRef.current[
                            index
                          ] = ref;
                        }}
                        value={value}
                        onChangeText={(
                          text
                        ) =>
                          handleOtpChange(
                            text,
                            index
                          )
                        }
                        onKeyPress={(
                          event
                        ) =>
                          handleOtpKeyPress(
                            event,
                            index
                          )
                        }
                        keyboardType="number-pad"
                        maxLength={1}
                        style={
                          styles.otpInput
                        }
                        textAlign="center"
                      />
                    )
                  )}
                </View>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    styles.verifyButton,
                    loading &&
                      styles.disabledButton,
                  ]}
                  onPress={
                    handleVerifyOtp
                  }
                  disabled={loading}
                >
                  <Text
                    style={
                      styles.buttonText
                    }
                  >
                    {loading
                      ? "Verifying..."
                      : "Verify OTP"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={
                    handleResendOtp
                  }
                  disabled={
                    loading ||
                    timer > 0
                  }
                >
                  <Text
                    style={[
                      styles.resendText,
                      (loading ||
                        timer > 0) &&
                        styles.disabledResend,
                    ]}
                  >
                    {timer > 0
                      ? `Resend OTP in ${minutes}:${seconds}`
                      : "Resend OTP"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    setStep("email")
                  }
                >
                  <Text
                    style={
                      styles.changeEmailText
                    }
                  >
                    Use a different email
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;


// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030712",
  },

  keyboardView: {
    flex: 1,
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

  backButton: {
    marginBottom: 20,
  },

  backText: {
    color: "#fb923c",
    fontSize: 14,
    fontWeight: "600",
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
    lineHeight: 21,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
  },

  emailText: {
    color: "#f97316",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginTop: -10,
    marginBottom: 16,
  },

  error: {
    color: "#f87171",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 15,
  },

  label: {
    color: "#d1d5db",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },

  input: {
    minHeight: 54,
    backgroundColor: "#1f2937",
    borderRadius: 12,
    paddingHorizontal: 14,
    color: "#ffffff",
    fontSize: 15,
  },

  button: {
    minHeight: 54,
    backgroundColor: "#f97316",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },

  verifyButton: {
    minHeight: 54,
    backgroundColor: "#22c55e",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 15,
  },

  disabledButton: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },

  timer: {
    color: "#9ca3af",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 20,
  },

 otpContainer: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},

otpInput: {
  width: 40,
  height: 48,
  backgroundColor: "#1f2937",
  borderRadius: 10,
  color: "#ffffff",
  fontSize: 19,
  fontWeight: "700",
  borderWidth: 1,
  borderColor: "#374151",

  textAlign: "center",
  textAlignVertical: "center",
},

  resendText: {
    color: "#fb923c",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 5,
  },

  disabledResend: {
    color: "#6b7280",
  },

  changeEmailText: {
    color: "#9ca3af",
    fontSize: 13,
    textAlign: "center",
    marginTop: 18,
  },
});