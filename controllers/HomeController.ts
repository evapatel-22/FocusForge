import { Alert } from "react-native";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { getStats } from "../storage/statsStorage";
import { getRecommendation } from "../firebase/recommendationService";

export async function loadHomeData() {
  const stats = await getStats();

  const user = auth.currentUser;

  if (!user) {
    return {
      points: 0,
      name: "User",
      recommendation: null,
    };
  }

  let name = "User";

  const docSnap = await getDoc(
    doc(db, "users", user.uid)
  );

  if (docSnap.exists()) {
    name = docSnap.data().name || "User";
  }

  let recommendation = null;

  try {
    const result =
      await getRecommendation(user.uid);

    if (result.success) {
      recommendation =
        result.recommendation;
    }
  } catch (err) {
    console.log(err);
  }

  return {
    points: stats.points,
    name,
    recommendation,
  };
}

export function validateTask(
  taskName: string
) {
  if (!taskName.trim()) {
    Alert.alert(
      "Task Required",
      "Please enter a task name."
    );

    return false;
  }

  return true;
}