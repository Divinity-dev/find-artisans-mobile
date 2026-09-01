import React, {
  useEffect,
} from "react";

import {
  ActivityIndicator,
  View,
} from "react-native";

import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import { useAuth } from "../context/AuthContext";
import { navigationRef, getRoleRouteName } from "./navigationRef";


// ============================================================
// PUBLIC SCREENS
// ============================================================

import HomeScreen from "../screens/HomeScreen";
import WorkersScreen from "../screens/WorkersScreen";
import WorkerDetailsScreen from "../screens/WorkerDetailsScreen";

import CustomerProfileScreen from "../screens/CustomerProfileScreen";

import JobsScreen from "../screens/JobsScreen";
import JobDetailsScreen from "../screens/JobDetailsScreen";

import HowItWorksScreen from "../screens/HowItWorksScreen";
import AboutScreen from "../screens/AboutScreen";
import PrivacyPolicyScreen from "../screens/PrivacyPolicyScreen";


// ============================================================
// AUTH SCREENS
// ============================================================

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";


// ============================================================
// CUSTOMER SCREENS
// ============================================================

import CustomerDashboardScreen from "../screens/CustomerDashboardScreen";
import CustomerJobsScreen from "../screens/CustomerJobsScreen";
import PostJobScreen from "../screens/PostJobScreen";
import CustomerProfileEditScreen from "../screens/CustomerProfileEditScreen";


// ============================================================
// WORKER SCREENS
// ============================================================

import WorkerDashboardScreen from "../screens/WorkerDashboardScreen";
import WorkerProfileEditScreen from "../screens/WorkerProfileEditScreen";


const Stack =
  createNativeStackNavigator();


// ============================================================
// LOADING SCREEN
// ============================================================

const LoadingScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#030712",
      }}
    >
      <ActivityIndicator
        size="large"
        color="#f97316"
      />
    </View>
  );
};


// ============================================================
// AUTH GUARD
//
// Used for routes that require a logged-in user.
//
// Example:
// CustomerDashboard
// WorkerDashboard
// ============================================================

const AuthGuard = ({
  children,
  navigation,
}) => {

  const {
    isAuthenticated,
  } = useAuth();


  if (!isAuthenticated) {

    return (
      <LoginScreen
        navigation={navigation}
      />
    );
  }


  return children;
};


// ============================================================
// CUSTOMER GUARD
//
// Only customers can access customer-specific screens.
// ============================================================

const CustomerGuard = ({
  children,
  navigation,
}) => {

  const {
    user,
    isAuthenticated,
  } = useAuth();


  if (!isAuthenticated || !user) {

    return (
      <LoginScreen
        navigation={navigation}
      />
    );
  }


  if (user.role !== "customer") {

    return (
      <HomeScreen
        navigation={navigation}
      />
    );
  }


  return children;
};


// ============================================================
// WORKER GUARD
//
// Only workers can access worker-specific screens.
// ============================================================

const WorkerGuard = ({
  children,
  navigation,
}) => {

  const {
    user,
    isAuthenticated,
  } = useAuth();


  if (!isAuthenticated || !user) {

    return (
      <LoginScreen
        navigation={navigation}
      />
    );
  }


  if (user.role !== "worker") {

    return (
      <HomeScreen
        navigation={navigation}
      />
    );
  }


  return children;
};


// ============================================================
// APP NAVIGATOR
// ============================================================

const AppNavigator = () => {

  const {
    loading,
    user,
    isAuthenticated,
  } = useAuth();

  useEffect(() => {
    if (loading || !isAuthenticated || !user) {
      return;
    }

    const destination = getRoleRouteName(user.role);
    const currentRoute = navigationRef.current?.getCurrentRoute()?.name;

    if (currentRoute !== destination) {
      navigationRef.current?.reset({
        index: 0,
        routes: [{ name: destination }],
      });
    }
  }, [loading, isAuthenticated, user]);


  // ==========================================================
  // AUTH LOADING
  // ==========================================================

  if (loading) {
    return <LoadingScreen />;
  }


  // ==========================================================
  // ONE GLOBAL STACK
  //
  // IMPORTANT:
  //
  // We no longer create separate:
  //
  // PublicNavigator
  // WorkerNavigator
  // CustomerNavigator
  //
  // Everything lives in this one navigator.
  // ==========================================================

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >


      {/* ======================================================
          PUBLIC ROUTES
          
          EVERYONE CAN ACCESS THESE.
          
          Logged out users
          Customers
          Workers
      ====================================================== */}


      <Stack.Screen
        name="Home"
        component={HomeScreen}
      />


      <Stack.Screen
        name="Workers"
        component={WorkersScreen}
      />


      <Stack.Screen
        name="WorkerDetails"
        component={WorkerDetailsScreen}
      />


      {/* ======================================================
          CUSTOMER PUBLIC PROFILE
          
          IMPORTANT:
          
          This is PUBLIC.
          
          A worker can view a customer profile.
          A customer can view it.
          A logged-out user can view it if your screen
          allows public access.
      ====================================================== */}

      <Stack.Screen
        name="CustomerProfile"
        component={CustomerProfileScreen}
      />


      <Stack.Screen
        name="Jobs"
        component={JobsScreen}
      />


      <Stack.Screen
        name="JobDetails"
        component={JobDetailsScreen}
      />


      <Stack.Screen
        name="HowItWorks"
        component={HowItWorksScreen}
      />


      <Stack.Screen
        name="About"
        component={AboutScreen}
      />


      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
      />


      {/* ======================================================
          AUTH ROUTES
      ====================================================== */}

      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />


      <Stack.Screen
        name="Register"
        component={RegisterScreen}
      />


      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
      />


      <Stack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
      />


      {/* ======================================================
          CUSTOMER ROUTES
          
          These screens exist globally, but the guard makes
          sure only customers can use them.
      ====================================================== */}


      <Stack.Screen
        name="CustomerDashboard"
      >
        {(props) => (
          <CustomerGuard
            navigation={props.navigation}
          >
            <CustomerDashboardScreen
              {...props}
            />
          </CustomerGuard>
        )}
      </Stack.Screen>


      <Stack.Screen
        name="PostJob"
      >
        {(props) => (
          <CustomerGuard
            navigation={props.navigation}
          >
            <PostJobScreen
              {...props}
            />
          </CustomerGuard>
        )}
      </Stack.Screen>


      <Stack.Screen
        name="CustomerProfileEdit"
      >
        {(props) => (
          <CustomerGuard
            navigation={props.navigation}
          >
            <CustomerProfileEditScreen
              {...props}
            />
          </CustomerGuard>
        )}
      </Stack.Screen>


      <Stack.Screen
        name="CustomerJobs"
      >
        {(props) => (
          <CustomerGuard
            navigation={props.navigation}
          >
            <CustomerJobsScreen
              {...props}
            />
          </CustomerGuard>
        )}
      </Stack.Screen>


      {/* ======================================================
          WORKER ROUTES
          
          These screens exist globally, but the guard makes
          sure only workers can use them.
      ====================================================== */}


      <Stack.Screen
        name="WorkerDashboard"
      >
        {(props) => (
          <WorkerGuard
            navigation={props.navigation}
          >
            <WorkerDashboardScreen
              {...props}
            />
          </WorkerGuard>
        )}
      </Stack.Screen>


      <Stack.Screen
        name="WorkerProfileEdit"
      >
        {(props) => (
          <WorkerGuard
            navigation={props.navigation}
          >
            <WorkerProfileEditScreen
              {...props}
            />
          </WorkerGuard>
        )}
      </Stack.Screen>


    </Stack.Navigator>
  );
};


export default AppNavigator;