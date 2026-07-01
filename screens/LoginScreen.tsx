import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import {
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "../firebase/firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { useThemeContext } from "../context/ThemeContext";

export default function LoginScreen() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");
  const { theme } = useThemeContext();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      Alert.alert(
        "Success",
        "Logged in successfully!"
      );
    } catch (error: any) {
      Alert.alert(
        "Login Failed",
        error.message
      );
    }
  };
  const navigation = useNavigation<any>();
 
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.text }]}>FocusForge</Text>
        <Text style={[styles.subtitle, { color: theme.secondaryText }]}>Forge your focus, one session at a time.</Text>

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

        <TouchableOpacity style={[styles.button, { backgroundColor: theme.accent }]} onPress={handleLogin}>
          <Text style={[styles.buttonText, { color: theme.inverseText }]}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={[styles.linkText, { color: theme.secondaryText }]}>Don't have an account? Sign Up</Text>
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