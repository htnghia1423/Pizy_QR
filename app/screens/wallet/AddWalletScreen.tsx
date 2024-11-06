import React from "react";
import { View, StyleSheet } from "react-native";
import WalletForm from "../../components/FormAddWallet";
import StartLayout from "app/layouts/StartLayout";

import { NavigationProp, useNavigation } from "@react-navigation/native";

const AddWalletScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <View style={styles.container}>
      <StartLayout />
      <WalletForm navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFEFA",
    justifyContent: "center",
    padding: 20,
  },
});

export default AddWalletScreen;
