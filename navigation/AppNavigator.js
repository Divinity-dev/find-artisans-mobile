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