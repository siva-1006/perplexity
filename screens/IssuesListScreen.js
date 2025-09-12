import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";

const issuesData = [
  {
    id: "1",
    title: "Large Pothole on Main Street",
    department: "Public Works",
    priority: "High",
    status: "In Progress",
    description: "A large pothole has appeared on Main Street near the post office. It poses a risk to vehicles.",
    location: "Lat: 11.0770, Lng: 77.1425",
  },
  {
    id: "2",
    title: "Overflowing Trash Can at City Park",
    department: "Sanitation Dept.",
    priority: "Medium",
    status: "Pending",
    description: "The trash can near the playground in City Park is overflowing.",
    location: "Lat: 11.0840, Lng: 77.1500",
  },
  {
    id: "3",
    title: "Streetlight Out on Oak Street",
    department: "Public Works",
    priority: "High",
    status: "Resolved",
    description: "Streetlight near Oak Street corner is not working.",
    location: "Lat: 11.0890, Lng: 77.1480",
  },
  {
    id: "4",
    title: "Graffiti on Library Wall",
    department: "Parks & Recreation",
    priority: "Low",
    status: "Pending",
    description: "Graffiti has been spotted on the back wall of the city library.",
    location: "Lat: 11.0810, Lng: 77.1440",
  },
  {
    id: "5",
    title: "Broken Swing at Playground",
    department: "Parks & Recreation",
    priority: "Medium",
    status: "In Progress",
    description: "One of the swings at the playground is broken and unsafe for children.",
    location: "Lat: 11.0830, Lng: 77.1460",
  },
];

export default function IssuesListScreen() {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => toggleExpand(item.id)}>
        <View style={styles.row}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.status}>{item.status}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.department}>{item.department}</Text>
          <Text
            style={[
              styles.priority,
              item.priority === "High"
                ? { color: "red" }
                : item.priority === "Medium"
                ? { color: "orange" }
                : { color: "green" },
            ]}
          >
            {item.priority}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Expanded Section */}
      {expandedId === item.id && (
        <View style={styles.expandedBox}>
          <Text style={styles.expandedText}>
            <Text style={styles.bold}>Description: </Text>
            {item.description}
          </Text>
          <Text style={styles.expandedText}>
            <Text style={styles.bold}>Location: </Text>
            {item.location}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>All Issue Reports</Text>
      <FlatList
        data={issuesData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  department: {
    fontSize: 14,
    color: "#555",
  },
  priority: {
    fontWeight: "bold",
  },
  status: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },
  expandedBox: {
    marginTop: 8,
    padding: 10,
    backgroundColor: "#f2f2f2",
    borderRadius: 6,
  },
  expandedText: {
    marginBottom: 5,
    fontSize: 14,
    color: "#333",
  },
  bold: {
    fontWeight: "bold",
  },
});
