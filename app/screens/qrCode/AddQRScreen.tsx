import { View, StyleSheet } from "react-native";
import React from "react";
import FormAddQR from "app/components/FormAddQR";
import { NavigationProp } from "@react-navigation/native";
import StartLayout from "app/layouts/StartLayout";

const AddQRScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  return (
    <View style={styles.container}>
      <StartLayout />
      <FormAddQR navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#FFFEFA",
    padding: 20,
  },
});

export default AddQRScreen;
