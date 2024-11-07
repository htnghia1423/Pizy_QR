import { NavigationProp } from "@react-navigation/native";
import ButtonGoback from "app/components/commons/ButtonGoback";
import ListTransaction from "app/components/ListTransaction";
import StartLayout from "app/layouts/StartLayout";
import React from "react";
import { View, StyleSheet } from "react-native";
import { Title, DefaultTheme } from "react-native-paper";
import { DollarSign } from "lucide-react-native";

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

const TransactionLogScreen = ({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) => {
  return (
    <View style={styles.container}>
      <StartLayout />
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <DollarSign color={theme.colors.secondary} size={40} />
          <Title style={styles.title}>Lịch sử giao dịch</Title>
        </View>
        <ButtonGoback navigation={navigation} />
        <ListTransaction />
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
  addTransactionButton: {
    zIndex: 1,
    position: "absolute",
    bottom: 40,
    right: 20,
    backgroundColor: "#08d094",
  },
});

export default TransactionLogScreen;
