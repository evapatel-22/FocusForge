import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { auth } from "../firebase/firebaseConfig";
import { getLeaderboard } from "../firebase/leaderboardService";
import { useThemeContext } from "../context/ThemeContext";

export default function LeaderboardScreen() {
  const { theme } = useThemeContext();

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

    useFocusEffect(
  React.useCallback(() => {
    loadLeaderboard();
  }, [])
);

  const loadLeaderboard = async () => {
    try {
      const data = await getLeaderboard();
      setUsers(data);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  const currentUid = auth.currentUser?.uid;

  const getMedal = (index: number) => {
    if (index === 0) return "👑";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  if (loading) {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: theme.background },
        ]}
      >
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >

      <Text
  style={[
    styles.title,
    {
      color: theme.text,
    },
  ]}
>
  🏆 Global Leaderboard
</Text>

<View style={styles.podium}>

<View
style={[
styles.secondCard,
{
backgroundColor:theme.card
}
]}
>

<Text style={styles.medal}>
🥈
</Text>

<Text
style={[
styles.name,
{
color:theme.text
}
]}
>
{users[1]?.name ?? "--"}
</Text>

<Text
style={{
color:theme.secondaryText
}}
>
⭐ {users[1]?.points ?? 0}
</Text>

</View>

<View
style={[
styles.firstCard,
{
backgroundColor:"#FFD54F"
}
]}
>

<Text style={styles.crown}>
👑
</Text>

<Text
style={[
styles.name,
{
color:"#333"
}
]}
>
{users[0]?.name ?? "--"}
</Text>

<Text
style={{
color:"#333"
}}
>
⭐ {users[0]?.points ?? 0}
</Text>

</View>

<View
style={[
styles.thirdCard,
{
backgroundColor:theme.card
}
]}
>

<Text style={styles.medal}>
🥉
</Text>

<Text
style={[
styles.name,
{
color:theme.text
}
]}
>
{users[2]?.name ?? "--"}
</Text>

<Text
style={{
color:theme.secondaryText
}}
>
⭐ {users[2]?.points ?? 0}
</Text>

</View>

</View>

<FlatList
data={users.slice(3)}
keyExtractor={(item)=>item.uid}
renderItem={({item,index})=>(

<View
style={[
styles.card,
{
backgroundColor:
item.uid===currentUid
?theme.accent
:theme.card
}
]}
>

<Text
style={[
styles.rank,
{
color:
item.uid===currentUid
?"white"
:theme.text
}
]}
>

#{index+4}

</Text>

<View style={{flex:1}}>

<Text
style={[
styles.name,
{
color:
item.uid===currentUid
?"white"
:theme.text
}
]}
>
{item.name}
</Text>

<Text
style={{
color:
item.uid===currentUid
?"white"
:theme.secondaryText
}}
>
⭐ {item.points}
</Text>

</View>

</View>

)}
/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 35,
    paddingHorizontal: 20,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 20,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 18,
    marginBottom: 15,
    elevation: 3,
  },

  rank: {
    fontSize: 26,
    width: 50,
    textAlign: "center",
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  podium:{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"flex-end",
marginBottom:30,
},

firstCard:{
flex:1,
padding:18,
borderRadius:20,
alignItems:"center",
height:180,
justifyContent:"center",
marginHorizontal:5,
},

secondCard:{
flex:1,
padding:15,
borderRadius:20,
alignItems:"center",
height:140,
justifyContent:"center",
marginRight:5,
},

thirdCard:{
flex:1,
padding:15,
borderRadius:20,
alignItems:"center",
height:120,
justifyContent:"center",
marginLeft:5,
},

crown:{
fontSize:38,
marginBottom:8,
},

medal:{
fontSize:30,
marginBottom:8,
},
});