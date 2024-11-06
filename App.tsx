import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import StartScreen from "./app/screens/home/StartScreen";
import LoginScreen from "./app/screens/login/LoginScreen";
import EmailLoginScreen from "./app/screens/login/EmailLoginScreen";
import SignUpScreen from "./app/screens/login/SignUpScreen";
import HomeScreen from "./app/screens/home/HomeScreen";
import TransactionLogScreen from "./app/screens/TransactionLogScreen";
import ManageWalletScreen from "./app/screens/wallet/ManageWalletScreen";
import ManageQRCodeScreen from "./app/screens/qrCode/ManageQRCodeScreen";
import { onAuthStateChanged, User } from "firebase/auth";
import { FIREBASE_AUTH } from "./firebaseConfig";
import { useEffect } from "react";
import AddWalletScreen from "app/screens/wallet/AddWalletScreen";
import WalletDetail from "app/screens/wallet/WalletDetail";
import AddQRScreen from "app/screens/qrCode/AddQRScreen";
import QRDetail from "app/screens/qrCode/QRDetail";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createStackNavigator();
const InSideStack = createStackNavigator();

type RootStackParamList = {
  Home: undefined;
  TransactionLog: undefined;
  ManageWallet: undefined;
  ManageQRCode: undefined;
  AddWallet: undefined;
  WalletDetail: { walletId: string };
  QRDetail: { walletId: string }; // Thêm QRDetail vào RootStackParamList
};

function InsideLayout() {
  return (
    <InSideStack.Navigator>
      <InSideStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <InSideStack.Screen
        name="TransactionLog"
        component={TransactionLogScreen}
        options={{ headerShown: false }}
      />
      <InSideStack.Screen
        name="ManageWallet"
        component={ManageWalletScreen}
        options={{ headerShown: false }}
      />
      <InSideStack.Screen
        name="ManageQRCode"
        component={ManageQRCodeScreen}
        options={{ headerShown: false }}
      />
      <InSideStack.Screen
        name="AddWallet"
        component={AddWalletScreen}
        options={{ headerShown: false }}
      />
      <InSideStack.Screen
        name="WalletDetail"
        component={WalletDetail}
        options={{ headerShown: false }}
      />
      <InSideStack.Screen
        name="AddQR"
        component={AddQRScreen}
        options={{ headerShown: false }}
      />
      <InSideStack.Screen
        name="QRDetail"
        component={QRDetail}
        options={{ headerShown: false }}
      />
    </InSideStack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };

    checkUser();

    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
      if (user) {
        await AsyncStorage.setItem("user", JSON.stringify(user));
      } else {
        await AsyncStorage.removeItem("user");
      }
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return null; // Hoặc một màn hình loading
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        {user ? (
          <Stack.Screen
            name="InsideLayout"
            component={InsideLayout}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Start"
              component={StartScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="EmailLogin"
              component={EmailLoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
