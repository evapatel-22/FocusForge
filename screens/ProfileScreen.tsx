import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { useThemeContext } from "../context/ThemeContext";
import { getStats, saveStats } from "../storage/statsStorage";

import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  signOut,
  updateEmail,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { scheduleDailyReminder } from "../services/notificationService";

import { doc, getDoc, setDoc } from "firebase/firestore";
import * as Notifications from "expo-notifications";

const defaultStats = {
  points: 0,
  sessionsCompleted: 0,
  totalFocusTime: 0,
  todayFocusTime: 0,
  streak: 0,
  lastSessionDate: null,
  weeklyFocus: [0, 0, 0, 0, 0, 0, 0],
};

export default function ProfileScreen() {
  const { theme, mode, toggleTheme } = useThemeContext();
  const [stats, setStats] = useState(defaultStats);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const refreshStats = async () => {
    const data = await getStats();
    setStats(data);
  };

  const loadUserData = async () => {
    const user = auth.currentUser;

    if (!user) return;

    const firestoreDoc = await getDoc(doc(db, "users", user.uid));
    const firestoreName = firestoreDoc.exists() ? firestoreDoc.data().name || "" : "";
    const firestoreEmail = firestoreDoc.exists() ? firestoreDoc.data().email || user.email || "" : user.email || "";

    setEmail(firestoreEmail);
    setNewEmail(firestoreEmail);
    setName(firestoreName || user.displayName || "");
    setNameInput(firestoreName || user.displayName || "");
  };

  useEffect(() => {
    refreshStats();
    loadUserData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      refreshStats();
      loadUserData();
    }, [])
  );

  const handleNameSave = async () => {
    const trimmedName = nameInput.trim();
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Sign in required", "Please sign in again to update your profile.");
      return;
    }

    if (!trimmedName) {
      Alert.alert("Name required", "Please enter a name before saving.");
      return;
    }

    try {
      setIsSaving(true);
      await updateProfile(user, { displayName: trimmedName });
      await setDoc(doc(db, "users", user.uid), { name: trimmedName }, { merge: true });
      setName(trimmedName);
      setIsEditingName(false);
      Alert.alert("Profile updated", "Your name has been updated.");
    } catch (error: any) {
      Alert.alert("Update failed", error.message || "Unable to update your name right now.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEmailSave = async () => {
    const trimmedEmail = newEmail.trim();
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Sign in required", "Please sign in again to update your email.");
      return;
    }

    if (!trimmedEmail) {
      Alert.alert("Email required", "Please enter a new email address.");
      return;
    }

    if (!password.trim()) {
      Alert.alert("Password required", "Please enter your password to change your email.");
      return;
    }

    try {
      setIsSaving(true);
      const credential = EmailAuthProvider.credential(user.email || "", password);
      await reauthenticateWithCredential(user, credential);
      await updateEmail(user, trimmedEmail);
      await setDoc(doc(db, "users", user.uid), { email: trimmedEmail }, { merge: true });
      setEmail(trimmedEmail);
      setNewEmail(trimmedEmail);
      setPassword("");
      setIsEditingEmail(false);
      Alert.alert("Profile updated", "Your email has been updated.");
    } catch (error: any) {
      Alert.alert("Update failed", error.message || "Unable to update your email right now.");
    } finally {
      setIsSaving(false);
    }
  };

  const resetStats = () => {
    Alert.alert("Reset Statistics", "This will delete all progress.", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Reset",
        style: "destructive",
        onPress: async () => {
          await saveStats(defaultStats);
          setStats(defaultStats);
        },
      },
    ]);
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await signOut(auth);
        },
      },
    ]);
  };

  const toggleNotifications = async () => {
    try {
      if (notificationsEnabled) {
        await Notifications.cancelAllScheduledNotificationsAsync();
      } else {
        await scheduleDailyReminder();
      }

      setNotificationsEnabled((prev) => !prev);
    } catch (error) {
      console.log("Notification Error:", error);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{
        padding: 20,
      }}
    >
      <View style={[styles.avatar, { backgroundColor: theme.accent }]}> 
        <Text style={styles.avatarText}>{name?.[0]?.toUpperCase() || "F"}</Text>
      </View>

      <Text style={[styles.name, { color: theme.text }]}>{name || "FocusForge User"}</Text>
      <Text style={[styles.subtitle, { color: theme.secondaryText }]}>FocusForge User</Text>

      <View style={[styles.card, { backgroundColor: theme.card }]}> 
        <View style={styles.rowBetween}>
          <Text style={[styles.cardTitle, { color: theme.secondaryText }]}>Name</Text>
          {!isEditingName && (
            <TouchableOpacity onPress={() => { setIsEditingName(true); setNameInput(name); }}>
              <Text style={[styles.editLink, { color: theme.accent }]}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        {isEditingName ? (
          <>
            <TextInput
              value={nameInput}
              onChangeText={setNameInput}
              placeholder="Enter your name"
              placeholderTextColor={theme.secondaryText}
              style={[styles.input, { color: theme.text, borderColor: theme.secondaryText }]}
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.accent }]} onPress={handleNameSave} disabled={isSaving}>
                <Text style={styles.actionButtonText}>{isSaving ? "Saving..." : "Save"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => { setIsEditingName(false); setNameInput(name); }}>
                <Text style={[styles.secondaryButtonText, { color: theme.text }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Text style={[styles.cardValue, { color: theme.text }]}>{name || "FocusForge User"}</Text>
        )}
      </View>

      <View style={[styles.card, { backgroundColor: theme.card }]}> 
        <View style={styles.rowBetween}>
          <Text style={[styles.cardTitle, { color: theme.secondaryText }]}>Email</Text>
          {!isEditingEmail && (
            <TouchableOpacity onPress={() => { setIsEditingEmail(true); setNewEmail(email); }}>
              <Text style={[styles.editLink, { color: theme.accent }]}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        {isEditingEmail ? (
          <>
            <TextInput
              value={newEmail}
              onChangeText={setNewEmail}
              placeholder="New email"
              placeholderTextColor={theme.secondaryText}
              keyboardType="email-address"
              autoCapitalize="none"
              style={[styles.input, { color: theme.text, borderColor: theme.secondaryText }]}
            />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Current password"
              placeholderTextColor={theme.secondaryText}
              secureTextEntry
              style={[styles.input, { color: theme.text, borderColor: theme.secondaryText }]}
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.accent }]} onPress={handleEmailSave} disabled={isSaving}>
                <Text style={styles.actionButtonText}>{isSaving ? "Saving..." : "Save"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => { setIsEditingEmail(false); setNewEmail(email); setPassword(""); }}>
                <Text style={[styles.secondaryButtonText, { color: theme.text }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Text style={[styles.cardValue, { color: theme.text, fontSize: 16, fontWeight: "600", marginTop: 8 }]}>{email || "Not signed in"}</Text>
        )}
      </View>

      <View style={[styles.card, { backgroundColor: theme.card }]}> 
        <Text style={[styles.cardTitle, { color: theme.secondaryText }]}>Level</Text>
        <Text style={[styles.cardValue, { color: theme.text }]}> 
          {stats.points >= 5000
            ? "🏆 Forge Master"
            : stats.points >= 2500
            ? "🥇 Gold Smith"
            : stats.points >= 1000
            ? "🥈 Silver Smith"
            : "🥉 Bronze Smith"}s
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card }]}> 
        <Text style={[styles.cardTitle, { color: theme.secondaryText }]}>Lifetime Focus</Text>
        <Text style={[styles.cardValue, { color: theme.text }]}> 
          {Math.floor(stats.totalFocusTime / 3600)}h {Math.floor((stats.totalFocusTime % 3600) / 60)}m
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card }]}> 
        <Text style={[styles.cardTitle, { color: theme.secondaryText }]}>Current Streak</Text>
        <Text style={[styles.cardValue, { color: theme.text }]}> 
          {stats.streak} Days
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card }]}> 
        <Text style={[styles.cardTitle, { color: theme.secondaryText }]}>Settings</Text>

        <TouchableOpacity onPress={toggleTheme}>
          <Text style={[styles.setting, { color: theme.text }]}> 
            {mode === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleNotifications}>
          <Text style={[styles.setting, { color: theme.text }]}>
            {notificationsEnabled ? "🔔 Notifications ON" : "🔕 Notifications OFF"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={resetStats}>
          <Text style={[styles.setting, { color: theme.text }]}>🗑 Reset Statistics</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              "About FocusForge",
              "FocusForge v1.0\n\nA productivity app that rewards consistency, focus and discipline.\n\nBuilt with React Native, Expo and TypeScript."
            )
          }
        >
          <Text style={[styles.setting, { color: theme.text }]}>ℹ️ About FocusForge</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout}>
          <Text style={{ color: "red", fontSize: 18, marginTop: 20, textAlign: "center" }}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles: any = StyleSheet.create({
  container: {
    flex: 1,
  },
  setting: {
    fontSize: 18,
    marginTop: 15,
  },
  profileCard: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileEmail: {
    fontSize: 14,
    color: "gray",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  avatarText: {
    fontSize: 42,
    fontWeight: "bold",
    color: "white",
  },
  name: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 15,
  },
  subtitle: {
    textAlign: "center",
    color: "#777",
    marginBottom: 30,
  },
  card: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 16,
    color: "#666",
  },
  cardValue: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  editLink: {
    fontSize: 15,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 12,
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 10,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  actionButtonText: {
    color: "white",
    fontWeight: "600",
  },
  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#e5e7eb",
  },
  secondaryButtonText: {
    fontWeight: "600",
  },
});
