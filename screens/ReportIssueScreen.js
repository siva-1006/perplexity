

// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   Alert,
//   ScrollView,
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import MapView, { Marker } from "react-native-maps";

// export default function ReportIssueScreen() {
//   const [image, setImage] = useState(null);
//   const [description, setDescription] = useState("");
//   const [title, setTitle] = useState("");
//   const [location, setLocation] = useState({
//     latitude: 11.0770,
//     longitude: 77.1425,
//   });

//   // Open Camera
//   const openCamera = async () => {
//     const { status } = await ImagePicker.requestCameraPermissionsAsync();
//     if (status !== "granted") {
//       Alert.alert("Camera Access Required", "Please allow camera access.");
//       return;
//     }
//     const result = await ImagePicker.launchCameraAsync({ base64: false });
//     if (!result.canceled) {
//       setImage(result.assets[0].uri);
//     }
//   };

//   // Upload from gallery
//   const pickImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({ base64: false });
//     if (!result.canceled) {
//       setImage(result.assets[0].uri);
//     }
//   };

//   const submitReport = () => {
//     if (!description || !title) {
//       Alert.alert("Error", "Please fill all required fields.");
//       return;
//     }
//     Alert.alert("Success", "Your report has been submitted!");
//     // Here you can send data to backend
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.header}>Report an Issue</Text>

//       {/* Camera Section */}
//       <View style={styles.cameraBox}>
//         {image ? (
//           <Image source={{ uri: image }} style={styles.previewImage} />
//         ) : (
//           <Text style={styles.cameraText}>Camera Not Available</Text>
//         )}
//       </View>

//       <TouchableOpacity style={styles.button} onPress={openCamera}>
//         <Text style={styles.buttonText}>Capture Photo</Text>
//       </TouchableOpacity>


//       {/* Description */}
//       <TextInput
//         style={styles.input}
//         placeholder="Description*"
//         value={description}
//         onChangeText={setDescription}
//         multiline
//       />

//       {/* Title */}
//       <TextInput
//         style={styles.input}
//         placeholder="Title* (e.g., Large pothole on Elm Street)"
//         value={title}
//         onChangeText={setTitle}
//       />

//       {/* Location */}
//       <Text style={styles.label}>Location*</Text>
//       <MapView
//         style={styles.map}
//         region={{
//           latitude: location.latitude,
//           longitude: location.longitude,
//           latitudeDelta: 0.01,
//           longitudeDelta: 0.01,
//         }}
//       >
//         <Marker coordinate={location} />
//       </MapView>

//       <TouchableOpacity style={styles.submitBtn} onPress={submitReport}>
//         <Text style={styles.submitText}>Submit Report</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     backgroundColor: "#fff",
//   },
//   header: {
//     fontSize: 22,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   cameraBox: {
//     height: 150,
//     borderWidth: 1,
//     borderColor: "#aaa",
//     borderRadius: 8,
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 10,
//     backgroundColor: "#f2f2f2",
//   },
//   cameraText: {
//     color: "#888",
//   },
//   previewImage: {
//     width: "100%",
//     height: "100%",
//     borderRadius: 8,
//   },
//   button: {
//     backgroundColor: "#4a90e2",
//     padding: 12,
//     borderRadius: 8,
//     alignItems: "center",
//     marginVertical: 8,
//   },
//   buttonText: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
//   linkText: {
//     color: "#4a90e2",
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 15,
//   },
//   label: {
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
//   map: {
//     height: 200,
//     borderRadius: 8,
//     marginBottom: 20,
//   },
//   submitBtn: {
//     backgroundColor: "#4a90e2",
//     padding: 15,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   submitText: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
// });





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
  Platform,
  NativeModules,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import MapView, { Marker } from "react-native-maps";
import { api } from "../api";
import { authStorage } from "../utils/auth";



/* Try to use native module if present (will be undefined in managed Expo) */
const PyTorchModule = NativeModules?.PyTorchModule || null;

