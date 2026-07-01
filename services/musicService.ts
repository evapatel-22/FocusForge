import { Audio } from "expo-av";

let sound: Audio.Sound | null = null;

export async function playMusic(file: any) {
  console.log("Playing music...");
  console.log(file);

  try {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }

    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
    });

    const result = await Audio.Sound.createAsync(file);

    console.log("Loaded successfully");

    sound = result.sound;

    await sound.setIsLoopingAsync(true);

    await sound.playAsync();

    console.log("Playback started");
  } catch (err) {
    console.log("AUDIO ERROR:", err);
  }
}

export async function stopMusic() {
  try {
    if (!sound) return;

    await sound.stopAsync();

    await sound.unloadAsync();

    sound = null;

  } catch (err) {
    console.log(err);
  }
}
export async function pauseMusic() {
  if (!sound) return;

  await sound.pauseAsync();
}

export async function resumeMusic() {
  if (!sound) return;

  await sound.playAsync();
}