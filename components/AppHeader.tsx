import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import {
  DrawerActions,
  useNavigation,
} from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";
import { auth } from "../firebase/firebaseConfig";
import { useThemeContext } from "../context/ThemeContext";

export default function AppHeader({ options }: { options?: { title?: string } }) {
  const navigation = useNavigation<any>();
  const { theme } = useThemeContext();

  const name =
    auth.currentUser?.displayName ||
    auth.currentUser?.email ||
    "User";

  const initials = name.charAt(0).toUpperCase();
  return (
    <View
      style={[styles.container, { backgroundColor: theme.card, borderBottomColor: theme.border }]}
    >
      <TouchableOpacity
        onPress={() =>
          navigation.dispatch(
            DrawerActions.toggleDrawer()
          )
        }
      >
        <Ionicons
          name="menu"
          size={28}
          color={theme.text}
        />
      </TouchableOpacity>

      <Text style={[styles.title, { color: theme.text }]}>
        {options?.title || "FocusForge"}
      </Text>

      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Profile")
        }
        style={[styles.avatar, { backgroundColor: theme.accent }]}
      >
        <Text style={styles.avatarText}>
          {initials}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 120,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});