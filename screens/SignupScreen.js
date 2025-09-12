import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { api } from "../api";

export default function SignupScreen({ navigation }) {
  //const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  //const [info, setInfo] = useState("");


  async function handleSignup() {
    setError("");
    try {
      const data = await api("../routes/auth/signup", "POST", { email, phone, password});
      navigation.replace("CompleteProfile", { token: data.token });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup</Text>
       {/* <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} /> */}
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput style={styles.input} placeholder="Phone" value={phone} onChangeText={setPhone} />
      {/* <TextInput style={styles.input} placeholder="INFO(optional)" value={info} onChangeText={setInfo} /> */}
      
      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
      <TouchableOpacity style={styles.btn} onPress={handleSignup}>
        <Text style={styles.btnText}>Signup</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={{ marginTop: 10 }}>Already have an account? Login</Text>
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
