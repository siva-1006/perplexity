// // screens/NotificationsScreen.js
// import React from "react";
// import { View, Text, StyleSheet, FlatList } from "react-native";

// const notifications = [
//   { id: "1234", status: "Resolved", message: "Your reported issue has been resolved successfully.", time: "2023-11-05 12:34 PM" },
//   { id: "5678", status: "In Progress", message: "We are currently working on your reported issue.", time: "2023-11-04 9:20 AM" },
//   { id: "9101", status: "Pending", message: "Your issue is pending and will be addressed soon.", time: "2023-11-03 4:50 PM" },
// ];

// export default function NotificationsScreen() {
//   return (
//     <FlatList
//       data={notifications}
//       keyExtractor={(item) => item.id}
//       renderItem={({ item }) => (
//         <View style={styles.card}>
//           <Text style={styles.title}>Issue #{item.id} - {item.status}</Text>
//           <Text>{item.message}</Text>
//           <Text style={styles.time}>{item.time}</Text>
//         </View>
//       )}
//     />
//   );
// }

// const styles = StyleSheet.create({
//   card: { backgroundColor: "#e8f5e9", padding: 15, borderRadius: 8, margin: 10 },
//   title: { fontWeight: "bold" },
//   time: { marginTop: 5, fontSize: 12, color: "gray" },
// });


// screens/NotificationsScreen.js
import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

const notifications = [
  { id: "1234", status: "Resolved", message: "Your reported issue has been resolved successfully.", time: "2023-11-05 12:34 PM" },
  { id: "5678", status: "In Progress", message: "We are currently working on your reported issue.", time: "2023-11-04 9:20 AM" },
  { id: "9101", status: "Pending", message: "Your issue is pending and will be addressed soon.", time: "2023-11-03 4:50 PM" },
];

export default function NotificationsScreen() {
  const getBgColor = (status) => {
    if (status === "Resolved") return "#d4edda";
    if (status === "In Progress") return "#d1ecf1";
    if (status === "Pending") return "#fff3cd";
    return "#f8f9fa";
  };

  return (
    <FlatList
      data={notifications}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={[styles.card, { backgroundColor: getBgColor(item.status) }]}>
          <Text style={styles.title}>Issue #{item.id} - {item.status}</Text>
          <Text>{item.message}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: { padding: 15, borderRadius: 10, margin: 10, elevation: 2 },
  title: { fontWeight: "bold", marginBottom: 4 },
  time: { marginTop: 5, fontSize: 12, color: "#555" },
});
