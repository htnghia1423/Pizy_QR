import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../firebaseConfig";
import { ref, onValue } from "firebase/database";
import { Wallet } from "app/models/Wallet";
import { formatCurrency } from "app/utils/formatCurrency";

const ListWallet = () => {
  const [wallets, setWallets] = useState<Wallet[]>([]);

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

  const renderItem = ({ item }: { item: Wallet }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.walletName}</Text>
      <Text>Ngân hàng: {item.bankName}</Text>
      <Text>Số tài khoản: {item.accountNumber}</Text>
      <Text>Số dư: {formatCurrency(item.balance.toString())} VNĐ</Text>
      <Text>
        Trạng thái:{" "}
        <Text
          style={[
            styles.status,
            item.status ? styles.activeStatus : styles.inactiveStatus,
          ]}
        >
          {item.status ? "Hoạt động" : "Bị Khoá"}
        </Text>
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={wallets}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>Không có ví nào</Text>}
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
  status: {
    fontWeight: "bold",
  },
  activeStatus: {
    color: "#0DB07E",
  },
  inactiveStatus: {
    color: "red",
  },
});

export default ListWallet;
