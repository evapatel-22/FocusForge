import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { useThemeContext } from "../context/ThemeContext";

type Props = NativeStackScreenProps<RootStackParamList, "SessionFailed">;

export default function SessionFailedScreen({ navigation, route }: Props) {
  const { theme } = useThemeContext();
  const reason = route.params.aiResult?.reason || "You left the session too many times.";

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 
      <Text style={styles.emoji}>⚠️</Text>

      <Text style={[styles.title, { color: theme.text }]}>Session Failed</Text>

      <Text style={[styles.subtitle, { color: theme.secondaryText }]}> 
        You were distracted too many times, so this session did not count.
      </Text>

      <View style={[styles.card, { backgroundColor: theme.card }]}> 
        <Text style={[styles.cardLabel, { color: theme.secondaryText }]}>Reason</Text>
        <Text style={[styles.cardValue, { color: theme.text }]}>{reason}</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.accent }]}
        onPress={() => navigation.navigate("Tabs")}
      >
        <Text style={[styles.buttonText, { color: theme.inverseText }]}>Try Another Session</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emoji: {
    fontSize: 90,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 20,
  },
  subtitle: {
    fontSize: 18,
    marginTop: 10,
    textAlign: "center",
  },
  card: {
    marginTop: 32,
    padding: 20,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
    elevation: 4,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  cardValue: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 8,
    textAlign: "center",
  },
  button: {
    marginTop: 36,
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 15,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
