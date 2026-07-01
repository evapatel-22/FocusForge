import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
//import Tabs from "./navigation/Tabs";
import DrawerNavigator from "./navigation/DrawerNavigator";
import SessionScreen from "./screens/SessionScreen";
import CameraScreen from "./screens/CameraScreen";
import CompleteScreen from "./screens/CompleteScreen";
import SessionFailedScreen from "./screens/SessionFailedScreen";
import { ThemeProvider, useThemeContext } from "./context/ThemeContext";

import { RootStackParamList } from "./types/navigation";
import { auth } from "./firebase/firebaseConfig";
import {
  requestNotificationPermissions,
  scheduleDailyReminder,
} from "./services/notificationService";

const Stack =
  createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
import React, {
  useEffect,
  useState,
} from "react";

import {
  onAuthStateChanged,
  User,
} from "firebase/auth";

import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";

function AppContent() {
  const { mode } = useThemeContext();
  const navigationTheme =
    mode === "dark"
      ? {
          ...NavigationDarkTheme,
          colors: {
            ...NavigationDarkTheme.colors,
            primary: "#4F46E5",
            background: "#111827",
            card: "#1F2937",
            text: "#FFFFFF",
            border: "#374151",
            notification: "#4F46E5",
          },
        }
      : {
          ...NavigationDefaultTheme,
          colors: {
            ...NavigationDefaultTheme.colors,
            primary: "#4F46E5",
            background: "#111827",
            card: "#1F2937",
            text: "#FFFFFF",
            border: "#374151",
            notification: "#4F46E5",
          },
        };
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
  const unsubscribe =
    onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      }
    );

  return unsubscribe;
}, []);

  useEffect(() => {
    const setup = async () => {
      try {
        const granted =
          await requestNotificationPermissions();

        if (granted) {
          await scheduleDailyReminder();
        }
      } catch (error) {
        console.warn(
          "Notification setup failed:",
          error
        );
      }
    };

    setup();
  }, []);
 if (loading) {
    return null;
  }
  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!user ? (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
            />

            <Stack.Screen
              name="Signup"
              component={SignupScreen}
            />
         </>
      ) : (
          <>
            <Stack.Screen
  name="Tabs"
  component={DrawerNavigator}
/>

            <Stack.Screen
              name="Session"
              component={SessionScreen}
            />

            <Stack.Screen
              name="Camera"
              component={CameraScreen}
            />

            <Stack.Screen
              name="Complete"
              component={CompleteScreen}
            />

            <Stack.Screen
              name="SessionFailed"
              component={SessionFailedScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}