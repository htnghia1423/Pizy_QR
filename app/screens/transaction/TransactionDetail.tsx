import React, { useState, useEffect } from "react";
import { View, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import {
  Text,
  Button,
  Card,
  Title,
  Provider as PaperProvider,
  DefaultTheme,
} from "react-native-paper";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../../firebaseConfig";
import { ref, onValue } from "firebase/database";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import StartLayout from "app/layouts/StartLayout";
import ButtonGoback from "app/components/commons/ButtonGoback";
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

type RootStackParamList = {
  TransactionDetail: { transactionId: string };
};

interface TransactionDetailProps {
  navigation: NavigationProp<RootStackParamList, "TransactionDetail">;
  route: RouteProp<RootStackParamList, "TransactionDetail">;
}

const TransactionDetail: React.FC<TransactionDetailProps> = ({
  navigation,
  route,
}) => {
  const { transactionId } = route.params;
  const [transaction, setTransaction] = useState<any>(null);
  const [walletName, setWalletName] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      const user = FIREBASE_AUTH.currentUser;
      if (!user) {
        console.log("User not logged in");
        return;
      }

      const transactionRef = ref(FIREBASE_DB, `transactions/${transactionId}`);
      onValue(transactionRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setTransaction(data);
          fetchWalletName(data.walletId);
        }
      });
    };

    const fetchWalletName = async (walletId: string) => {
      const walletRef = ref(FIREBASE_DB, `wallets/${walletId}`);
      onValue(walletRef, (snapshot) => {
        const walletData = snapshot.val();
        if (walletData) {
          setWalletName(walletData.walletName);
        }
      });
    };

    fetchTransaction();
  }, [transactionId]);

  if (!transaction) {
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
          <Title style={styles.title}>Chi tiết giao dịch</Title>
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.title}>{transaction.senderName}</Title>
              <Text>
                <Text style={styles.label}>Số tiền: </Text>
                {formatCurrency(transaction.amount.toString())} VNĐ
              </Text>
              <Text>
                <Text style={styles.label}>Ngày chuyển: </Text>
                {new Date(transaction.timestamp).toLocaleString()}
              </Text>
              <Text>
                <Text style={styles.label}>Số tài khoản: </Text>
                {transaction.bankNumber}
              </Text>
              {walletName && (
                <Text>
                  <Text style={styles.label}>Tên ví: </Text>
                  {walletName}
                </Text>
              )}
            </Card.Content>
          </Card>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TransactionDetail;
