import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebaseConfig";

export const saveSession = async ({
  uid,
  taskName,
  duration,
  verified,
  confidence,
  reason,
  pointsEarned,
}: {
  uid: string;
  taskName: string;
  duration: number;
  verified: boolean;
  confidence: number;
  reason: string;
  pointsEarned: number;
}) => {
  await addDoc(collection(db, "sessions"), {
    uid,
    taskName,
    duration,
    verified,
    confidence,
    reason,
    pointsEarned,
    completedAt: serverTimestamp(),
  });
};