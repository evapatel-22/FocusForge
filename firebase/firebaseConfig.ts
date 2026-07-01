import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCTgBR73c-ubMn6OWIWbAXf3-nfOa5YJ7w",
  authDomain: "focusforge-bb624.firebaseapp.com",
  projectId: "focusforge-bb624",
  storageBucket: "focusforge-bb624.firebasestorage.app",
  messagingSenderId: "275500493526",
  appId: "1:275500493526:web:82cb74578650d7b8aeb777",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;