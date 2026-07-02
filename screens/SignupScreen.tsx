import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";
import { auth } from "../firebase/firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { useThemeContext } from "../context/ThemeContext";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { theme } = useThemeContext();

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, "users", userCredential.user.uid), {
        name,
        points: 0,
        sessionsCompleted: 0,
        totalFocusTime: 0,
        todayFocusTime: 0,
        streak: 0,
        weeklyFocus: [0, 0, 0, 0, 0, 0, 0],
      });

      Alert.alert("Success", "Account created!");
    } catch (error: any) {
      Alert.alert("Signup Failed", error.message);
    }
  };

  const navigation = useNavigation<any>();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={[
          styles.card,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <Text style={[styles.title, { color: theme.text }]}>Create Account</Text>
        <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
          Join FocusForge and start building your focus streak.
        </Text>

        <TextInput
          placeholder="Full Name"
          placeholderTextColor={theme.mode === "dark" ? "#FFFFFF" : "#111827"}
          style={[
            styles.input,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
              color: theme.text,
            },
          ]}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <TextInput
          placeholder="Email"
          placeholderTextColor={theme.mode === "dark" ? "#FFFFFF" : "#111827"}
          style={[
            styles.input,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
              color: theme.text,
            },
          ]}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor={theme.mode === "dark" ? "#FFFFFF" : "#111827"}
          secureTextEntry
          style={[
            styles.input,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
              color: theme.text,
            },
          ]}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.accent }]}
          onPress={handleSignup}
        >
          <Text style={[styles.buttonText, { color: theme.inverseText }]}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={[styles.linkText, { color: theme.secondaryText }]}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },

  card: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    textAlign: "center",
    marginBottom: 24,
    fontSize: 15,
  },

  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 15,
  },

  button: {
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },

  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
  },

  linkText: {
    textAlign: "center",
    marginTop: 18,
    fontSize: 14,
  },
});