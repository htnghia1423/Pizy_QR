import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import {
  Button,
  Title,
  Paragraph,
  Provider as PaperProvider,
  DefaultTheme,
  Searchbar,
  Card,
  Menu,
  Drawer,
  BottomNavigation,
  FAB,
} from "react-native-paper";
import {
  User,
  Menu as MenuIcon,
  ListTodo,
  Wallet2,
  QrCode,
  EyeOff,
  Eye,
  LogOut,
} from "lucide-react-native";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../firebaseConfig";
import { signOut } from "firebase/auth";
import { NavigationProp } from "@react-navigation/native";
import DrawerLayout from "react-native-gesture-handler/DrawerLayout";
import ListTransaction from "app/components/ListTransaction";
import ListWallet from "app/components/ListWallet";
import ListQR from "app/components/ListQR";
import { onValue, ref } from "@firebase/database";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#00BA88",
    secondary: "#FFB800",
    background: "#FFFFFF",
    text: "#000000",
    placeholder: "#A0A0A0",
  },
};

const HomeScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showBalance, setShowBalance] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [index, setIndex] = useState(1);
  const [totalBalance, setTotalBalance] = useState(0);

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
          const total = userWallets.reduce(
            (sum, wallet) => sum + wallet.balance,
            0
          );
          setTotalBalance(total);
        }
      });
    };

    fetchWallets();
  }, []);

  const [routes] = useState([
    {
      key: "transactionLog",
      title: "Lịch sử",
      icon: ({ color, size }: { color: string; size: number }) => (
        <ListTodo color={color} size={size} />
      ),
    },
    {
      key: "manageWallet",
      title: "Ví tiền",
      icon: ({ color, size }: { color: string; size: number }) => (
        <Wallet2 color={color} size={size} />
      ),
    },
    {
      key: "manageQRCode",
      title: "Mã QR",
      icon: ({ color, size }: { color: string; size: number }) => (
        <QrCode color={color} size={size} />
      ),
    },
  ]);
  const drawerRef = useRef<DrawerLayout>(null);

  const handleLogout = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const renderDrawerContent = () => (
    <Drawer.Section title="Menu" style={{ marginTop: 20 }}>
      <Drawer.Item
        label="Lịch sử giao dịch"
        icon={() => <ListTodo color={theme.colors.secondary} size={24} />}
        onPress={() => navigation.navigate("TransactionLog")}
      />
      <Drawer.Item
        label="Quản lý ví tiền"
        icon={() => <Wallet2 color={theme.colors.secondary} size={24} />}
        onPress={() => navigation.navigate("ManageWallet")}
      />
      <Drawer.Item
        label="Quản lý mã QR"
        icon={() => <QrCode color={theme.colors.secondary} size={24} />}
        onPress={() => navigation.navigate("ManageQRCode")}
      />
      <Drawer.Item
        label="Đăng xuất"
        icon={() => <LogOut color={theme.colors.secondary} size={24} />}
        onPress={handleLogout}
      />
    </Drawer.Section>
  );

  const renderScene = BottomNavigation.SceneMap({
    transactionLog: ListTransaction,
    manageWallet: ListWallet,
    manageQRCode: ListQR,
  });

  return (
    <PaperProvider theme={theme}>
      <DrawerLayout
        ref={drawerRef}
        drawerWidth={300}
        drawerPosition="left"
        drawerType="slide"
        renderNavigationView={renderDrawerContent}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            {/* Combined Card */}
            <Card style={styles.combinedCard}>
              <Card.Content>
                {/* Header */}
                <View style={styles.header}>
                  <Button
                    icon={() => (
                      <MenuIcon size={24} color={theme.colors.primary} />
                    )}
                    style={styles.headerButtonMenu}
                    onPress={() => drawerRef.current?.openDrawer()}
                  >
                    {""}
                  </Button>
                  <Menu
                    visible={menuVisible}
                    onDismiss={closeMenu}
                    anchorPosition="bottom"
                    style={{
                      marginTop: 40,
                    }}
                    contentStyle={{ backgroundColor: theme.colors.background }}
                    anchor={
                      <Button
                        icon={() => (
                          <User size={24} color={theme.colors.primary} />
                        )}
                        style={styles.headerButtonUser}
                        onPress={openMenu}
                      >
                        {""}
                      </Button>
                    }
                  >
                    <Menu.Item
                      title="Hồ sơ"
                      leadingIcon={() => (
                        <User color={theme.colors.secondary} />
                      )}
                    />
                    <Menu.Item
                      onPress={handleLogout}
                      title="Đăng xuất"
                      leadingIcon={() => (
                        <LogOut color={theme.colors.secondary} />
                      )}
                    />
                  </Menu>
                </View>

                {/* Search Bar */}
                <Searchbar
                  placeholder="Tìm kiếm"
                  onChangeText={setSearchQuery}
                  value={searchQuery}
                  style={[
                    styles.searchBar,
                    { borderColor: theme.colors.secondary, borderWidth: 1 },
                  ]}
                  iconColor={theme.colors.secondary}
                />

                {/* Balance Card */}
                <View style={styles.balanceCard}>
                  <View style={styles.balanceHeader}>
                    <Title style={styles.balanceAmount}>
                      {!showBalance
                        ? `${totalBalance.toLocaleString()} VNĐ`
                        : "******"}
                    </Title>
                    <Button
                      icon={() =>
                        showBalance ? (
                          <EyeOff size={24} color={theme.colors.primary} />
                        ) : (
                          <Eye size={24} color={theme.colors.primary} />
                        )
                      }
                      onPress={() => setShowBalance(!showBalance)}
                      style={styles.eyeButton}
                    >
                      {""}
                    </Button>
                  </View>
                  <Paragraph style={styles.balanceLabel}>Tổng số dư</Paragraph>
                </View>
              </Card.Content>
            </Card>
            <View style={styles.managementContainer}>
              <Title style={styles.managementTitle}>
                Quản lý thông tin chung
              </Title>
            </View>
          </View>

          {index === 1 && (
            <FAB
              icon="plus"
              customSize={60}
              color="#e0c277"
              style={styles.addWalletButton}
              onPress={() => navigation.navigate("AddWallet")}
            />
          )}

          {index === 2 && (
            <FAB
              icon="plus"
              customSize={60}
              color="#e0c277"
              style={styles.addWalletButton}
              onPress={() => navigation.navigate("AddQR")}
            />
          )}

          {/* Bottom Navigation */}
          <BottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={renderScene}
            barStyle={{ backgroundColor: "#EFFAF7" }}
            labeled={true}
            shifting={true}
            renderIcon={({ route }) =>
              route.icon({ color: theme.colors.secondary, size: 24 })
            }
            activeColor={theme.colors.primary}
          />

          {/* Background Circles */}
          <View style={[styles.circle, styles.leftCircle]} />
          <View style={[styles.circle, styles.rightCircle]} />
          <View style={[styles.circle, styles.bottomCircle]} />
          <View style={[styles.circle, styles.topCircle]} />
        </SafeAreaView>
      </DrawerLayout>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFEFA",
  },
  circle: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#0DB07E66",
  },
  leftCircle: {
    top: 350,
    left: -150,
  },
  rightCircle: {
    top: 450,
    right: -150,
  },
  bottomCircle: {
    bottom: -100,
    left: -350,
  },
  topCircle: {
    top: -120,
    left: -190,
  },
  content: {
    flex: 1,
  },
  combinedCard: {
    backgroundColor: "#EFFAF7",
    paddingTop: 20,
    borderRadius: 16,
    elevation: 2,
    width: "100%",
    marginHorizontal: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerButtonUser: {
    marginRight: -10,
    padding: 0,
  },
  headerButtonMenu: {
    margin: 0,
    padding: 0,
  },
  searchBar: {
    backgroundColor: "#FFFEFA",
    elevation: 2,
    borderRadius: 25,
    marginBottom: 24,
  },
  balanceCard: {
    backgroundColor: "#FFFEFA",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 20,
    elevation: 2,
  },
  balanceHeader: {
    marginLeft: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  balanceAmount: {
    fontSize: 30,
    color: "#00BA88",
    fontWeight: "bold",
    marginBottom: 8,
  },
  eyeButton: {
    marginLeft: 10,
    marginBottom: 10,
  },
  balanceLabel: {
    color: "#666666",
    fontSize: 16,
  },
  menuContainer: {
    gap: 16,
    paddingHorizontal: 24,
  },
  menuItem: {
    padding: 0,
    backgroundColor: "#FFFEFA",
  },
  menuTitle: {
    fontSize: 16,
    color: "#666666",
    marginLeft: 12,
  },
  logoutButton: {
    height: 60,
    width: 300,
    justifyContent: "center",
    marginTop: 30,
    borderRadius: 16,
    alignSelf: "center",
  },
  addWalletButton: {
    zIndex: 1,
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: "#08d094",
  },
  managementContainer: {
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  managementTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0DB07E",
  },
});

export default HomeScreen;
