import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ManageWalletScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Manage Wallet Screen</Text>
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

export default ManageWalletScreen;
