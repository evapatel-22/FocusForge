import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/HomeScreen";
import AnalyticsScreen from "../screens/AnalyticsScreen";
import RewardsScreen from "../screens/RewardsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import {
  Ionicons,
} from "@expo/vector-icons";
import ForgeLogScreen from "../screens/ForgeLogScreen";
import LeaderboardScreen from "../screens/LeaderboardScreen";

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
  screenOptions={({ route }) => ({
    headerShown: false,

    tabBarIcon: ({
      color,
      size,
    }) => {
      let iconName: any;

      if (route.name === "Home") {
        iconName = "home";
      } else if (
        route.name === "Forge Log"
      ){
        iconName = "book";
      }else if (
        route.name === "Analytics"
      ) {
        iconName = "bar-chart";
      } else if (
        route.name === "Rewards"
      ) {
        iconName = "trophy";
      } else if (
        route.name === "Profile"
      ) {
        iconName = "person";
      }else if (
  route.name === "Leaderboard"
) {
  iconName = "podium";
}

      return (
        <Ionicons
          name={iconName}
          size={size}
          color={color}
        />
      );
    },

    tabBarActiveTintColor:
      "#8A9A86",

    tabBarInactiveTintColor:
      "gray",
  })}
>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
      />

      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
      />
      <Tab.Screen
        name="Forge Log"
        component={ForgeLogScreen}
      />
      <Tab.Screen
        name="Rewards"
        component={RewardsScreen}
      />
      <Tab.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
}
