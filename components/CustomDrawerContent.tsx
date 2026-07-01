import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";

import { Ionicons } from "@expo/vector-icons";
import { auth } from "../firebase/firebaseConfig";
import { signOut } from "firebase/auth";

export default function CustomDrawerContent(
  props: DrawerContentComponentProps
) {
  const currentRoute =
    props.state.routeNames[
      props.state.index
    ];

  const navigate = (screen: string) => {
    props.navigation.navigate(screen as never);
  };

  const MenuItem = ({
    icon,
    title,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
  }) => {
    const active =
      currentRoute === title;

    return (
      <TouchableOpacity
        onPress={() =>
          navigate(title)
        }
        style={[
          styles.item,
          active &&
            styles.activeItem,
        ]}
      >
        <Ionicons
          name={icon}
          size={22}
          color={
            active
              ? "#FFFFFF"
              : "#9CA3AF"
          }
        />

        <Text
          style={[
            styles.itemText,
            active &&
              styles.activeText,
          ]}
        >
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={
        styles.container
      }
    >
      <View>
        <Text style={styles.logo}>
          FocusForge
        </Text>

        <Text
          style={styles.subtitle}
        >
          Your Personal AI{"\n"}
          Productivity Coach
        </Text>

        <View
          style={styles.divider}
        />

        <MenuItem
          icon="home-outline"
          title="Home"
        />

        <MenuItem
          icon="bar-chart-outline"
          title="Analytics"
        />

        <MenuItem
          icon="book-outline"
          title="Forge Log"
        />

        <MenuItem
          icon="trophy-outline"
          title="Rewards"
        />

        <MenuItem
          icon="podium-outline"
          title="Leaderboard"
        />

        <MenuItem
          icon="person-outline"
          title="Profile"
        />
      </View>

      <View>
        <View
          style={styles.divider}
        />

        <TouchableOpacity
          style={styles.item}
          onPress={async () => {
            await signOut(auth);
          }}
        >
          <Ionicons
            name="log-out-outline"
            size={22}
            color="#F87171"
          />

          <Text
            style={[
              styles.itemText,
              {
                color:
                  "#F87171",
              },
            ]}
          >
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        "#111827",
      justifyContent:
        "space-between",
      paddingTop: 60,
      paddingBottom: 30,
      paddingHorizontal: 20,
    },

    logo: {
      fontSize: 30,
      fontWeight: "700",
      color: "white",
    },

    subtitle: {
      color: "#9CA3AF",
      marginTop: 10,
      lineHeight: 22,
      fontSize: 15,
    },

    divider: {
      height: 1,
      backgroundColor:
        "#374151",
      marginVertical: 28,
    },

    item: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 16,
      marginBottom: 8,
    },

    activeItem: {
      backgroundColor:
        "#4F46E5",
    },

    itemText: {
      color: "#9CA3AF",
      marginLeft: 16,
      fontSize: 16,
      fontWeight: "600",
    },

    activeText: {
      color: "white",
    },
  });