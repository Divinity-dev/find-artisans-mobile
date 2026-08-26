import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ======================================
  // CHECK STORED AUTH DATA
  // ======================================

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedToken =
          await AsyncStorage.getItem("token");

        const storedUser =
          await AsyncStorage.getItem("user");

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error(
          "Failed to load authentication:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadAuthData();
  }, []);

  // ======================================
  // LOGIN
  // ======================================

  const login = async (email, password) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed"
        );
      }

      // Store authentication data
      await AsyncStorage.setItem(
        "token",
        data.token
      );

      await AsyncStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setToken(data.token);
      setUser(data.user);

      return data;
    } catch (error) {
      console.error("Login error:", error);

      throw error;
    }
  };

  // ======================================
  // LOGOUT
  // ======================================

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");

      setToken(null);
      setUser(null);
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ======================================
// CUSTOM HOOK
// ======================================

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;