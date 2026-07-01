import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { getStats } from "../storage/statsStorage";
import { useFocusEffect } from "@react-navigation/native";

import { useThemeContext } from "../context/ThemeContext";

export default function RewardsScreen() {
  const { theme } = useThemeContext();
  const [stats, setStats] = useState({
  points: 0,
  sessionsCompleted: 0,
  totalFocusTime: 0,
  streak: 0,
});
  useFocusEffect(
    React.useCallback(() => {
      const loadStats = async () => {
        const data = await getStats();
        setStats(data);
      };

      loadStats();
    }, [])
  );

  const getRank = (points: number) => {
  if (points >= 5000) return "🏆 Forge Master";
  if (points >= 2500) return "🥇 Gold Smith";
  if (points >= 1000) return "🥈 Silver Smith";
  return "🥉 Bronze Smith";
};

  const progress =
  stats.points < 1000
    ? (stats.points / 1000) * 100
    : stats.points < 2500
    ? ((stats.points - 1000) / 1500) * 100
    : stats.points < 5000
    ? ((stats.points - 2500) / 2500) * 100
    : 100;
  
  const getNextRank = (points: number) => {
  if (points < 1000) return "Silver Smith";
  if (points < 2500) return "Gold Smith";
  if (points < 5000) return "Forge Master";
  return "Max Rank Achieved";
};
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{
        padding: 20,
      }}
    >
      <Text style={[styles.header, { color: theme.text }] }>
        🏆 Rewards
      </Text>

      <View style={[styles.pointsCard, { backgroundColor: theme.accent }] }>
        <Text style={[styles.pointsLabel, { color: theme.inverseText }] }>
          Total Points
        </Text>

        <Text style={[styles.points, { color: theme.inverseText }] }>
          {stats.points}
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card }] }>
        <Text style={[styles.title, { color: theme.text }] }>
          Current Rank
        </Text>

        <Text style={[styles.rank, { color: theme.accent }] }>
          {getRank(stats.points)}
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card }] }>
        <Text style={[styles.title, { color: theme.text }] }>
          Progress To {getNextRank(stats.points)}
        </Text>

        <View style={[styles.progressBar, { backgroundColor: theme.muted }] }>
          <View
            style={[
              styles.progressFill,
              { width: `${progress}%`, backgroundColor: theme.accent },
            ]}
          />
        </View>

        <Text style={[styles.progressText, { color: theme.text }] }>
          {Math.round(progress)}%
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card }] }>
        <Text style={[styles.title, { color: theme.text }] }>
          Achievements
        </Text>

        <Text style={[styles.achievement, { color: theme.text }] }>
  {stats.sessionsCompleted >= 1
    ? "✅ First Session"
    : "🔒 First Session"}
</Text>

<Text style={[styles.achievement, { color: theme.text }] }>
  {stats.sessionsCompleted >= 5
    ? "✅ 5 Sessions"
    : "🔒 5 Sessions"}
</Text>

<Text style={[styles.achievement, { color: theme.text }] }>
  {stats.sessionsCompleted >= 25
    ? "✅ 25 Sessions"
    : "🔒 25 Sessions"}
</Text>

<Text style={[styles.achievement, { color: theme.text }] }>
  {stats.sessionsCompleted >= 100
    ? "✅ 100 Sessions"
    : "🔒 100 Sessions"}
</Text>
      </View>
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

  pointsCard: {
    padding: 25,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: "center",
  },

  pointsLabel: {
    color: "white",
    fontSize: 18,
  },

  points: {
    color: "white",
    fontSize: 48,
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },

  rank: {
    fontSize: 28,
    fontWeight: "bold",
  },

  progressBar: {
    height: 18,
    backgroundColor: "#E5E5E5",
    borderRadius: 10,
    overflow: "hidden",
  },

  progressFill: { 
    width: "80%",
    height: "100%",
  },

  progressText: {
    marginTop: 10,
    fontWeight: "600",
  },

  achievement: {
    fontSize: 16,
    marginBottom: 12,
  },
});