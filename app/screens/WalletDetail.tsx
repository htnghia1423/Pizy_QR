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

interface WalletDetailProps {
  navigation: NavigationProp<any>;
  route: RouteProp<{ params: { walletId: string } }, "params">;
}

const WalletDetail = ({ navigation, route }: WalletDetailProps) => {
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
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.title}>{wallet.walletName}</Title>
              <Paragraph>Ngân hàng: {wallet.bankName}</Paragraph>
              <Paragraph>Số tài khoản: {wallet.accountNumber}</Paragraph>
              <Paragraph>
                Số dư: {wallet.balance.toLocaleString()} VNĐ
              </Paragraph>
              <Paragraph>
                Trạng thái: {wallet.status ? "Hoạt động" : "Bị Khoá"}
              </Paragraph>
            </Card.Content>
          </Card>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate("EditWallet", { walletId })}
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
