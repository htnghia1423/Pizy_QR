import ListTransaction from "app/components/ListTransaction";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { List } from "react-native-paper";

const TransactionLogScreen = () => {
  return (
    <View style={styles.container}>
      <ListTransaction />
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

export default TransactionLogScreen;
