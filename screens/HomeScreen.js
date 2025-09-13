// screens/HomeScreen.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, SafeAreaView, Alert } from "react-native";

function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* App Name */}
        <View style={styles.logo}>

        <Image source={require("../assets/logo.png")} style={styles.cardImage} />
        <Text style={styles.appName}>CivicZen</Text>
        </View>

        {/* Banner */}
        {/* <Image source={require("../assets/banner.webp")} style={styles.banner} /> */}

        {/* Welcome Text */}
        {/* <Text style={styles.title}>Welcome to CivicCare</Text> */}
        {/* <Text style={styles.subtitle}>Report issues, track progress, improve your city 🌍</Text> */}

        {/* Feature Cards */}
        <View style={styles.cards}>
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("ReportIssue")}>
            <Image source={require("../assets/report.webp")} style={styles.cardImage} />
            <Text style={styles.cardText}>Report an Issue</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Reports")}>
            <Image source={require("../assets/mysummit.webp")} style={styles.cardImage} />
            <Text style={styles.cardText}>My submited issue</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("IssuesListScreen")}>
            <Image source={require("../assets/status.webp")} style={styles.cardImage} />
            <Text style={styles.cardText}>All submited issue</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => Alert.alert("Coming Soon", "Community Leaderboard feature coming soon!")}>
            <Image source={require("../assets/comm.webp")} style={styles.cardImage} />
            <Text style={styles.cardText}>Community Leaderboard</Text>
          </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => Alert.alert("Coming Soon", "Settings feature coming soon!")}>
            <Image source={require("../assets/settings.webp")} style={styles.cardImage} />
            <Text style={styles.cardText}>Settings</Text>
          </TouchableOpacity>

{/* 
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Map")}>
            <Image source={require("../assets/map.webp")} style={styles.cardImage} />
            <Text style={styles.cardText}>Map View</Text>
          </TouchableOpacity> */}
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
    marginTop: 0, 
    marginBottom: 10, 
    color: "#2680D9",
  },
  logo:{marginTop:100,display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"center"},
  banner: { width: "100%", height: 180, resizeMode: "cover", borderRadius: 12},
  title: { fontSize: 25, fontWeight: "bold", textAlign: "center", marginTop: 15, color: "#2680D9" },
  subtitle: { fontSize: 14, textAlign: "center", marginBottom: 20, color: "#555" },
  cards: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around" },
  card: { width: "40%", backgroundColor: "#fff", borderRadius: 12, elevation: 3, margin: 10, alignItems: "center", padding: 10 },
  cardImage: { width: 80, height: 80, marginBottom: 10 },
  cardText: { fontSize: 14, fontWeight: "600", color: "#000000ff" },
});
