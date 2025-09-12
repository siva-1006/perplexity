

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import MapView, { Marker } from "react-native-maps";

export default function ReportIssueScreen() {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState({
    latitude: 11.0770,
    longitude: 77.1425,
  });

  // Open Camera
  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Camera Access Required", "Please allow camera access.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ base64: false });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Upload from gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ base64: false });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const submitReport = () => {
    if (!description || !title) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }
    Alert.alert("Success", "Your report has been submitted!");
    // Here you can send data to backend
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Report an Issue</Text>

      {/* Camera Section */}
      <View style={styles.cameraBox}>
        {image ? (
          <Image source={{ uri: image }} style={styles.previewImage} />
        ) : (
          <Text style={styles.cameraText}>Camera Not Available</Text>
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={openCamera}>
        <Text style={styles.buttonText}>Capture Photo</Text>
      </TouchableOpacity>


      {/* Description */}
      <TextInput
        style={styles.input}
        placeholder="Description*"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      {/* Title */}
      <TextInput
        style={styles.input}
        placeholder="Title* (e.g., Large pothole on Elm Street)"
        value={title}
        onChangeText={setTitle}
      />

      {/* Location */}
      <Text style={styles.label}>Location*</Text>
      <MapView
        style={styles.map}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker coordinate={location} />
      </MapView>

      <TouchableOpacity style={styles.submitBtn} onPress={submitReport}>
        <Text style={styles.submitText}>Submit Report</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  cameraBox: {
    height: 150,
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    backgroundColor: "#f2f2f2",
  },
  cameraText: {
    color: "#888",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#4a90e2",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  linkText: {
    color: "#4a90e2",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  map: {
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
  },
  submitBtn: {
    backgroundColor: "#4a90e2",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
