import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import StartScreen from "./app/screens/StartScreen";
import LoginScreen from "./app/screens/login/LoginScreen";
import EmailLoginScreen from "./app/screens/login/EmailLoginScreen";
import SignUpScreen from "./app/screens/login/SignUpScreen";
import HomeScreen from "app/screens/HomeScreen";
import { onAuthStateChanged, User } from "firebase/auth";
import { FIREBASE_AUTH } from "firebaseConfig";
import { useEffect } from "react";

const Stack = createStackNavigator();

const InSideStack = createStackNavigator();

function InsideLayout() {
  return (
    <InSideStack.Navigator>
      <InSideStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
    </InSideStack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = React.useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
    });
  }, []);
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
