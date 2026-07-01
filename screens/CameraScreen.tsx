import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import {
  CameraView,
  useCameraPermissions,
} from "expo-camera";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { useThemeContext } from "../context/ThemeContext";
import { uploadProof } from "../services/aiVerification";


type Props = NativeStackScreenProps<
  RootStackParamList,
  "Camera"
>;

export default function CameraScreen({
  navigation,
  route,
}: Props) {
  const { theme } = useThemeContext();
  const cameraRef = useRef<any>(null);
  const [uploading, setUploading] = useState(false);

  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>Camera permission required</Text>

        <TouchableOpacity
          style={[styles.permissionButton, { backgroundColor: theme.accent }]}
          onPress={requestPermission}
        >
          <Text style={{ color: "white" }}>
            Grant Permission
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
  if (uploading) return;

  setUploading(true);

  try {
    const photo =
      await cameraRef.current.takePictureAsync();

    const result = await uploadProof(
      photo.uri,
      route.params.taskName
    );

    if (result.verified) {
      navigation.replace("Session", {
        taskName: route.params.taskName,
        milestones: route.params.milestones,
        mode: route.params.mode,
        completedMilestones:
          route.params.completedMilestones + 1,
        seconds: route.params.seconds,
        aiResult: result,
      });
    } else {
      Alert.alert(
        "Verification Failed",
        result.reason
      );
    }
  } catch (e) {
    Alert.alert(
      "Verification Error",
      "Please try again."
    );
  } finally {
    setUploading(false);
  }
};


  return (
    <CameraView ref={cameraRef} style={{ flex: 1 }}>
      <View style={styles.overlay}>

  {uploading && (
    <Text
      style={{
        color: "white",
        fontSize: 18,
        marginBottom: 20,
      }}
    >
      Uploading...
    </Text>
  )}

  <TouchableOpacity
  disabled={uploading}
  style={[
    styles.captureButton,
    {
      borderColor: theme.inverseText,
      opacity: uploading ? 0.5 : 1,
    },
  ]}
  onPress={takePicture}
></TouchableOpacity>

</View>
    </CameraView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  permissionButton: {
    marginTop: 20,
    backgroundColor: "#8A9A86",
    padding: 15,
    borderRadius: 10,
  },

  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 40,
  },

  captureButton: {
    width: 85,
    height: 85,
    borderRadius: 42,
    borderWidth: 4,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },

  innerCircle: {
    width: 65,
    height: 65,
    borderRadius: 32,
    backgroundColor: "white",
  },

  uploadText: {
    color: "white",
    fontSize: 18,
    marginBottom: 20,
  },
});