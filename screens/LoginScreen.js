

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
// import React, { useState } from "react";
// import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

// export default function LoginScreen({ navigation }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   return (
//     <View style={styles.container}>
//       {/* App Logo */}
//       <Image
//          source={require("../assets/image.png")}  // <-- Add a logo in assets/
//         style={styles.logo}
//       />
//       <Text style={styles.title}>CivicCare</Text>

//       {/* Inputs */}
//       <TextInput
//         placeholder="Email / Phone"
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

//       {/* Buttons */}
//       <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.replace("Main")}>
//         <Text style={styles.btnText}>Login</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.outlineBtn}>
//         <Text style={styles.outlineText}>Signup</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.googleBtn}>
//         <Image source={require("../assets/google.webp")} style={styles.googleIcon} />
//         <Text style={styles.googleText}>Continue with Google</Text>
//       </TouchableOpacity>

//       <Text style={styles.footer}>Report Issues. Improve Your City.</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#f8f9fa" },
//   logo: { width: 80, height: 80, marginBottom: 10 },
//   title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, color: "#2e7d32" },
//   input: { width: "100%", backgroundColor: "#fff", borderRadius: 10, padding: 12, marginVertical: 8, borderWidth: 1, borderColor: "#ccc" },
//   loginBtn: { width: "100%", backgroundColor: "#2e7d32", padding: 14, borderRadius: 10, alignItems: "center", marginTop: 10 },
//   btnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
//   outlineBtn: { width: "100%", borderColor: "#2e7d32", borderWidth: 1, padding: 14, borderRadius: 10, alignItems: "center", marginTop: 10 },
//   outlineText: { color: "#2e7d32", fontSize: 16, fontWeight: "bold" },
//   googleBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", width: "100%", padding: 14, borderWidth: 1, borderColor: "#ccc", borderRadius: 10, marginTop: 15, backgroundColor: "#fff" },
//   googleIcon: { width: 20, height: 20, marginRight: 8 },
//   googleText: { fontSize: 15, fontWeight: "600" },
//   footer: { marginTop: 20, fontSize: 14, color: "#555" },
// });



import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from "react-native";
import { api } from "../api";
import { authStorage } from "../utils/auth";

export default function LoginScreen({ navigation }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    setError("");
    
    // Demo login credentials
    const demoCredentials = {
      email: "demo@civiccare.com",
      phone: "1234567890",
      password: "demo123"
    };
    
    // Check if using demo credentials
    const isDemoLogin = (identifier === demoCredentials.email || identifier === demoCredentials.phone) && password === demoCredentials.password;
    
    if (isDemoLogin) {
      // Demo user data
      const demoUser = {
        id: "demo-user-123",
        email: demoCredentials.email,
        phone: demoCredentials.phone,
        name: "Demo User",
        info: "This is a demo account for testing the app"
      };
      
      const demoToken = "demo-token-" + Date.now();
      
      // Save demo auth data
      await authStorage.saveAuth(demoToken, demoUser);
      
      // Go directly to main app since demo user has complete profile
      navigation.replace("MainTabs");
      return;
    }
    
    // Try backend login for other credentials
    try {
      const data = await api("/api/auth/login", "POST", { identifier, password });
      
      // Save auth data
      await authStorage.saveAuth(data.token, data.user);

      // if profile is incomplete → go to CompleteProfile
      if (!data.user.name || !data.user.phone) {
        navigation.replace("CompleteProfile", { token: data.token });
      } else {
        navigation.replace("MainTabs");
      }
    } catch (err) {
      setError("Invalid credentials. Use demo@civiccare.com / 1234567890 with password 'demo123' for demo login.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email or Phone"
        value={identifier}
        onChangeText={setIdentifier}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}

      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={{ marginTop: 10 }}>Don't have an account? Signup</Text>
      </TouchableOpacity>
      
      <View style={styles.demoSection}>
        <Text style={styles.demoTitle}>Demo Login:</Text>
        <Text style={styles.demoText}>Email: demo@civiccare.com</Text>
        <Text style={styles.demoText}>Phone: 1234567890</Text>
        <Text style={styles.demoText}>Password: demo123</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, padding: 12, marginVertical: 8, borderRadius: 8 },
  btn: { backgroundColor: "#2e7d32", padding: 14, borderRadius: 8, marginTop: 10 },
  btnText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  demoSection: { 
    marginTop: 20, 
    padding: 15, 
    backgroundColor: "#f0f0f0", 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd"
  },
  demoTitle: { 
    fontSize: 16, 
    fontWeight: "bold", 
    marginBottom: 8, 
    color: "#2e7d32" 
  },
  demoText: { 
    fontSize: 14, 
    marginBottom: 4, 
    color: "#333" 
  },
});
