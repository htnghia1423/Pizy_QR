import { View, Text, StyleSheet } from "react-native";
import React from "react";

const ListTransaction = () => {
  return (
    <View style={styles.container}>
      <Text>ListTransaction</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFEFA",
  },
});

export default ListTransaction;