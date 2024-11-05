import { StyleSheet, Text } from "react-native";
import React from "react";
import { Button, DefaultTheme } from "react-native-paper";
import { ArrowLeft } from "lucide-react-native";
import { NavigationProp } from "@react-navigation/native";

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

const ButtonGoback = ({ navigation }: { navigation: NavigationProp<any> }) => {
  return (
    <Button
      icon={() => <ArrowLeft size={24} color={theme.colors.primary} />}
      style={styles.backButton}
      contentStyle={styles.backButtonContent}
      onPress={() => navigation.goBack()}
    >
      <Text style={{ color: theme.colors.primary }}>Quay Lại</Text>
    </Button>
  );
};

const styles = StyleSheet.create({
  backButton: {
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  backButtonContent: {
    height: 40,
  },
});

export default ButtonGoback;
