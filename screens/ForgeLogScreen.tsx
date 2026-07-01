import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SectionList,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getDateLabel } from "../utils/dateHelpers";

import { useThemeContext } from "../context/ThemeContext";
import { getSessionHistory } from "../firebase/historyService";
import SessionCard from "../components/SessionCard";

export default function ForgeLogScreen() {
  const { theme } = useThemeContext();

  const [sessions, setSessions] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadHistory = async () => {
    const data = await getSessionHistory();
    console.log("Sessions fetched:", data);
    setSessions(data);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadHistory();
    }, [])
  );

  const refresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };
  const groupedSessions = sessions.reduce(
  (groups: any, session: any) => {
    const label = getDateLabel(session.completedAt);

    if (!groups[label]) {
      groups[label] = [];
    }

    groups[label].push(session);

    return groups;
  },
  {}
);

const sectionData = Object.entries(groupedSessions) as [
  string,
  any[]
][];
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      {/* Header */}
      <View style={{ marginBottom: 20 }}>
        <Text
          style={[
            styles.heading,
            { color: theme.text },
          ]}
        >
          ⚒️ Forge Log
        </Text>

        <Text
          style={{
            color: theme.secondaryText,
            marginTop: 6,
            fontSize: 16,
          }}
        >
          Every completed focus session becomes part of your journey.
        </Text>
      </View>

      <SectionList
        sections={sectionData.map(([title, data]) => ({
    title,
    data,
  }))}

  keyExtractor={(item) => item.id}

  refreshing={refreshing}
  onRefresh={refresh}

  renderSectionHeader={({ section }) => (
    <Text
      style={{
        fontSize: 24,
        fontWeight: "700",
        color: theme.text,
        marginTop: 20,
        marginBottom: 15,
      }}
    >
      {section.title}
    </Text>
  )}

  renderItem={({ item }) => (
    <SessionCard session={item} />
  )}

  contentContainerStyle={{
    paddingBottom: 30,
    flexGrow: 1,
  }}

  ListEmptyComponent={
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 80,
            }}
          >
            <Text style={{ fontSize: 70 }}>
              ⚒️
            </Text>

            <Text
              style={{
                fontSize: 24,
                fontWeight: "700",
                marginTop: 20,
                color: theme.text,
              }}
            >
              Nothing Forged Yet
            </Text>

            <Text
              style={{
                marginTop: 10,
                textAlign: "center",
                color: theme.secondaryText,
                fontSize: 16,
              }}
            >
              Complete your first focus session{"\n"}
              to begin your Forge Log.
            </Text>
          </View>
        }
/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },

  heading: {
    fontSize: 30,
    fontWeight: "bold",
  },
});