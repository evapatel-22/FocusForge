import {
  useAudioRecorder,
  RecordingPresets,
  AudioModule,
  setAudioModeAsync,
} from "expo-audio";


const API_URL = "https://focusforge-backend-kfuh.onrender.com";

export function useSpeechService() {
  const recorder = useAudioRecorder(
    RecordingPresets.HIGH_QUALITY
  );

  async function startRecording() {
    const permission =
      await AudioModule.requestRecordingPermissionsAsync();

    if (!permission.granted) {
      throw new Error(
        "Microphone permission denied"
      );
    }
    await setAudioModeAsync({
  allowsRecording: true,
  playsInSilentMode: true,
});

    await recorder.prepareToRecordAsync();

    recorder.record();
  }

  async function stopRecording() {
    await recorder.stop();

    const uri = recorder.uri;

    if (!uri) {
      throw new Error(
        "Recording failed"
      );
    }
    console.log("Audio URI:", uri);

    const formData = new FormData();

    formData.append("audio", {
      uri,
      name: "speech.wav",
      type: "audio/wav",
    } as any);

    const response = await fetch(
      `${API_URL}/speech-to-text`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!data.success) {
      throw new Error(
        data.error ??
          "Speech recognition failed"
      );
    }

    return data.text;
  }

  return {
    startRecording,
    stopRecording,
  };
}