import { NavigationProp } from "@react-navigation/native";
import ButtonGoback from "app/components/commons/ButtonGoback";
import ListWallet from "app/components/ListWallet";
import StartLayout from "app/layouts/StartLayout";
import React from "react";
import { View, StyleSheet } from "react-native";
import { Title, DefaultTheme, FAB } from "react-native-paper";
import { Wallet, Wallet2 } from "lucide-react-native";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#00BA88",
    secondary: "#FFB800",
    background: "#FFFEFA",
    text: "#000000",
    placeholder: "#A0A0A0",
  },
};

const ManageWalletScreen = ({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) => {
  return (
    <View style={styles.container}>
      <StartLayout />
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Wallet color={theme.colors.secondary} size={40} />
          <Title style={styles.title}>Quản lý ví</Title>
        </View>
        <ButtonGoback navigation={navigation} />
        <ListWallet />
        <FAB
          icon="plus"
          customSize={60}
          color="#e0c277"
          style={styles.addWalletButton}
          onPress={() => navigation.navigate("AddWallet")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#FFFEFA",
  },
  content: {
    flex: 1,
    marginTop: 70,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    textAlign: "center",
    fontSize: 28,
    marginLeft: 10,
  },
  addWalletButton: {
    zIndex: 1,
    position: "absolute",
    bottom: 40,
    right: 20,
    backgroundColor: "#08d094",
  },
});

export default ManageWalletScreen;