/* Build ML server URL dynamically. You can override with EXPO_PUBLIC_ML_SERVER (full URL). */
const resolveMlServerUrl = () => {
  // 1) Explicit override via env (Expo: app.json -> expo.extra or EXPO_PUBLIC_*)
  const envUrl = typeof process !== "undefined" && process?.env?.EXPO_PUBLIC_ML_SERVER;
  if (envUrl && /^https?:\/\//i.test(envUrl)) {
    return envUrl.endsWith("/predict") ? envUrl : `${envUrl.replace(/\/$/, "")}/predict`;
  }

  // 2) Try to infer Metro host for LAN builds
  try {
    const scriptURL = NativeModules?.SourceCode?.scriptURL;
    if (scriptURL) {
      const hostMatch = scriptURL.match(/^(https?:\/\/)([\w.-]+):(\d+)\//i);
      if (hostMatch) {
        const protocol = "http://"; // dev servers usually run on http
        let host = hostMatch[2];
        // Android emulator can't access host localhost/127.0.0.1; must use 10.0.2.2
        if (Platform.OS === "android" && (host === "localhost" || host === "127.0.0.1")) {
          host = "10.0.2.2";
        }
        // Common default port for simple Flask/FastAPI dev servers
        return `${protocol}${host}:8000/predict`;
      }
    }
  } catch {}

  // 3) Last resort: remind to set your LAN IP
  return "http://10.10.55.52:8000/predict"; // update to your machine's IP if needed
};
const ML_SERVER_URL = resolveMlServerUrl();
const HAS_SERVER_OVERRIDE = !!(typeof process !== "undefined" && process?.env?.EXPO_PUBLIC_ML_SERVER);
const USING_EXPO_GO = (() => {
  try {
    const url = NativeModules?.SourceCode?.scriptURL || "";
    return /exp:\/\//.test(url) || /\:1900\d\//.test(url);
  } catch {
    return false;
  }
})();

const LABELS = [
  "Pothole",
  "Garbage",
  "Grafitti",
];

export default function ReportIssueScreen() {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  // const [title, setTitle] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [category, setCategory] = useState("None");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [location, setLocation] = useState({
    latitude: 11.077,
    longitude: 77.1425,
  });

  const convertToBase64 = async (uri) => {
    // works on Expo
    const resp = await fetch(uri);
    const blob = await resp.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const b64 = reader.result.split(",")[1];
        resolve(b64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const runModel = async (uri) => {
    setLoadingPrediction(true);
    setPrediction("Running...");
    try {
      if (PyTorchModule && PyTorchModule.runModel) {
        // Native path (offline) - pass base64 string
        const b64 = await convertToBase64(uri);
        let result = await PyTorchModule.runModel(b64);
        // normalize result (native might return string)
        if (typeof result === "string") {
          const parsed = parseInt(result, 10);
          if (!Number.isNaN(parsed)) result = parsed;
        }
        let label = "Unknown";
        if (typeof result === "number" && result >= 0 && result < LABELS.length) {
          label = LABELS[result];
        }
        setPrediction(label);
        setCategory(label);
        setDropdownOpen(true);
      } else {
        // Backend path (online)
        const formData = new FormData();
        // RN requires file object with uri, name, type
        formData.append("file", {
          uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
          name: "photo.jpg",
          type: "image/jpeg",
        });

        // Add a timeout so we fail fast with a clearer message
        const doPost = async () => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000);
          try {
            const response = await fetch(ML_SERVER_URL, {
              method: "POST",
              body: formData,
              signal: controller.signal,
              // DO NOT set Content-Type; let fetch set boundary
            });
            return response;
          } finally {
            clearTimeout(timeoutId);
          }
        };

        // One retry on timeout or network error
        let res;
        try {
          res = await doPost();
        } catch (e) {
          await new Promise((r) => setTimeout(r, 500));
          res = await doPost();
        }

        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const json = await res.json();
        
        // Log detailed ML response for verification
        console.log("🔍 ML SERVER RESPONSE:", json);
        
        // server should return { prediction: <index or label>, label?: <label>, confidence?: <number> }
        let label = "Unknown";
        let confidence = 0;
        
        if (json.label) {
          label = json.label;
        } else if (typeof json.prediction === "number") {
          label = LABELS[json.prediction] || "Unknown";
        } else if (typeof json.prediction === "string") {
          // if server sends string label
          label = json.prediction;
        }
        
        if (json.confidence) {
          confidence = json.confidence;
        }
        
        // Show detailed prediction result
        const detailedResult = confidence > 0 
          ? `${label} (${(confidence * 100).toFixed(1)}% confidence)`
          : label;
          
        setPrediction(detailedResult);
        setCategory(label);
        setDropdownOpen(true);
      }
    } catch (err) {
      console.error("🔴 runModel error:", err);
      console.error("🔴 Error details:", {
        name: err?.name,
        message: err?.message,
        stack: err?.stack,
        url: ML_SERVER_URL
      });
      
      // Friendly hints for common causes
      const hint =
        Platform.OS === "android"
          ? "Ensure your phone and PC are on the same Wi‑Fi. If using Android emulator and the server runs on your PC, try http://10.0.2.2:8000."
          : "Ensure your device and PC are on the same Wi‑Fi, and the server is reachable.";
      
      const errorMessage = err?.name === "AbortError" 
        ? "Request timed out - ML server may be slow or unreachable"
        : err?.message || String(err);
        
      Alert.alert(
        "ML Prediction Error",
        `${errorMessage}\n\n🔧 Debug Info:\n• URL: ${ML_SERVER_URL}\n• Platform: ${Platform.OS}\n\n💡 Solutions:\n• Check if ML server is running on port 8000\n• Verify network connection\n• ${hint}`
      );
      setPrediction(null);
      setCategory("None");
    } finally {
      setLoadingPrediction(false);
    }
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Camera Access Required", "Please allow camera access.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ base64: false, quality: 0.8 });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      runModel(uri);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ base64: false, quality: 0.8 });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      runModel(uri);
    }
  };

  const submitReport = async () => {
    if (!category || category === "None") {
      Alert.alert("Verify Issue", "Please verify/select the problem before submitting.");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Error", "Please provide a description.");
      return;
    }

    try {
      const payload = {
        description,
        category,
        location,
        image,
        modelPrediction: prediction,
      };

      // Get token from storage
      const token = await authStorage.getToken();
      
      if (!token) {
        Alert.alert("Error", "Please login to submit reports.");
        return;
      }

      // Check if it's a demo token
      if (token.startsWith("demo-token-")) {
        // Demo mode - just show success without backend call
        Alert.alert("Success", "Demo report submitted successfully! (Demo mode)");
      } else {
        // Real backend call
        try {
          const response = await api("/api/auth/reports", "POST", payload, token);
          Alert.alert("Success", "Report submitted successfully!");
        } catch (error) {
          Alert.alert("Error", "Failed to submit report. Please try again.");
          return;
        }
      }
      
      // Reset form
      setImage(null);
      setDescription("");
      setCategory("None");
      setPrediction(null);
      setDropdownOpen(false);
      
    } catch (error) {
      console.error("Submit error:", error);
      Alert.alert("Error", "Failed to submit report. Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Report an Issue</Text>

      <View style={styles.cameraBox}>
        {image ? <Image source={{ uri: image }} style={styles.previewImage} /> : <Text style={styles.cameraText}>No Photo</Text>}
      </View>

      <TouchableOpacity style={styles.button} onPress={openCamera}>
        <Text style={styles.buttonText}>Capture Photo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Upload from Gallery</Text>
      </TouchableOpacity>

      <View style={{ marginTop: 12 }}>
        <Text style={{ marginBottom: 6, fontWeight: "600" }}>Detected / Choose problem</Text>

        <View style={styles.dropdownContainer}>
          <TouchableOpacity style={styles.dropdown} onPress={() => setDropdownOpen((s) => !s)}>
            <Text style={styles.dropdownText}>{category}</Text>
          </TouchableOpacity>

          {dropdownOpen && (
            <View style={styles.dropdownList}>
              {LABELS.map((lbl) => (
                <TouchableOpacity key={lbl} style={styles.dropdownItem} onPress={() => { setCategory(lbl); setDropdownOpen(false); }}>
                  <Text style={styles.dropdownItemText}>{lbl}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {loadingPrediction ? (
          <Text style={{ marginTop: 8 }}>Running model...</Text>
        ) : prediction ? (
          <View style={{ marginTop: 8 }}>
            <Text style={{ color: "#333" }}>
              Model prediction: <Text style={{ fontWeight: "700" }}>{prediction}</Text>
            </Text>
            <Text style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
              Check console/terminal for detailed ML output
            </Text>
          </View>
        ) : null}
      </View>

      <TextInput style={styles.input} placeholder="Description*" value={description} onChangeText={setDescription} multiline />
      {/* <TextInput style={styles.input} placeholder="Title*" value={title} onChangeText={setTitle} /> */}

      <Text style={styles.label}>Location*</Text>
      <MapView style={styles.map} region={{ latitude: location.latitude, longitude: location.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 }}>
        <Marker coordinate={location} />
      </MapView>

      <TouchableOpacity style={styles.submitBtn} onPress={submitReport}>
        <Text style={styles.submitText}>Submit Report</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", paddingBottom: 40 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  cameraBox: { height: 150, borderWidth: 1, borderColor: "#aaa", borderRadius: 8, alignItems: "center", justifyContent: "center", marginBottom: 10, backgroundColor: "#f2f2f2", overflow: "hidden" },
  cameraText: { color: "#888" },
  previewImage: { width: "100%", height: "100%", borderRadius: 8 },
  button: { backgroundColor: "#4a90e2", padding: 12, borderRadius: 8, alignItems: "center", marginVertical: 8 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 15 },
  label: { fontWeight: "bold", marginBottom: 5 },
  map: { height: 200, borderRadius: 8, marginBottom: 20 },
  submitBtn: { backgroundColor: "#4a90e2", padding: 15, borderRadius: 8, alignItems: "center" },
  submitText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  dropdownContainer: { width: "100%" },
  dropdown: { borderWidth: 1, borderColor: "#ccc", padding: 12, borderRadius: 8, backgroundColor: "#fff" },
  dropdownText: { fontSize: 16 },
  dropdownList: { marginTop: 8, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, overflow: "hidden", backgroundColor: "#fafafa" },
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#eee" },
  dropdownItemText: { fontSize: 15 },
});
