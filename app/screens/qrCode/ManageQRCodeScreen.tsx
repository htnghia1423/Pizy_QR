import ListQR from "app/components/ListQR";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ManageQRCodeScreen = () => {
  return (
    <View style={styles.container}>
      <ListQR />
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

export default ManageQRCodeScreen;
