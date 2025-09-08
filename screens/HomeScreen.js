// screens/HomeScreen.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, SafeAreaView } from "react-native";

function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* App Name */}
        <Text style={styles.appName}>CivicCare</Text>

        {/* Banner */}
        <Image source={require("../assets/banner.webp")} style={styles.banner} />

        {/* Welcome Text */}
        <Text style={styles.title}>Welcome to CivicCare</Text>
        <Text style={styles.subtitle}>Report issues, track progress, improve your city 🌍</Text>

        {/* Feature Cards */}
        <View style={styles.cards}>
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("ReportIssue")}>
            <Image source={require("../assets/report.webp")} style={styles.cardImage} />
            <Text style={styles.cardText}>Report an Issue</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Reports")}>
            <Image source={require("../assets/status.webp")} style={styles.cardImage} />
            <Text style={styles.cardText}>My Reports</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Map")}>
            <Image source={require("../assets/map.webp")} style={styles.cardImage} />
            <Text style={styles.cardText}>Map View</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: { paddingBottom: 20 },
  appName: { 
    fontSize: 30, 
    fontWeight: "bold", 
    textAlign: "center", 
    marginTop: 20, 
    marginBottom: 10, 
    color: "#2e7d32" 
  },
  banner: { width: "100%", height: 180, resizeMode: "cover", borderRadius: 12},
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginTop: 15, color: "#2e7d32" },
  subtitle: { fontSize: 14, textAlign: "center", marginBottom: 20, color: "#555" },
  cards: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around" },
  card: { width: "40%", backgroundColor: "#fff", borderRadius: 12, elevation: 3, margin: 10, alignItems: "center", padding: 10 },
  cardImage: { width: 80, height: 80, marginBottom: 10 },
  cardText: { fontSize: 14, fontWeight: "600", color: "#2e7d32" },
});
