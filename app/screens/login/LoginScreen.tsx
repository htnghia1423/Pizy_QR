import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";
import StartLayout from "../../layouts/StartLayout";
import { FontAwesome } from "@expo/vector-icons";
import { NavigationProp } from "@react-navigation/native";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { FIREBASE_AUTH } from "../../../firebaseConfig";

GoogleSignin.configure({
  scopes: ["email"],
  webClientId: process.env.WEB_CLIENT_ID,
  offlineAccess: true,
});

const LoginScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const SignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = (userInfo as any).idToken;
      const googleCredential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(FIREBASE_AUTH, googleCredential);
      console.log("User signed in with Google:", userInfo);
    } catch (error) {
      if ((error as any).code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("User cancelled the login flow");
      } else if ((error as any).code === statusCodes.IN_PROGRESS) {
        console.log("Sign in is in progress");
      } else if (
        (error as any).code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
      ) {
        console.log("Play services not available or outdated");
      } else {
        console.log("Something went wrong", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <StartLayout />

      <Button
        mode="outlined"
        icon={() => <FontAwesome name="google" size={20} color="#4285F4" />}
        style={styles.googleButton}
        labelStyle={styles.googleButtonText}
        onPress={SignIn}
      >
        Đăng nhập bằng Google
      </Button>

      <Button
        mode="contained"
        style={styles.createAccountButton}
        labelStyle={styles.createAccountText}
        onPress={() => navigation.navigate("EmailLogin")}
      >
        Đăng nhập bằng tài khoản
      </Button>

      <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
        <Text style={styles.signUpText}>
          Bạn chưa tạo tài khoản? <Text style={styles.signUpLink}>Đăng ký</Text>
        </Text>
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
  googleButton: {
    width: "90%",
    borderColor: "#FFB923",
    borderWidth: 1,
    marginBottom: 20,
    paddingVertical: 5,
  },
  googleButtonText: {
    color: "#616161",
    fontSize: 16,
  },
  createAccountButton: {
    width: "90%",
    backgroundColor: "#0DB07E",
    paddingVertical: 5,
    marginBottom: 20,
  },
  createAccountText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  signUpText: {
    color: "#616161",
    fontSize: 14,
    marginTop: 20,
  },
  signUpLink: {
    color: "#0DB07E",
    fontWeight: "bold",
  },
});

export default LoginScreen;
