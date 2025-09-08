// // screens/MyReportsScreen.js
// import React from "react";
// import { View, Text, FlatList, StyleSheet, Image } from "react-native";

// const reports = [
//   { id: "1", category: "Road Maintenance", location: "123 Main St", status: "Pending", image: "https://via.placeholder.com/100" },
//   { id: "2", category: "Vandalism", location: "456 Elm St", status: "In Progress", image: "https://via.placeholder.com/100" },
//   { id: "3", category: "Public Lighting", location: "789 Pine St", status: "Resolved", image: "https://via.placeholder.com/100" },
// ];

// export default function MyReportsScreen() {
//   return (
//     <FlatList
//       data={reports}
//       keyExtractor={(item) => item.id}
//       renderItem={({ item }) => (
//         <View style={styles.card}>
//           <Image source={{ uri: item.image }} style={styles.image} />
//           <Text>Category: {item.category}</Text>
//           <Text>Location: {item.location}</Text>
//           <Text>Status: {item.status}</Text>
//         </View>
//       )}
//     />
//   );
// }

// const styles = StyleSheet.create({
//   card: { padding: 15, borderWidth: 1, borderRadius: 8, margin: 10 },
//   image: { width: "100%", height: 150, borderRadius: 8, marginBottom: 10 },
// });

// screens/MyReportsScreen.js
import React from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";

const reports = [
  {
    id: "1",
    category: "Road Maintenance",
    location: "123 Main St",
    status: "Pending",
    image: require("../assets/image.png"),
  },
  {
    id: "2",
    category: "Vandalism",
    location: "456 Elm St",
    status: "In Progress",
    image: require("../assets/cc1.webp"),
  },
  {
    id: "3",
    category: "Public Lighting",
    location: "789 Pine St",
    status: "Resolved",
    image: require("../assets/pc.webp"),
  },
];


export default function MyReportsScreen() {
  const getStatusColor = (status) => {
    if (status === "Pending") return "#f39c12";
    if (status === "In Progress") return "#2980b9";
    if (status === "Resolved") return "#27ae60";
    return "#7f8c8d";
  };

  return (
    <FlatList
      data={reports}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image source={item.image} style={styles.image} />
          <View style={styles.info}>
            <Text style={styles.category}>{item.category}</Text>
            <Text style={styles.location}>{item.location}</Text>
            <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
              {item.status}
            </Text>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#fff", borderRadius: 12, margin: 10, overflow: "hidden", elevation: 3 },
  image: { width: "100%", height: 150 },
  info: { padding: 12 },
  category: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  location: { fontSize: 14, color: "#555" },
  status: { marginTop: 6, fontWeight: "bold" },
});
