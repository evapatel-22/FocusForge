import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import AnalyticsScreen from "../screens/AnalyticsScreen";
import ForgeLogScreen from "../screens/ForgeLogScreen";
import RewardsScreen from "../screens/RewardsScreen";
import LeaderboardScreen from "../screens/LeaderboardScreen";
import ProfileScreen from "../screens/ProfileScreen";

import CustomDrawerContent from "../components/CustomDrawerContent";
import AppHeader from "../components/AppHeader";
import { useThemeContext } from "../context/ThemeContext";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  const { theme } = useThemeContext();

  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawerContent {...props} />
      )}
      screenOptions={{
        headerShown: true,
        header: (props) => <AppHeader {...props} />,
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: theme.card,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontSize: 22,
          fontWeight: "700",
          color: theme.text,
        },
        drawerType: "front",
        drawerStyle: {
          width: 280,
          backgroundColor: theme.background,
          borderTopRightRadius: 28,
          borderBottomRightRadius: 28,
        },
        drawerActiveTintColor: theme.text,
        drawerInactiveTintColor: theme.secondaryText,
        sceneStyle: {
          backgroundColor: theme.background,
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name="home-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name="bar-chart-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="Forge Log"
        component={ForgeLogScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name="book-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="Rewards"
        component={RewardsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name="trophy-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name="podium-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name="person-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}