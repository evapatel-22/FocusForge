import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import { useThemeContext } from "../context/ThemeContext";
import { useEffect } from "react";
import { getStats } from "../storage/statsStorage";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import {
  db,
  auth,
} from "../firebase/firebaseConfig";
import { getRecommendation }
from "../firebase/recommendationService";

import { useSpeechService } from "../services/speechService";
import {
  getDailyRecommendation,
  saveDailyRecommendation,
} from "../firebase/firestoreService";

export default function HomeScreen({
  navigation,
}: any) {
  const { theme } = useThemeContext();
  const [taskName, setTaskName] = useState("");
  const [milestones, setMilestones] = useState(3);
  const [mode, setMode] = useState("Balanced");
  const [recommendation,
setRecommendation] =
useState<any>(null);

const [loadingAI,
setLoadingAI] =
useState(false);
  const {
  startRecording,
  stopRecording,
} = useSpeechService();

const [recording, setRecording] =
  useState(false);

const [loadingSpeech, setLoadingSpeech] =
  useState(false);
  const [points, setPoints] = useState(0);
  const [name, setName] =
  useState("User");
  const firstName =
  name.split(" ")[0];
  const handleSpeech = async () => {
  try {
    if (!recording) {
      setRecording(true);

      await startRecording();

      return;
    }

    setRecording(false);

    setLoadingSpeech(true);

    const transcript =
      await stopRecording();

    setTaskName(transcript);

    setLoadingSpeech(false);
  } catch (err) {
    console.log(err);

    setRecording(false);

    setLoadingSpeech(false);

    Alert.alert(
      "Speech Recognition",
      "Unable to recognise speech."
    );
  }
};
const loadRecommendation = async (
  forceRefresh = false
) => {

  const today =
    new Date().toISOString().split("T")[0];

  setLoadingAI(true);

  try {

    if (!forceRefresh) {

      const cached =
        await getDailyRecommendation();

      if (
        cached &&
        cached.date === today &&
        cached.recommendation
      ) {
        setRecommendation(
          cached.recommendation
        );

        setLoadingAI(false);
        return;
      }
    }

    const user = auth.currentUser;

    if (!user) return;

    const result =
      await getRecommendation(user.uid);

    if (result.success) {

      setRecommendation(
        result.recommendation
      );

      await saveDailyRecommendation(
        result.recommendation
      );
    }

  } catch (err) {

    console.log(err);

  }

  setLoadingAI(false);
};

  const startSession = () => {
    if (!taskName.trim()) {
      Alert.alert(
        "Task Required",
        "Please enter a task name."
      );
      return;
    }

    navigation.navigate("Session", {
      taskName,
      milestones,
      mode,
    });
  };
  useFocusEffect(
  React.useCallback(() => {
    const loadData = async () => {
      const stats = await getStats();
      setPoints(stats.points);

      await loadName();
      await loadRecommendation();
    };

    loadData();
  }, [])
);
  const loadName = async () => {
  const user =
    auth.currentUser;

  if (!user) return;

  const docSnap =
    await getDoc(
      doc(
        db,
        "users",
        user.uid
      )
    );

  if (docSnap.exists()) {
    const fullName =
    docSnap.data().name || "";

    setName(fullName);
  }
};
loadName();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={[styles.header, { color: theme.text }] }>
            Good Morning {firstName}👋
          </Text>

          <Text style={[styles.subHeader, { color: theme.secondaryText }] }>
            What are we forging today?
          </Text>

          <View style={[styles.pointsCircle, { backgroundColor: theme.accent }]}>
            <Text style={styles.points}>
              {points}
            </Text>

            <Text style={styles.pointsLabel}>
              pts
            </Text>
          </View>
          <View
  style={[
    styles.aiCard,
    {
      backgroundColor:
        theme.card,
    },
  ]}
>
  <Text
    style={{
      fontSize:18,
      fontWeight:"bold",
      color:theme.text
    }}
  >
    🧠 AI Coach
  </Text>

  {loadingAI ? (

    <Text
      style={{
        marginTop:10,
        color:theme.secondaryText
      }}
    >
      Thinking...
    </Text>

  ) : recommendation ? (

    <>
      <Text
        style={{
          marginTop:12,
          fontSize:18,
          fontWeight:"600",
          color:theme.accent
        }}
      >
        {recommendation.task}
      </Text>

      <Text
        style={{
          marginTop:8,
          color:theme.secondaryText
        }}
      >
        {recommendation.reason}
      </Text>

      <TouchableOpacity
        style={{
          marginTop:15,
          alignSelf:"flex-start"
        }}
        onPress={() =>
  loadRecommendation(true)
}
      >
        <Text
          style={{
            color:theme.accent,
            fontWeight:"600"
          }}
        >
          🔄 Generate New
        </Text>
      </TouchableOpacity>

    </>

  ) : null}

</View>

          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <TextInput
  style={[
    styles.input,
    {
      backgroundColor: theme.surface,
      borderColor: theme.border,
      color: theme.text,
    },
  ]}
  placeholder="e.g. Math Homework"
  placeholderTextColor={theme.mode === "dark" ? "#FFFFFF" : "#111827"}
  value={taskName}
  onChangeText={setTaskName}
/>

<TouchableOpacity
  style={[
    styles.voiceButton,
    {
      backgroundColor:
        recording
          ? "#dc2626"
          : theme.accent,
    },
  ]}
  onPress={handleSpeech}
>
  <Text style={styles.voiceButtonText}>
    {recording
      ? "⏹ Stop Recording"
      : "🎤 Speak Task"}
  </Text>
</TouchableOpacity>

{loadingSpeech && (
  <View
    style={styles.loadingContainer}
  >
    <ActivityIndicator
      size="small"
      color={theme.accent}
    />

    <Text
      style={{
        marginTop: 10,
        color: theme.secondaryText,
      }}
    >
      Thinking...
    </Text>
  </View>
)}
            <Text style={[styles.sectionTitle, { color: theme.text }] }>
              Expected Milestones
            </Text>

            <View style={styles.counterContainer}>
              <TouchableOpacity
                style={[styles.counterButton, { backgroundColor: theme.accentSecondary }]}
                onPress={() =>
                  setMilestones(
                    Math.max(1, milestones - 1)
                  )
                }
              >
                <Text style={styles.counterText}>
                  −
                </Text>
              </TouchableOpacity>

              <Text
                style={[styles.milestoneNumber, { color: theme.text }]}
              >
                {milestones}
              </Text>

              <TouchableOpacity
                style={[styles.counterButton, { backgroundColor: theme.accentSecondary }]}
                onPress={() =>
                  setMilestones(
                    milestones + 1
                  )
                }
              >
                <Text style={styles.counterText}>
                  +
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.sectionTitle, { color: theme.text }] }>
              Focus Mode
            </Text>

            <View style={styles.modeContainer}>
              {[
                "Gentle",
                "Balanced",
                "Forge Master",
              ].map((item) => (
                <TouchableOpacity
                  key={item}
                    style={[
                      styles.modeButton,
                      mode === item && styles.selectedMode,
                      mode === item && { backgroundColor: theme.accent },
                    ]}
                  onPress={() =>
                    setMode(item)
                  }
                >
                  <Text
                    style={[
                      styles.modeText,
                      mode === item && styles.selectedModeText,
                      { color: mode === item ? theme.inverseText : theme.text },
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.startButton, { backgroundColor: theme.accent }]}
            onPress={startSession}
          >
            <Text
              style={[styles.startButtonText, { color: theme.inverseText }]}
            >
              Forge This Session ⚡
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

voiceText: {
  color: "#2563eb",
  fontWeight: "600",
  fontSize: 15,
},

  content: {
    padding: 20,
  },

  header: {
    fontSize: 30,
    fontWeight: "700",
  },

  subHeader: {
    fontSize: 16,
    marginTop: 5,
    marginBottom: 25,
    color: "#666",
  },

  pointsCircle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },

  points: {
    color: "white",
    fontSize: 50,
    fontWeight: "bold",
  },

  pointsLabel: {
    color: "white",
    fontSize: 20,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    elevation: 4,
  },
  aiCard:{
  padding:18,
  borderRadius:18,
  marginBottom:20,
  elevation:4,
},

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  
  voiceButton: {
  marginTop: -8,
  marginBottom: 20,
  paddingVertical: 14,
  borderRadius: 12,
  alignItems: "center",
},

voiceButtonText: {
  color: "white",
  fontWeight: "700",
  fontSize: 16,
},

loadingContainer: {
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 20,
},

  sectionTitle: {
    fontWeight: "600",
    marginBottom: 10,
    fontSize: 16,
  },

  counterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },

  counterButton: {
    width: 45,
    height: 45,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },

  counterText: {
    color: "white",
    fontSize: 26,
    fontWeight: "bold",
  },

  milestoneNumber: {
    fontSize: 24,
    marginHorizontal: 30,
    fontWeight: "bold",
  },

  modeContainer: {
    flexDirection: "row",
  },

  modeButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },

  selectedMode: {
    
  },

  modeText: {
    fontSize: 12,
  },

  selectedModeText: {
    color: "white",
    fontWeight: "600",
  },

  startButton: {
    marginTop: 25,
    padding: 18,
    borderRadius: 15,
  },

  startButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});