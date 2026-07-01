import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";;

import { useThemeContext } from "../context/ThemeContext";

type DayData = {
  focusTime: number;
  sessions: number;
  points: number;
};

type Props = {
  dailyHistory: Record<string, DayData>;
};

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

function last42Days() {
  const arr:string[]=[];

  for(let i=41;i>=0;i--){
    const d=new Date();
    d.setDate(d.getDate()-i);

    arr.push(
      d.toISOString().split("T")[0]
    );
  }

  return arr;
}

function getColor(
  minutes:number
){

  if(minutes===0) return "#EBEDF0";

  if(minutes<30)
    return "#9BE9A8";

  if(minutes<60)
    return "#40C463";

  if(minutes<120)
    return "#30A14E";

  return "#216E39";
}

export default function Heatmap({
  dailyHistory,
}:Props){

  const {theme}=useThemeContext();
  const [selectedDate, setSelectedDate] =
  useState<string | null>(null);

const [selectedInfo, setSelectedInfo] =
  useState<any>(null);

  const dates=last42Days();

  const weeks=[];

  for(let i=0;i<dates.length;i+=7){

    weeks.push(
      dates.slice(i,i+7)
    );

  }

  return(

<View
style={[
styles.card,
{
backgroundColor:theme.card
}
]}
>

<Text
style={[
styles.title,
{
color:theme.text
}
]}
>
🔥 Focus Consistency
</Text>

<View
style={styles.container}
>

<View
style={styles.dayColumn}
>

{
DAYS.map(day=>(

<Text
key={day}
style={[
styles.dayLabel,
{
color:theme.secondaryText
}
]}
>
{day}
</Text>

))
}

</View>

{
weeks.map((week,index)=>(

<View
key={index}
style={styles.weekColumn}
>

{
week.map(date=>{

const info=
dailyHistory[date];

const minutes=
info?.focusTime ?? 0;

return(

<TouchableOpacity
key={date}
style={[
styles.square,
{
backgroundColor:
getColor(minutes)
}
]}

onPress={() => {
  setSelectedDate(date);

  setSelectedInfo(
    info ?? {
      focusTime: 0,
      sessions: 0,
      points: 0,
    }
  );
}}
/>

);

})

}

</View>

))
}

</View>

<Text
style={{
marginTop:15,
color:theme.secondaryText,
fontSize:12
}}
>

Tap any square to view details

</Text>
<Modal
  visible={selectedDate !== null}
  transparent
  animationType="fade"
>
  <View
    style={styles.modalOverlay}
  >
    <View
      style={[
        styles.modal,
        {
          backgroundColor:
            theme.card,
        },
      ]}
    >
      <Text
        style={[
          styles.modalTitle,
          {
            color: theme.text,
          },
        ]}
      >
        📅 {selectedDate}
      </Text>

      <Text
        style={{
          color: theme.text,
          marginTop: 15,
        }}
      >
        ⏱️ Focus Time
      </Text>

      <Text
        style={[styles.value, { color: theme.text }]}
      >
        {Math.floor(
          selectedInfo?.focusTime /
            60
        )} min
      </Text>

      <Text
        style={{
          color: theme.text,
        }}
      >
        🔥 Sessions
      </Text>

      <Text
        style={[styles.value, { color: theme.text }]}
      >
        {selectedInfo?.sessions}
      </Text>

      <Text
        style={{
          color: theme.text,
        }}
      >
        ⭐ Points
      </Text>

      <Text
        style={[styles.value, { color: theme.text }]}
      >
        {selectedInfo?.points}
      </Text>

      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => {
          setSelectedDate(null);
        }}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "600",
          }}
        >
          Close
        </Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
</View>

);

}

const styles=StyleSheet.create({

card:{
padding:20,
borderRadius:20,
marginBottom:20,
elevation:4,
},

title:{
fontSize:18,
fontWeight:"700",
marginBottom:20,
},

container:{
flexDirection:"row",
},

dayColumn:{
marginRight:8,
justifyContent:"space-between",
},

dayLabel:{
height:18,
fontSize:11,
marginBottom:6,
},

weekColumn:{
marginRight:6,
},

square:{
width:34,
height:34,
borderRadius:4,
marginBottom:6,
},
modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "center",
  alignItems: "center",
},

modal: {
  width: "85%",
  borderRadius: 20,
  padding: 25,
},

modalTitle: {
  fontSize: 22,
  fontWeight: "700",
},

value: {
  fontSize: 24,
  fontWeight: "700",
  marginBottom: 15,
  marginTop: 5,
},

closeButton: {
  backgroundColor: "#6C63FF",
  padding: 14,
  borderRadius: 12,
  alignItems: "center",
  marginTop: 15,
},

});