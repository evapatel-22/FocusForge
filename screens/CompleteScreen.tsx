import React, { useEffect,useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { useThemeContext } from "../context/ThemeContext";
import {
  getStats,
  saveStats,
} from "../storage/statsStorage";
import { useFocusEffect } from "@react-navigation/native";
import { saveSession } from "../firebase/sessionService";
import { auth } from "../firebase/firebaseConfig";
import { speak }
from "../services/ttsService";
import { saveGraphTask }
from "../firebase/graphService";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

type Props = NativeStackScreenProps<
  RootStackParamList,
  "Complete"
>;

export default function CompleteScreen({
  navigation,
  route,
}: Props) {
  const { theme } = useThemeContext();
  const hasUpdated = useRef(false);
  useEffect(() => {
  if (hasUpdated.current) return;
  

  hasUpdated.current = true;

  const updateStats = async () => {
    try {
      console.log("=== COMPLETE SCREEN ===");

        console.log("Route params:", route.params);

        const stats = await getStats();

        console.log("Stats before:", stats);

        const duration = route.params?.duration ?? 0;

        const getWeekStart = (isoDate: string) => {
          const date = new Date(isoDate);
          const day = date.getDay();
          const diff = (day + 6) % 7;
          date.setDate(date.getDate() - diff);
          return date.toISOString().split("T")[0];
        };

        if (!Array.isArray(stats.weeklyFocus) || stats.weeklyFocus.length < 7) {
          stats.weeklyFocus = [0, 0, 0, 0, 0, 0, 0];
        }

        stats.points = (stats.points ?? 0) + 100;
        stats.sessionsCompleted = (stats.sessionsCompleted ?? 0) + 1;
        stats.totalFocusTime = (stats.totalFocusTime ?? 0) + duration;
        const today = new Date().toISOString().split("T")[0];
        const yesterday = new Date(Date.now() - 86400000)
          .toISOString()
          .split("T")[0];

        if (
          stats.lastSessionDate &&
          getWeekStart(stats.lastSessionDate) !== getWeekStart(today)
        ) {
          stats.weeklyFocus = [0, 0, 0, 0, 0, 0, 0];
        }

        if (stats.lastSessionDate !== today) {
          stats.todayFocusTime = 0;

          if (stats.lastSessionDate === yesterday) {
            stats.streak = (stats.streak ?? 0) + 1;
          } else {
            stats.streak = 1;
          }

          stats.lastSessionDate = today;
        }

        stats.todayFocusTime += duration;
        const todayKey = new Date()
  .toISOString()
  .split("T")[0];

if (!stats.dailyHistory) {
  stats.dailyHistory = {};
}

if (!stats.dailyHistory[todayKey]) {
  stats.dailyHistory[todayKey] = {
    focusTime: 0,
    sessions: 0,
    points: 0,
  };
}

stats.dailyHistory[todayKey].focusTime += duration;
stats.dailyHistory[todayKey].sessions += 1;
stats.dailyHistory[todayKey].points += 100;

        const currentDay = new Date().getDay();
        const adjustedDay = currentDay === 0 ? 6 : currentDay - 1;

        // Only add to weekly focus if we have a positive duration
        if (duration > 0) {
          stats.weeklyFocus[adjustedDay] += duration;
        }

      
        console.log("Before saveStats");

        await saveStats(stats);

        console.log("After saveStats");

        console.log("Stats saved successfully");
        console.log("Daily History:", stats.dailyHistory);
        const user = auth.currentUser;
        

if (user) {
  await saveSession({
    uid: user.uid,
    taskName: route.params.taskName,
    duration,
    verified: route.params.aiResult?.verified ?? true,
    confidence: route.params.aiResult?.confidence ?? 100,
    reason:
      route.params.aiResult?.reason ??
      "Verified",
    pointsEarned: 100,
  });
  console.log("Session saved!");
  const userDoc = await getDoc(
  doc(db, "users", user.uid)
);

const userName =
  userDoc.data()?.name || "User";

const graphResult = await saveGraphTask(
  user.uid,
  userName,
  route.params.taskName
);
console.log("Neo4j:", graphResult);
}
    } catch (error) {
      console.log("UPDATE STATS ERROR:", error);
    }
  };

  updateStats();
}, []);
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={styles.emoji}>🎉</Text>

      <Text style={[styles.title, { color: theme.text }] }>
        Session Complete!
      </Text>

      <Text style={[styles.subtitle, { color: theme.secondaryText }] }>
        Great job staying focused.
      </Text>

      <View style={[styles.pointsCard, { backgroundColor: theme.card }] }>
        <Text style={[styles.pointsText, { color: theme.accent }] }>
          +100 Points Earned ⭐
        </Text>
      </View>
       <TouchableOpacity
  style={[
    styles.voiceButton,
    { backgroundColor: "#2563EB" },
  ]}
  onPress={async () => {
    
    await speak(
      `Congratulations

You completed ${route.params.taskName}.

You earned 100 points.

Keep forging greatness`
    );
  }}
>
  <Text style={styles.voiceButtonText}>
    🔊 Hear AI Coach
  </Text>
</TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.accent }]}
        onPress={() =>
          navigation.navigate("Tabs")
        }
      >

        <Text style={[styles.buttonText, { color: theme.inverseText }] }>
          Start New Session
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  emoji: {
    fontSize: 90,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 20,
  },

  subtitle: {
    fontSize: 18,
    color: "#666",
    marginTop: 10,
  },
  voiceButton: {
  marginTop: 25,
  paddingVertical: 16,
  paddingHorizontal: 40,
  borderRadius: 15,
},

voiceButtonText: {
  color: "white",
  fontWeight: "700",
  fontSize: 17,
},
  pointsCard: {
    marginTop: 40,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
    elevation: 4,
  },

  pointsText: {
    fontSize: 22,
    fontWeight: "bold",
  },

  button: {
    marginTop: 40,
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 15,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});