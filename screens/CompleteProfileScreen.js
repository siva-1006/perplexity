import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { api } from "../api";

export default function CompleteProfileScreen({ route, navigation }) {
  const { token } = route.params;
  const [name, setName] = useState("");
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");

  async function handleSave() {
    setError("");
    try {
      await api("/api/auth/me", "PUT", { name, info }, token);
      navigation.replace("MainTabs");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete Your Profile</Text>
      <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="About You" value={info} onChangeText={setInfo} />
      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
      <TouchableOpacity style={styles.btn} onPress={handleSave}>
        <Text style={styles.btnText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, padding: 12, marginVertical: 8, borderRadius: 8 },
  btn: { backgroundColor: "#2e7d32", padding: 14, borderRadius: 8, marginTop: 10 },
  btnText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
});
