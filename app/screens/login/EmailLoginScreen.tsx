import React, { useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  Text,
  TextInput,
  Button,
  Title,
  Paragraph,
  Provider as PaperProvider,
  DefaultTheme,
  ActivityIndicator,
} from "react-native-paper";
import { FIREBASE_AUTH } from "../../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { NavigationProp } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";
import StartLayout from "../../layouts/StartLayout";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#00BA88",
    background: "#FFFEFA",
    text: "#000000",
    placeholder: "#A0A0A0",
  },
};

const EmailLoginScreen = ({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const auth = FIREBASE_AUTH;

  const handleLogin = async () => {
    setLoading(true);
    if (!email || !password) {
      setError("Vui lòng điền đầy đủ thông tin.");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email không hợp lệ.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate("Home");
    } catch (error) {
      const errorCode = (error as any).code;
      if (
        errorCode === "auth/user-not-found" ||
        errorCode === "auth/wrong-password" ||
        errorCode === "auth/invalid-credential"
      ) {
        setError("Tài khoản hoặc mật khẩu không chính xác!");
      } else {
        setError((error as any).message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <StartLayout />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              <Button
                icon={() => (
                  <ArrowLeft size={24} color={theme.colors.primary} />
                )}
                style={styles.backButton}
                contentStyle={styles.backButtonContent}
                onPress={() => navigation.goBack()}
              >
                Quay Lại
              </Button>

              <Title style={styles.title}>Đăng nhập</Title>

              <View style={styles.form}>
                {error ? <Text style={styles.error}>{error}</Text> : null}
                <TextInput
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  mode="outlined"
                  outlineColor="#FFB923"
                  style={styles.input}
                  placeholder="Nhập tài khoản email của bạn"
                />

                <TextInput
                  label="Mật khẩu"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  mode="outlined"
                  outlineColor="#FFB923"
                  style={styles.input}
                  placeholder="Nhập mật khẩu của bạn"
                  right={
                    <TextInput.Icon
                      icon={showPassword ? "eye-off" : "eye"}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  }
                />
                <TouchableOpacity
                  onPress={() => navigation.navigate("ForgotPassword")}
                >
                  <Paragraph style={styles.signUpText}>
                    Quên mật khẩu?
                  </Paragraph>
                </TouchableOpacity>

                <Button
                  mode="contained"
                  onPress={handleLogin}
                  style={styles.signInButton}
                  labelStyle={styles.signInButtonText}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator animating={true} color="#FFFFFF" />
                  ) : (
                    "Đăng nhập"
                  )}
                </Button>

                <View style={styles.signUpContainer}>
                  <Paragraph style={styles.signUpText}>
                    Bạn chưa tạo tài khoản?
                  </Paragraph>
                  <Button
                    mode="text"
                    compact
                    style={styles.signUpButton}
                    labelStyle={styles.signUpButtonText}
                    onPress={() => navigation.navigate("SignUp")}
                  >
                    Đăng ký
                  </Button>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  backButton: {
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  backButtonContent: {
    height: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: "600",
    marginTop: 24,
    marginBottom: 32,
    color: "#0DB07E",
  },
  form: {
    width: "100%",
    gap: 20,
  },
  input: {
    backgroundColor: "#FFFEFA",
  },
  signInButton: {
    height: 60,
    width: 300,
    justifyContent: "center",
    marginTop: 30,
    borderRadius: 16,
  },
  signInButtonText: {
    fontSize: 20,
    fontWeight: "500",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  signUpText: {
    fontSize: 14,
    color: "#666666",
  },
  signUpButton: {
    padding: 0,
  },
  signUpButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});

export default EmailLoginScreen;
