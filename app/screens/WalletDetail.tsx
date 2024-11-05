import React, { useState, useEffect } from "react";
import { View, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import {
  Text,
  Button,
  Card,
  Title,
  Paragraph,
  Provider as PaperProvider,
  DefaultTheme,
} from "react-native-paper";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../firebaseConfig";
import { ref, onValue } from "firebase/database";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import StartLayout from "app/layouts/StartLayout";
import ButtonGoback from "app/components/commons/ButtonGoback";
import bankOptions from "app/constants/bankOptions";
import { formatCurrency } from "app/utils/formatCurrency";
import { getBankLabel } from "app/services/getBankName";

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
  WalletDetail: { walletId: string };
};

interface WalletDetailProps {
  navigation: NavigationProp<RootStackParamList, "WalletDetail">;
  route: RouteProp<RootStackParamList, "WalletDetail">;
}

const WalletDetail: React.FC<WalletDetailProps> = ({ navigation, route }) => {
  const { walletId } = route.params;
  const [wallet, setWallet] = useState<any>(null);

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
          <Title style={styles.title}>Chi tiết ví</Title>
          <Card style={styles.card}>
            <Card.Content>
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
                <Text style={styles.label}>Số dư: </Text>
                {formatCurrency(wallet.balance.toString())} VNĐ
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
        </ScrollView>
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            // onPress={() => navigation.navigate("EditWallet", { walletId })}
            style={styles.button}
          >
            Chỉnh sửa
          </Button>
          <Button
            mode="contained"
            onPress={() => console.log("Khoá thẻ")}
            style={[styles.button, styles.lockButton]}
          >
            Khoá thẻ
          </Button>
        </View>
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    borderRadius: 16,
  },
  lockButton: {
    backgroundColor: "red",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default WalletDetail;
