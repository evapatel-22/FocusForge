import React, { useEffect, useRef, useState } from "react";
import * as Notifications from "expo-notifications";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { useThemeContext } from "../context/ThemeContext";
import { ScrollView } from "react-native";
import {
  playMusic,
  stopMusic,
  pauseMusic,
  resumeMusic,
} from "../services/musicService";
import { AppState, Alert, AppStateStatus } from "react-native";

type Props = NativeStackScreenProps<
  RootStackParamList,
  "Session"
>;

export default function SessionScreen({
  route,
  navigation,
}: Props) {
  const { theme } = useThemeContext();
  const { taskName, milestones } = route.params;

  const [seconds, setSeconds] = useState<number>(
    route.params.seconds ?? 0
  );
  const [paused, setPaused] = useState<boolean>(false);
  const [musicIndex, setMusicIndex] =
useState(0);

const [musicPlaying, setMusicPlaying] =
useState(false);
  const [warningBanner, setWarningBanner] = useState<string | null>(null);
  const [sessionFailed, setSessionFailed] = useState(false);
  const [completedMilestones, setCompletedMilestones] =
    useState<number>(
      route.params.completedMilestones ?? 0
    );
  const MUSIC = [
  {
    name: "Rain",
    icon: "🌧",
    file: require("../assets/audio/rain.mp3"),
  },

  {
    name: "Ocean",
    icon: "🌊",
    file: require("../assets/audio/ocean.mp3"),
  },

  {
    name: "Forest",
    icon: "🍃",
    file: require("../assets/audio/forest.mp3"),
  },

  {
    name: "Lo-fi",
    icon: "🎹",
    file: require("../assets/audio/lofi.mp3"),
  },

  {
    name: "Fireplace",
    icon: "🔥",
    file: require("../assets/audio/fireplace.mp3"),
  },
];
const chooseMusic = async (
  index: number
) => {
  setMusicIndex(index);

  await playMusic(
    MUSIC[index].file
  );

  setMusicPlaying(true);
};

  useEffect(() => {
    const interval = setInterval(() => {

    if (!paused) {
        setSeconds((prev) => prev + 1);
      }
    },1000);

    return () => clearInterval(interval);
  }, [paused]);

  const finishSession = async (duration: number, aiResult: any) => {
    if (sessionFailed) return;

    setSessionFailed(true);
    await stopMusic();

    navigation.replace("Complete", {
      duration,
      taskName,
      aiResult,
    });
  };

  const failSession = async () => {
    if (sessionFailed) return;

    setSessionFailed(true);
    await stopMusic();

    navigation.replace("SessionFailed", {
      aiResult: {
        verified: false,
        confidence: 0,
        reason: "Session failed due to distractions.",
      },
    });
  };

  useEffect(() => {
    if (sessionFailed) return;

    if (completedMilestones >= milestones) {
      finishSession(seconds, route.params.aiResult);
    }
  }, [
    completedMilestones,
    milestones,
    seconds,
    taskName,
    navigation,
    route.params.aiResult,
    sessionFailed,
  ]);

    const formatTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${String(mins).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  const captureProof = () => {
    navigation.navigate("Camera", {
        taskName,
        milestones,
        mode: route.params.mode,
        completedMilestones,
        seconds,
    });
  };
  useEffect(() => {
  return () => {
    stopMusic().catch(console.log);
  };
}, []);
const [warnings, setWarnings] = useState(0);
const appState = useRef(AppState.currentState);
const getMaxWarnings = () => {
  switch (route.params.mode) {
    case "Gentle":
      return 3;

    case "Balanced":
      return 2;

    case "Forge Master":
      return 0;

    default:
      return 2;
  }
};

useEffect(() => {
  if (warningBanner) {
    const timer = setTimeout(() => setWarningBanner(null), 2500);
    return () => clearTimeout(timer);
  }
}, [warningBanner]);

useEffect(() => {
  const subscription = AppState.addEventListener("change", async (nextState: AppStateStatus) => {
    const isLeavingForeground = appState.current === "active" && (nextState === "background" || nextState === "inactive" || nextState === "unknown");

    if (isLeavingForeground && !paused && completedMilestones < milestones && !sessionFailed) {
      if (route.params.mode === "Forge Master") {
        await failSession();
        return;
      } 
      const maxWarnings = getMaxWarnings();

      setWarnings((prev) => {
       if (prev >= maxWarnings) {
        setTimeout(() => {
        failSession();
      }, 0);

  return prev;
}
        const nextWarnings = prev + 1;
        const message = `Warning ${nextWarnings} of ${maxWarnings}`;
        setWarningBanner(message);
        Alert.alert("Stay Focused", message, [{ text: "OK" }]);

        Notifications.scheduleNotificationAsync({
          content: {
            title: "Stay Focused",
            body: message,
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
          },
          trigger: null,
        }).catch(() => undefined);

        return nextWarnings;
      });
    }

    appState.current = nextState;
  });

  return () => subscription.remove();
}, [completedMilestones, milestones, navigation, paused, sessionFailed, taskName, warningBanner]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.taskName, { color: theme.text }]}>
        {taskName}
      </Text>

      <Text style={[styles.timer, { color: theme.accent }]}>
        {formatTime()}
      </Text>
      {warningBanner ? (
        <View style={styles.warningBanner}>
          <Text style={styles.warningBannerTitle}>Stay Focused</Text>
          <Text style={styles.warningBannerText}>{warningBanner}</Text>
        </View>
      ) : null}

      <Text
  style={{
    color: "#EF4444",
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "700",
    fontSize: 18,
  }}
>
  Warnings: {warnings}/{getMaxWarnings()}
</Text>

      <View style={styles.dotsContainer}>
        {[...Array(milestones)].map(
          (_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                { borderColor: theme.accent },
                index < completedMilestones && { backgroundColor: theme.accent },
              ]}
            />
          )
        )}
      </View>
      <Text
