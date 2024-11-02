import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
import { FIREBASE_AUTH } from "../../firebaseConfig";
import { signOut } from "firebase/auth";
import { NavigationProp } from "@react-navigation/native";

const HomeScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const handleLogout = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HomeScreen</Text>
      <Button mode="contained" onPress={handleLogout} style={styles.button}>
        Logout
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFEFA",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    width: "100%",
    paddingVertical: 10,
  },
});

export default HomeScreen;
