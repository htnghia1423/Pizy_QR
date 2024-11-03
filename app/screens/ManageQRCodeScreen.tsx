import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ManageQRCodeScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Manage QR Code Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ManageQRCodeScreen;
