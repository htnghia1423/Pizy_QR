import * as React from "react";
import { Provider as PaperProvider, Button, Text } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import StartScreen from "./app/screens/StartScreen";

export default function App() {
  return (
    <PaperProvider>
      <StartScreen />
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFEFA",
    alignItems: "center",
    justifyContent: "center",
  },
});
