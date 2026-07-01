import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import {
  auth,
  db,
} from "./firebaseConfig";

/*export const getSessionHistory =
  async () => {
    const user =
      auth.currentUser;

    if (!user) return [];

    const q = query(
      collection(db, "sessions"),
      where("uid", "==", user.uid),
      orderBy(
        "completedAt",
        "desc"
      )
    );

    const snapshot =
      await getDocs(q);

    return snapshot.docs.map(
      (doc) => ({
        id: doc.id,
        ...doc.data(),
      })
    );
  };*/
  export const getSessionHistory = async () => {
  try {
    const user = auth.currentUser;

    if (!user) return [];

    const q = query(
      collection(db, "sessions"),
      where("uid", "==", user.uid),
      orderBy("completedAt", "desc")
    );

    const snapshot = await getDocs(q);

    console.log("History Docs:", snapshot.size);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.log("History Error:", error);
    return [];
  }
};