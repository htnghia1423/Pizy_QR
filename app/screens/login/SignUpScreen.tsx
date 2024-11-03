import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import {
  Text,
  TextInput,
  Button,
  Title,
  Paragraph,
  useTheme,
  Provider as PaperProvider,
  DefaultTheme,
  ActivityIndicator,
} from "react-native-paper";
import { FIREBASE_AUTH } from "../../../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
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

const SignUpScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    if (!email || !password || !confirmPassword) {
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

    if (password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp.");
      setLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      Alert.alert(
        "Success",
        "Đã đăng ký tài khoản thành công",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Home"),
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      setError((error as any).message);
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

              <Title style={styles.title}>Đăng ký</Title>

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
                  label="Mật Khẩu"
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

                <TextInput
                  label="Nhập Lại Mật Khẩu"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  mode="outlined"
                  outlineColor="#FFB923"
                  style={styles.input}
                  placeholder="Nhập lại mật khẩu của bạn"
                  right={
                    <TextInput.Icon
                      icon={showConfirmPassword ? "eye-off" : "eye"}
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    />
                  }
                />

                <Button
                  mode="contained"
                  onPress={handleSignUp}
                  style={styles.signUpButton}
                  labelStyle={styles.signUpButtonText}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator animating={true} color="#FFFEFA" />
                  ) : (
                    "Đăng ký"
                  )}
                </Button>

                <View style={styles.signInContainer}>
                  <Paragraph style={styles.signInText}>
                    Bạn đã có sẵn tài khoản?
                  </Paragraph>
                  <Button
                    mode="text"
                    compact
                    style={styles.signInButton}
                    labelStyle={styles.signInButtonText}
                    onPress={() => navigation.navigate("EmailLogin")}
                  >
                    Đăng Nhập
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
  signUpButton: {
    height: 60,
    width: 300,
    justifyContent: "center",
    marginTop: 30,
    borderRadius: 16,
  },
  signUpButtonText: {
    fontSize: 20,
    fontWeight: "500",
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  signInText: {
    fontSize: 14,
    color: "#666666",
  },
  signInButton: {
    padding: 0,
  },
  signInButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});

export default SignUpScreen;
