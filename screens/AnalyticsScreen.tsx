import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";

import React, { useState } from "react";
import { useThemeContext } from "../context/ThemeContext";
import { getStats } from "../storage/statsStorage";
import { useFocusEffect } from "@react-navigation/native";
import Heatmap from "../components/Heatmap";


export default function AnalyticsScreen() {
  const { theme } = useThemeContext();
  const [stats, setStats] = useState({
    points: 0,
    sessionsCompleted: 0,
    totalFocusTime: 0,
    todayFocusTime: 0,
    streak: 0,
    weeklyFocus: [0, 0, 0, 0, 0, 0, 0],
     dailyHistory: {} as Record<
    string,
    {
      focusTime: number;
      sessions: number;
      points: number;
    }
  >,
  });

  const weeklyData = stats.weeklyFocus || [0, 0, 0, 0, 0, 0, 0];
  const maxWeeklyFocus = Math.max(...weeklyData, 1);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    return hours > 0
      ? `${hours}h ${String(minutes).padStart(2, "0")}m`
      : `${minutes}m`;
  };

  useFocusEffect(
    React.useCallback(() => {
      const loadStats = async () => {
        const data = await getStats();
        setStats(data);
      };

      loadStats();
    }, [])
  );

  const hours = Math.floor(stats.todayFocusTime / 3600);
  const minutes = Math.floor((stats.todayFocusTime % 3600) / 60);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{
        padding: 20,
      }}
    >
      <Text style={[styles.header, { color: theme.text }] }>
        📊 Analytics
      </Text>

      <View style={[styles.card, { backgroundColor: theme.card }] }>
        <Text style={[styles.cardTitle, { color: theme.secondaryText }] }>
          Today's Focus Time
        </Text>

        <Text style={[styles.bigNumber, { color: theme.accent }] }>
          {hours > 0
            ? `${hours}h ${String(minutes).padStart(2, "0")}m`
            : `${minutes}m`}
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card }] }>
        <Text style={[styles.cardTitle, { color: theme.secondaryText }] }>
          Current Streak
        </Text>

        <Text style={[styles.bigNumber, { color: theme.accent }] }>
          🔥 {stats.streak} Days
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card }] }>
        <Text style={[styles.cardTitle, { color: theme.secondaryText }] }>
          Sessions Completed
        </Text>

        <Text style={[styles.bigNumber, { color: theme.accent }] }>
          {stats.sessionsCompleted}
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card }] }>
        <Text style={[styles.cardTitle, { color: theme.secondaryText }] }>
          Weekly Focus
        </Text>

        <View style={styles.chartContainer}>
          {weeklyData.map((value, index) => (
            <View key={index} style={styles.barColumn}>
              <Text style={[styles.durationLabel, { color: theme.text }] }>
                {formatDuration(value)}
              </Text>

              <View
                style={[
                  styles.bar,
                  {
                    height: Math.max(20, (value / maxWeeklyFocus) * 120),
                    backgroundColor: theme.accent,
                  },
                ]}
              />

              <Text style={[styles.dayLabel, { color: theme.text }] }>
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <Heatmap
        dailyHistory={stats.dailyHistory}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
     paddingTop: 10,
  },

  header: {
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
  },

  cardTitle: {
    fontSize: 16,
    color: "#666",
  },

  bigNumber: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 10,
  },

  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    marginTop: 20,
    height: 180,
  },

  barColumn: {
    alignItems: "center",
  },

  bar: {
    width: 24,
    borderRadius: 8,
  },

  durationLabel: {
    fontSize: 12,
    color: "#444",
    marginBottom: 6,
    fontWeight: "600",
  },

  dayLabel: {
    marginTop: 8,
    fontWeight: "600",
  },
});