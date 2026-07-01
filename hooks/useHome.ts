import React, { useState } from "react";
import { Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useSpeechService } from "../services/speechService";
import { loadHomeData } from "../controllers/HomeController";


export default function useHome() {
  const {
    startRecording,
    stopRecording,
  } = useSpeechService();

  const [taskName, setTaskName] =
    useState("");

  const [milestones, setMilestones] =
    useState(3);

  const [mode, setMode] =
    useState("Balanced");

  const [recording, setRecording] =
    useState(false);

  const [loadingSpeech, setLoadingSpeech] =
    useState(false);

  const [loadingAI, setLoadingAI] =
    useState(false);

  const [recommendation, setRecommendation] =
    useState<any>(null);

  const [points, setPoints] =
    useState(0);

  const [name, setName] =
    useState("User");

  const loadData = async () => {
    setLoadingAI(true);

    const data =
      await loadHomeData();

    setPoints(data.points);

    setName(data.name);

    setRecommendation(
      data.recommendation
    );

    setLoadingAI(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

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
    } catch {
      setRecording(false);

      setLoadingSpeech(false);

      Alert.alert(
        "Speech Recognition",
        "Unable to recognise speech."
      );
    }
  };

  return {
    taskName,
    setTaskName,

    milestones,
    setMilestones,

    mode,
    setMode,

    recording,
    loadingSpeech,

    handleSpeech,

    loadingAI,

    recommendation,

    points,

    name,

    refreshAI: loadData,
  };
}