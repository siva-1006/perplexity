

// // screens/LoginScreen.js
// import React, { useState } from "react";
// import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from "react-native";

// export default function LoginScreen({ navigation }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   return (
//     <View style={styles.container}>
//       <Text style={styles.logo}>CivicCare</Text>
//       <TextInput
//         placeholder="Email/Phone"
//         style={styles.input}
//         value={email}
//         onChangeText={setEmail}
//       />
//       <TextInput
//         placeholder="Password"
//         secureTextEntry
//         style={styles.input}
//         value={password}
//         onChangeText={setPassword}
//       />
//       <Button title="Login" color="green" onPress={() => navigation.replace("Main")} />
      
//       <TouchableOpacity style={styles.signup}>
//         <Text>Signup</Text>
//       </TouchableOpacity>
      
//       <TouchableOpacity style={styles.google}>
//         <Text>Continue with Google</Text>
//       </TouchableOpacity>

//       <Text style={{ marginTop: 20 }}>Report Issues. Improve Your City.</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
//   logo: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
//   input: { width: "100%", borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 10 },
//   signup: { marginVertical: 10 },
//   google: { marginVertical: 10, borderWidth: 1, padding: 10, borderRadius: 5 },
// });

// screens/LoginScreen.js
import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      {/* App Logo */}
      <Image
         source={require("../assets/image.png")}  // <-- Add a logo in assets/
        style={styles.logo}
      />
      <Text style={styles.title}>CivicCare</Text>

      {/* Inputs */}
      <TextInput
        placeholder="Email / Phone"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      {/* Buttons */}
      <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.replace("Main")}>
        <Text style={styles.btnText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.outlineBtn}>
        <Text style={styles.outlineText}>Signup</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.googleBtn}>
        <Image source={require("../assets/google.webp")} style={styles.googleIcon} />
        <Text style={styles.googleText}>Continue with Google</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>Report Issues. Improve Your City.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#f8f9fa" },
  logo: { width: 80, height: 80, marginBottom: 10 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, color: "#2e7d32" },
  input: { width: "100%", backgroundColor: "#fff", borderRadius: 10, padding: 12, marginVertical: 8, borderWidth: 1, borderColor: "#ccc" },
  loginBtn: { width: "100%", backgroundColor: "#2e7d32", padding: 14, borderRadius: 10, alignItems: "center", marginTop: 10 },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  outlineBtn: { width: "100%", borderColor: "#2e7d32", borderWidth: 1, padding: 14, borderRadius: 10, alignItems: "center", marginTop: 10 },
  outlineText: { color: "#2e7d32", fontSize: 16, fontWeight: "bold" },
  googleBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", width: "100%", padding: 14, borderWidth: 1, borderColor: "#ccc", borderRadius: 10, marginTop: 15, backgroundColor: "#fff" },
  googleIcon: { width: 20, height: 20, marginRight: 8 },
  googleText: { fontSize: 15, fontWeight: "600" },
  footer: { marginTop: 20, fontSize: 14, color: "#555" },
});
