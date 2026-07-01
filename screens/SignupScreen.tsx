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
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  doc,
  setDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";

import { auth } from "../firebase/firebaseConfig";
import { useNavigation } from "@react-navigation/native";

export default function SignupScreen() {
  const [name, setName] =
  useState("");
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");
  

  const handleSignup = async () => {
  try {
    const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

    await setDoc(
      doc(
        db,
        "users",
        userCredential.user.uid
      ),
      {
        name,
        points: 0,
        sessionsCompleted: 0,
        totalFocusTime: 0,
        todayFocusTime: 0,
        streak: 0,
        weeklyFocus: [0, 0, 0, 0, 0, 0, 0],
      }
    );

    Alert.alert(
      "Success",
      "Account created!"
    );
  } catch (error: any) {
    Alert.alert(
      "Signup Failed",
      error.message
    );
  }
};
  const navigation = useNavigation<any>();
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Create Account
      </Text>
      <TextInput
        placeholder="Full Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSignup}
      >
        <Text style={styles.buttonText}>
          Sign Up
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
  onPress={() =>
    navigation.navigate("Login")
  }
>
  <Text
    style={{
      textAlign: "center",
      marginTop: 20,
    }}
  >
    Already have an account? Login
  </Text>
</TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 14,
    marginBottom: 15,
  },

  button: {
    backgroundColor: "#8A9A86",
    padding: 16,
    borderRadius: 12,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});