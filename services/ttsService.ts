import * as FileSystem from "expo-file-system/legacy";
import { Audio } from "expo-av";

const API =
  "http://192.168.1.2:5000/text-to-speech";

export async function speak(
  text: string
) {
  const response =
    await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        text,
      }),
    });

  const data =
    await response.json();

  if (!data.success) return;

  const fileUri =
    FileSystem.cacheDirectory +
    "speech.mp3";

  await FileSystem.writeAsStringAsync(
    fileUri,
    data.audio,
    {
      encoding:
        FileSystem.EncodingType.Base64,
    }
  );

  await Audio.setAudioModeAsync({
  playsInSilentModeIOS: true,
});

const sound = new Audio.Sound();

await sound.loadAsync(
  { uri: fileUri },
  {
    shouldPlay: true,
    volume: 1.0,
  }
);

await sound.setVolumeAsync(1.0);
}