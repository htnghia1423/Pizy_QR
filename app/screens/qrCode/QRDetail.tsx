import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  Text,
  Button,
  Card,
  Title,
  Provider as PaperProvider,
  DefaultTheme,
} from "react-native-paper";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../../firebaseConfig";
import { ref, onValue, push, update, get } from "firebase/database";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import StartLayout from "app/layouts/StartLayout";
import ButtonGoback from "app/components/commons/ButtonGoback";
import { getBankLabel } from "app/services/getBankName";
import * as Notifications from "expo-notifications";
import * as Speech from "expo-speech";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { transactionDataList } from "app/data/transactionData";

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

type RootStackParamList = {
  QRDetail: { walletId: string };
};

interface QRDetailProps {
  navigation: NavigationProp<RootStackParamList, "QRDetail">;
  route: RouteProp<RootStackParamList, "QRDetail">;
}

const QRDetail: React.FC<QRDetailProps> = ({ navigation, route }) => {
  const { walletId } = route.params;
  const [wallet, setWallet] = useState<any>(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const fetchWallet = async () => {
      const user = FIREBASE_AUTH.currentUser;
      if (!user) {
        console.log("User not logged in");
        return;
      }

      const walletRef = ref(FIREBASE_DB, `wallets/${walletId}`);
      onValue(walletRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setWallet(data);
        }
      });
    };

    fetchWallet();
  }, [walletId]);

  useEffect(() => {
    const loadListeningState = async () => {
      const savedState = await AsyncStorage.getItem("isListening");
      if (savedState !== null) {
        setIsListening(JSON.parse(savedState));
      }
    };

    loadListeningState();
  }, []);

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        if (isListening) {
          console.log(notification);
        }
      }
    );

    return () => subscription.remove();
  }, [isListening]);

  const handleTransaction = async () => {
    const transactionData = transactionDataList[0];

    const transactionRef = ref(FIREBASE_DB, "transactions");
    await push(transactionRef, transactionData);

    const walletRef = ref(FIREBASE_DB, `wallets/${transactionData.walletId}`);
    const snapshot = await get(walletRef);
    const walletData = snapshot.val();
    if (walletData) {
      const newBalance = walletData.balance + transactionData.amount;
      await update(walletRef, { balance: newBalance });
    }
  };

  const handleTransactionSync = () => {
    handleTransaction().catch((error) => {
      console.error("Transaction failed: ", error);
    });
  };

  const toggleListening = async () => {
    const newListeningState = !isListening;
    setIsListening(newListeningState);
    await AsyncStorage.setItem(
      "isListening",
      JSON.stringify(newListeningState)
    );
    if (newListeningState) {
      setTimeout(() => {
        Speech.speak("Đã nhận được tiền", {
          onDone: handleTransactionSync,
        });
      }, 30000);
    }
  };

  if (!wallet) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <StartLayout />
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <ButtonGoback navigation={navigation} />
          <Title style={styles.title}>Chi tiết QR</Title>
          <Card style={styles.card}>
            <Card.Content>
              {wallet.qrCodeUrl ? (
                <Image
                  source={{ uri: wallet.qrCodeUrl }}
                  style={styles.qrCode}
                  resizeMode="contain"
                />
              ) : (
                <Text>Không có mã QR</Text>
              )}
              <Title style={styles.title}>{wallet.walletName}</Title>
              <Text>
                <Text style={styles.label}>Ngân hàng: </Text>
                {getBankLabel(wallet.bankName)}
              </Text>
              <Text>
                <Text style={styles.label}>Số tài khoản: </Text>
                {wallet.accountNumber}
              </Text>

              <Text>
                <Text style={styles.label}>Trạng thái: </Text>
                <Text
                  style={[
                    styles.status,
                    wallet.status ? styles.activeStatus : styles.inactiveStatus,
                  ]}
                >
                  {wallet.status ? "Hoạt động" : "Bị Khoá"}
                </Text>
              </Text>
            </Card.Content>
          </Card>
          <Button
            mode="contained"
            onPress={toggleListening}
            style={[styles.button, isListening && styles.buttonActive]}
          >
            {isListening
              ? "Tắt chế độ thông báo"
              : "Bắt đầu chế độ thông báo chuyển khoản"}
          </Button>
        </ScrollView>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFEFA",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: theme.colors.primary,
  },
  label: {
    fontWeight: "bold",
  },
  status: {
    fontWeight: "bold",
  },
  activeStatus: {
    color: "#0DB07E",
  },
  inactiveStatus: {
    color: "red",
  },
  qrCode: {
    width: 500,
    height: 300,
    marginTop: 20,
    position: "relative",
    top: 0,
    right: 105,
  },
  button: {
    marginTop: 20,
    borderRadius: 16,
  },
  buttonActive: {
    backgroundColor: "red",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default QRDetail;
