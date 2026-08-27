import React from "react";

import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import WorkersScreen from "../screens/WorkersScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import WorkerDetailsScreen from "../screens/WorkerDetailsScreen";
import JobsScreen from "../screens/JobsScreen";
import JobDetailsScreen from "../screens/JobDetailsScreen";
import CustomerProfileScreen from "../screens/CustomerProfileScreen";
import WorkerDashboardScreen from "../screens/WorkerDashboardScreen";
import CustomerDashboardScreen from "../screens/CustomerDashboardScreen";
import PostJobScreen from "../screens/PostJobScreen";
import CustomerProfileEditScreen from "../screens/CustomerProfileEditScreen";
import WorkerProfileEditScreen from "../screens/WorkerProfileEditScreen";

const Stack =
  createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >

      <Stack.Screen
        name="Home"
        component={HomeScreen}
      />

      <Stack.Screen
        name="Workers"
        component={WorkersScreen}
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
  name="CustomerProfile"
  component={CustomerProfileScreen}
/>

<Stack.Screen
  name="CustomerDashboard"
  component={CustomerDashboardScreen}
/>

<Stack.Screen
  name="WorkerProfileEdit"
  component={WorkerProfileEditScreen}
/>

<Stack.Screen
  name="PostJob"
  component={PostJobScreen}
/>

<Stack.Screen
  name="CutomerProfileEdit"
  component={CustomerProfileEditScreen}
/>

<Stack.Screen
  name="WorkerDashboard"
  component={WorkerDashboardScreen}
/>

      <Stack.Screen
  name="WorkerDetails"
  component={WorkerDetailsScreen}
/>

      <Stack.Screen
  name="Register"
  component={RegisterScreen}
/>

      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />

      <Stack.Screen
  name="ResetPassword"
  component={ResetPasswordScreen}
/>

      <Stack.Screen
  name="ForgotPassword"
  component={ForgotPasswordScreen}
/>

    </Stack.Navigator>
  );
};

export default AppNavigator;