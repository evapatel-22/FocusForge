import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { db } from "./firebaseConfig";
import { auth } from "./firebaseConfig";
import { updateDoc } from "firebase/firestore";

export const getUserStats = async (
  uid: string
) => {
  const docRef = doc(
    db,
    "users",
    uid
  );

  const docSnap =
    await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  }

  const defaultStats = {
    points: 0,
    sessionsCompleted: 0,
    totalFocusTime: 0,
    todayFocusTime: 0,
    streak: 0,
    weeklyFocus: [
      0, 0, 0, 0, 0, 0, 0,
    ],
  };

  await setDoc(
    docRef,
    defaultStats
  );

  return defaultStats;
};

export const saveUserStats =
  async (
    uid: string,
    stats: any
  ) => {
    await setDoc(
  doc(db, "users", uid),
  stats,
  { merge: true }
);
  };
export const getCurrentUserStats =
  async () => {
    const user = auth.currentUser;

    if (!user) {
      throw new Error(
        "No authenticated user"
      );
    }

    return getUserStats(user.uid);
  };

export const saveCurrentUserStats =
  async (stats: any) => {
    const user = auth.currentUser;

    if (!user) {
      throw new Error(
        "No authenticated user"
      );
    }

    await saveUserStats(
      user.uid,
      stats
    );
  };
 

export const getDailyRecommendation = async () => {
  const user = auth.currentUser;
  if (!user) return null;

  const docSnap = await getDoc(
    doc(db, "users", user.uid)
  );

  if (!docSnap.exists()) return null;

  return {
    recommendation:
      docSnap.data().dailyRecommendation ?? null,

    date:
      docSnap.data().dailyRecommendationDate ?? null,
  };
};

export const saveDailyRecommendation =
  async (recommendation: any) => {

    const user = auth.currentUser;

    if (!user) return;

    const today =
      new Date().toISOString().split("T")[0];

    await updateDoc(
      doc(db, "users", user.uid),
      {
        dailyRecommendation:
          recommendation,

        dailyRecommendationDate:
          today,
      }
    );
  };