style={{
  fontSize:20,
  fontWeight:"700",
  color:theme.text,
  marginBottom:15,
}}
>
🎵 Focus Music
</Text>

<View
style={{
  backgroundColor:theme.card,
  borderRadius:22,
  padding:20,
  marginBottom:30,
}}
>

<Text
style={{
  fontSize:22,
  fontWeight:"700",
  textAlign:"center",
  color: theme.text,
}}
>
{MUSIC[musicIndex].icon} {MUSIC[musicIndex].name}
</Text>

<Text
style={{
  textAlign:"center",
  marginTop:8,
  color:theme.secondaryText,
}}
>
Ambient background sound
</Text>

<View
style={{
  flexDirection:"row",
  justifyContent:"space-evenly",
  marginTop:25,
}}
>

<TouchableOpacity
onPress={()=>{
const next =
musicIndex===0
?MUSIC.length-1
:musicIndex-1;

chooseMusic(next);
}}
>
<Text
style={{
fontSize:30
}}
>
⏮
</Text>
</TouchableOpacity>

<TouchableOpacity
onPress={async()=>{

if(musicPlaying){

await pauseMusic();

setMusicPlaying(false);

}else{

await resumeMusic();

setMusicPlaying(true);

}

}}
>
<Text
style={{
fontSize:42,
 color: theme.text,

}}
>
{musicPlaying ? "⏸" : "▶"}
</Text>
</TouchableOpacity>

<TouchableOpacity
onPress={()=>{

const next =
(musicIndex+1)
%
MUSIC.length;

chooseMusic(next);

}}
>
<Text
style={{
fontSize:30
}}
>
⏭
</Text>
</TouchableOpacity>

</View>

</View>
      <TouchableOpacity
        style={[styles.pauseButton, { backgroundColor: theme.accentSecondary }]}
        onPress={() =>
          setPaused(!paused)
        }
      >
        <Text style={styles.buttonText}>
          {paused
            ? "▶ Resume Session"
            : "⏸ Emergency Pause"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.captureButton, { backgroundColor: theme.accent }]}
        onPress={captureProof}
      >
        <Text style={styles.buttonText}>
          📸 Capture Proof
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
  padding: 20,
  paddingBottom: 40,
},

  taskName: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },

  timer: {
    fontSize: 72,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 40,
  },

  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 50,
  },

  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    marginHorizontal: 8,
  },

  pauseButton: {
    padding: 18,
    borderRadius: 15,
    marginBottom: 20,
  },

  captureButton: {
    padding: 18,
    borderRadius: 15,
  },

  warningBanner: {
    backgroundColor: "#FDE68A",
    borderColor: "#F59E0B",
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  warningBannerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#92400E",
    textAlign: "center",
  },

  warningBannerText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#92400E",
    textAlign: "center",
    marginTop: 4,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});