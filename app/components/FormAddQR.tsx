import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
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
import {
  FIREBASE_DB,
  FIREBASE_AUTH,
  FIREBASE_STORAGE,
} from "../../firebaseConfig";
import { ref, update, onValue } from "firebase/database";
import {
  getDownloadURL,
  uploadBytes,
  ref as storageRef,
} from "firebase/storage";
import { NavigationProp } from "@react-navigation/native";
import bankOptions from "app/constants/bankOptions";
import ButtonGoback from "./commons/ButtonGoback";
import QRCode from "react-native-qrcode-svg";
import ViewShot from "react-native-view-shot";
import { Wallet } from "app/models/Wallet";
import * as ImagePicker from "expo-image-picker"; // Sử dụng expo-image-picker
import { FoldHorizontal } from "lucide-react-native";

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

const FormAddQR = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [walletName, setWalletName] = useState("");
  const [walletId, setWalletId] = useState("");
  const [qrCodeValue, setQrCodeValue] = useState("");
  const [qrCodeUri, setQrCodeUri] = useState(""); // Thêm state để lưu URI của ảnh QR
  const [loading, setLoading] = useState(false);
  const [isFocus, setIsFocus] = useState(false);

  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [errors, setErrors] = useState({
    bankName: "",
    accountNumber: "",
    walletName: "",
    walletId: "",
    qrCodeValue: "", // Thêm lỗi cho qrCodeValue
  });
  const viewShotRef = useRef<ViewShot>(null);

  useEffect(() => {
    const fetchWallets = async () => {
      const user = FIREBASE_AUTH.currentUser;
      if (!user) {
        console.log("User not logged in");
        return;
      }

      const walletRef = ref(FIREBASE_DB, `wallets`);
      onValue(walletRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const userWallets = Object.keys(data)
            .map((key) => ({ id: key, ...data[key] }))
            .filter((wallet) => wallet.uid === user.uid);
          setWallets(userWallets);
        }
      });
    };

    fetchWallets();
  }, []);

  const getBankLabel = (value: string) => {
    const bank = bankOptions.find((option) => option.value === value);
    return bank ? bank.label : value;
  };

  const handleSelectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setQrCodeUri(result.assets[0].uri);
      setErrors((prevErrors) => ({
        ...prevErrors,
        qrCodeValue: "", // Xóa lỗi qrCodeValue khi chọn ảnh QR
      }));
    }
  };

  const handleSaveQR = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (!user) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        bankName: "Người dùng chưa đăng nhập",
      }));
      return;
    }

    if (!walletId) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        walletId: "Vui lòng chọn ví",
      }));
      return;
    }

    if (!qrCodeUri) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        qrCodeValue: "Vui lòng chọn ảnh QR",
      }));
      return;
    }

    setLoading(true);

    try {
      if (viewShotRef.current && viewShotRef.current.capture) {
        const uri = await viewShotRef.current.capture();
        const response = await fetch(uri);
        const blob = await response.blob();
        const qrCodeRef = storageRef(
          FIREBASE_STORAGE,
          `qrcodes/${walletName}.png`
        );
        await uploadBytes(qrCodeRef, blob);
        const qrCodeUrl = await getDownloadURL(qrCodeRef);

        const walletData = {
          qrCodeUrl,
          updatedAt: new Date().toISOString(),
        };

        const walletRef = ref(FIREBASE_DB, `wallets/${walletId}`);
        await update(walletRef, walletData);
        setBankName("");
        setAccountNumber("");
        setWalletName("");
        setQrCodeUri("");
        Alert.alert("Thành công", "Mã QR đã được tạo và lưu", [
          {
            text: "OK",
            onPress: () => navigation.navigate("Home"),
          },
        ]);
        navigation.navigate("Home");
      } else {
        throw new Error(
          "viewShotRef.current or viewShotRef.current.capture is null or undefined"
        );
      }
    } catch (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        bankName: "Tạo mã QR thất bại",
      }));
      console.error("Error saving QR code: ", error);
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
              <Title style={styles.title}>Tạo mã QR</Title>

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
                  data={wallets.map((wallet) => ({
                    label: wallet.walletName,
                    value: wallet.id,
                  }))}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus ? "Chọn ví" : "..."}
                  searchPlaceholder="Tìm kiếm..."
                  value={walletId}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={(item) => {
                    const selectedWallet = wallets.find(
                      (wallet) => wallet.id === item.value
                    );
                    if (selectedWallet) {
                      setWalletId(selectedWallet.id);
                      setWalletName(selectedWallet.walletName);
                      setAccountNumber(selectedWallet.accountNumber);
                      setBankName(selectedWallet.bankName);
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        walletId: "",
                      }));
                    }
                    setIsFocus(false);
                  }}
                  renderLeftIcon={() => (
                    <AntDesign style={styles.icon} name="wallet" size={20} />
                  )}
                />
                {errors.walletId ? (
                  <Text style={styles.errorText}>{errors.walletId}</Text>
                ) : null}
                {walletId && (
                  <>
                    <TextInput
                      label="Số tài khoản"
                      value={accountNumber}
                      onChangeText={setAccountNumber}
                      keyboardType="numeric"
                      mode="outlined"
                      outlineColor="#FFB923"
                      style={styles.input}
                      placeholder="Nhập số tài khoản"
                      editable={false}
                    />
                    <TextInput
                      label="Tên Ví"
                      value={walletName}
                      onChangeText={setWalletName}
                      mode="outlined"
                      outlineColor="#FFB923"
                      style={styles.input}
                      placeholder="Nhập tên ví"
                      editable={false}
                    />
                    <TextInput
                      label="Ngân hàng"
                      value={getBankLabel(bankName)}
                      onChangeText={setBankName}
                      mode="outlined"
                      outlineColor="#FFB923"
                      style={styles.input}
                      placeholder="Chọn ngân hàng"
                      editable={false}
                    />
                    <Button
                      mode="contained"
                      onPress={handleSelectImage}
                      style={styles.button}
                    >
                      Chọn ảnh QR
                    </Button>
                  </>
                )}
                {errors.qrCodeValue ? (
                  <Text style={styles.errorText}>{errors.qrCodeValue}</Text>
                ) : null}
                {qrCodeUri ? (
                  <ViewShot
                    ref={viewShotRef}
                    options={{ format: "png", quality: 0.9 }}
                    style={{ alignItems: "center" }}
                  >
                    <Image source={{ uri: qrCodeUri }} style={styles.qrCode} />
                  </ViewShot>
                ) : null}
                <Button
                  mode="contained"
                  onPress={handleSaveQR}
                  loading={loading}
                  disabled={loading}
                  style={styles.button}
                  labelStyle={styles.buttonText}
                >
                  {loading ? (
                    <ActivityIndicator animating={true} color="#FFFEFA" />
                  ) : (
                    "Lưu mã QR"
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
  qrCode: {
    width: 200,
    height: 200,
  },
});

export default FormAddQR;
