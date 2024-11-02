import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { FIREBASE_AUTH } from "../../../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { NavigationProp } from "@react-navigation/native";

const SignUpScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      Alert.alert(
        "Success",
        "Đã đăng ký tài khoản thành công",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("EmailLogin"),
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      setError((error as any).message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button mode="contained" onPress={handleSignUp} style={styles.button}>
        Sign Up
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
  input: {
    width: "100%",
    marginBottom: 10,
  },
  button: {
    width: "100%",
    paddingVertical: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});

export default SignUpScreen;
