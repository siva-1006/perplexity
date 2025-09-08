// screens/ReportIssueScreen.js
import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";
import * as Location from "expo-location";

export default function ReportIssueScreen({ navigation }) {
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [location, setLocation] = useState(null);

  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const cameraRef = useRef(null);

  // Request permissions
  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");

      const locationStatus = await Location.requestForegroundPermissionsAsync();
      if (locationStatus.status === "granted") {
        const current = await Location.getCurrentPositionAsync({});
        setLocation(current.coords);
      }
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current && cameraReady) {
      const photo = await cameraRef.current.takePictureAsync();
      setImageUri(photo.uri);
    }
  };

  const submitReport = () => {
    console.log({
      description: desc,
      category,
      location,
      image: imageUri,
    });
    alert("Report submitted!");
    navigation.goBack();
  };

  if (hasCameraPermission === null) return <Text>Requesting permissions...</Text>;
  if (hasCameraPermission === false) return <Text>No access to camera</Text>;

  return (
    <View style={styles.container}>
      {!imageUri ? (
        <Camera
          style={styles.camera}
          ref={cameraRef}
          onCameraReady={() => setCameraReady(true)}
        >
          <View style={styles.captureButtonContainer}>
            <TouchableOpacity style={styles.captureButton} onPress={takePicture} />
          </View>
        </Camera>
      ) : (
        <Image source={{ uri: imageUri }} style={styles.preview} />
      )}

      <Text>📍 Location: {location ? `${location.latitude}, ${location.longitude}` : "Auto-tagging..."}</Text>

      <TextInput
        placeholder="Describe the issue..."
        style={styles.input}
        value={desc}
        onChangeText={setDesc}
      />
      <TextInput
        placeholder="Select Category"
        style={styles.input}
        value={category}
        onChangeText={setCategory}
      />

      <Button title="Submit" color="green" onPress={submitReport} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  camera: { flex: 1, borderRadius: 10, overflow: "hidden" },
  captureButtonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 20,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
    borderWidth: 3,
    borderColor: "green",
  },
  preview: { width: "100%", height: 300, marginVertical: 10, borderRadius: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 10 },
});
