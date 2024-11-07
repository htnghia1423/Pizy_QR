import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../firebaseConfig";
import { ref, onValue } from "firebase/database";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Transaction } from "app/models/Transaction";
import { formatCurrency } from "app/utils/formatCurrency";

const ListTransaction = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const navigation = useNavigation<NavigationProp<any>>();

  useEffect(() => {
    const fetchTransactions = async () => {
      const user = FIREBASE_AUTH.currentUser;
      if (!user) {
        console.log("User not logged in");
        return;
      }

      const transactionRef = ref(FIREBASE_DB, `transactions`);
      onValue(transactionRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const userTransactions = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setTransactions(userTransactions);
        }
      });
    };

    fetchTransactions();
  }, []);

  const renderItem = ({ item }: { item: Transaction }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("TransactionDetail", { transactionId: item.id })
      }
    >
      <View style={styles.item}>
        <Text style={styles.title}>{item.senderName}</Text>
        <Text>
          <Text style={styles.label}>Số tiền: </Text>
          {formatCurrency(item.amount.toString())} VNĐ
        </Text>
        <Text>
          <Text style={styles.label}>Ngày chuyển: </Text>
          {new Date(item.timestamp).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>Không có giao dịch nào</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    width: "100%",
  },
  item: {
    backgroundColor: "#bde9db",
    padding: 20,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  label: {
    fontWeight: "bold",
  },
});

export default ListTransaction;
