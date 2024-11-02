import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import StartLayout from "../layouts/StartLayout";

import { NavigationProp } from "@react-navigation/native";

const StartScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  return (
    <View style={styles.container}>
      <StartLayout />
      <Image
        source={require("../../assets/logo_Pizy.png")}
        style={styles.logo}
      />
      <View style={styles.illustrationContainer}>
        <Image
          source={require("../../assets/start_image.png")}
          style={styles.phoneImage}
        />
      </View>
      <TouchableOpacity
        style={styles.getStartedButton}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.getStartedText}>Bắt Đầu</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFEFA",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 178,
    height: 83,
    resizeMode: "contain",
  },
  illustrationContainer: {
    alignItems: "center",
    marginVertical: 65,
  },
  phoneImage: {
    width: 340,
    height: 300,
    resizeMode: "contain",
  },
  getStartedButton: {
    backgroundColor: "#0DB07E",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 85,
    borderRadius: 16,
    position: "absolute",
    bottom: 160,
  },
  getStartedText: {
    color: "#FFFEFA",
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default StartScreen;
