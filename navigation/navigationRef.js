import { createNavigationContainerRef } from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef();

export const getRoleRouteName = (role) => {
  if (role === "worker") {
    return "WorkerDashboard";
  }

  if (role === "customer") {
    return "CustomerDashboard";
  }

  return "Home";
};
