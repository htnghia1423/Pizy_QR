import React, { useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import {
  TextInput,
  Button,
  Title,
  Provider as PaperProvider,
  DefaultTheme,
  ActivityIndicator,
  Text,
} from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../firebaseConfig";
import { ref, push } from "firebase/database";
import { NavigationProp } from "@react-navigation/native";
import bankOptions from "app/constants/bankOptions";
import { ArrowLeft } from "lucide-react-native";
import ButtonGoback from "./commons/ButtonGoback";
import { formatCurrency } from "app/utils/formatCurrency";

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

const WalletForm = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [walletName, setWalletName] = useState("");
  const [balance, setBalance] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [errors, setErrors] = useState({
    bankName: "",
    accountNumber: "",
    walletName: "",
    balance: "",
  });

  const handleAddWallet = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (!user) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        bankName: "Người dùng chưa đăng nhập",
      }));
      return;
    }

    let valid = true;
    const newErrors = {
      bankName: "",
      accountNumber: "",
      walletName: "",
      balance: "",
    };

    if (!bankName) {
      newErrors.bankName = "Vui lòng chọn ngân hàng";
      valid = false;
    }

    if (!accountNumber) {
      newErrors.accountNumber = "Vui lòng nhập số tài khoản";
      valid = false;
    } else if (accountNumber.length < 9 || accountNumber.length > 14) {
      newErrors.accountNumber =
        "Số tài khoản phải có độ dài từ 9 đến 14 chữ số";
      valid = false;
    }

    if (!walletName) {
      newErrors.walletName = "Vui lòng nhập tên ví";
      valid = false;
    }

    if (!balance) {
      newErrors.balance = "Vui lòng nhập số dư";
      valid = false;
    } else if (isNaN(Number(balance.replace(/,/g, "")))) {
      newErrors.balance = "Số dư phải là một số";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) {
      return;
    }

    setLoading(true);

    const walletData = {
      uid: user.uid,
      bankName,
      accountNumber,
      walletName,
      balance: Number(balance.replace(/,/g, "")),
      qrCodeUrl: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: true,
    };

    try {
      const walletRef = ref(FIREBASE_DB, "wallets");
      await push(walletRef, walletData);
      setBankName("");
      setAccountNumber("");
      setWalletName("");
      setBalance("");
      Alert.alert("Thành công", "Ví đã được tạo", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Home"),
        },
      ]);
    } catch (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        bankName: "Tạo ví thất bại",
      }));
      console.error("Error adding wallet: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              <ButtonGoback navigation={navigation} />
              <Title style={styles.title}>Thêm Ví</Title>

              <View style={styles.form}>
                <Dropdown
                  style={[
                    styles.dropdown,
                    isFocus && { borderColor: "#FFB923" },
                  ]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={bankOptions}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus ? "Chọn ngân hàng" : "..."}
                  searchPlaceholder="Tìm kiếm..."
                  value={bankName}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={(item) => {
                    setBankName(item.value);
                    setIsFocus(false);
                  }}
                  renderLeftIcon={() => (
                    <AntDesign style={styles.icon} name="bank" size={20} />
                  )}
                />
                {errors.bankName ? (
                  <Text style={styles.errorText}>{errors.bankName}</Text>
                ) : null}
                <TextInput
                  label="Số tài khoản"
                  value={accountNumber}
                  onChangeText={setAccountNumber}
                  keyboardType="numeric"
                  mode="outlined"
                  outlineColor="#FFB923"
                  style={styles.input}
                  placeholder="Nhập số tài khoản"
                />
                {errors.accountNumber ? (
                  <Text style={styles.errorText}>{errors.accountNumber}</Text>
                ) : null}
                <TextInput
                  label="Tên Ví"
                  value={walletName}
                  onChangeText={setWalletName}
                  mode="outlined"
                  outlineColor="#FFB923"
                  style={styles.input}
                  placeholder="Nhập tên ví"
                />
                {errors.walletName ? (
                  <Text style={styles.errorText}>{errors.walletName}</Text>
                ) : null}
                <TextInput
                  label="Số dư"
                  value={balance}
                  onChangeText={(text) => setBalance(formatCurrency(text))}
                  keyboardType="numeric"
                  mode="outlined"
                  outlineColor="#FFB923"
                  style={styles.input}
                  placeholder="Nhập số dư"
                  right={<TextInput.Icon icon={() => <Text>VNĐ</Text>} />}
                />
                {errors.balance ? (
                  <Text style={styles.errorText}>{errors.balance}</Text>
                ) : null}
                <Button
                  mode="contained"
                  onPress={handleAddWallet}
                  loading={loading}
                  disabled={loading}
                  style={styles.button}
                  labelStyle={styles.buttonText}
                >
                  {loading ? (
                    <ActivityIndicator animating={true} color="#FFFEFA" />
                  ) : (
                    "Thêm Ví"
                  )}
                </Button>
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
    justifyContent: "center",
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
  dropdown: {
    height: 50,
    borderColor: "#FFB923",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
    color: "#00BA88",
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  input: {
    backgroundColor: "#FFFEFA",
  },
  button: {
    height: 60,
    width: "100%",
    justifyContent: "center",
    marginTop: 30,
    borderRadius: 16,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "500",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: -10,
    marginBottom: 10,
  },
});

export default WalletForm;
