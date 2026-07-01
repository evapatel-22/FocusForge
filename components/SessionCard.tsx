import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import { useThemeContext } from "../context/ThemeContext";

export default function SessionCard({
  session,
}: any) {
  const { theme } = useThemeContext();

  const confidence =
    session.confidence ?? 0;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
        },
      ]}
    >
      <Text
        style={[
          styles.task,
          {
            color: theme.text,
          },
        ]}
      >
        📚 {session.taskName}
      </Text>

      <Text
        style={{
          color: theme.secondaryText,
          marginTop: 6,
        }}
      >
        ⏱ {Math.floor(session.duration / 60)} min
        {"   "}
        ⭐ +{session.pointsEarned}
      </Text>

      <Text
        style={{
          color: session.verified
            ? "#16a34a"
            : "#dc2626",
          fontWeight: "600",
          marginTop: 12,
        }}
      >
        {session.verified
          ? "✅ AI Verified"
          : "❌ Verification Failed"}
      </Text>

      <Text
        style={{
          color: theme.secondaryText,
          marginTop: 10,
          fontStyle: "italic",
        }}
      >
        "{session.reason}"
      </Text>

      <View
        style={styles.progressBackground}
      >
        <View
          style={[
            styles.progressFill,
            {
              width:`${Math.min(session.confidence ?? 0, 100)}%`,
            },
          ]}
        />
      </View>

      <Text
        style={{
          color: theme.secondaryText,
          alignSelf: "flex-end",
          marginTop: 5,
        }}
      >
        Confidence {confidence}%
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 22,
    marginBottom: 18,
  },

  task: {
    fontSize: 22,
    fontWeight: "700",
  },

  progressBackground: {
    marginTop: 18,
    height: 8,
    borderRadius: 20,
    backgroundColor: "#ddd",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 20,
    backgroundColor: "#16a34a",
  },
});