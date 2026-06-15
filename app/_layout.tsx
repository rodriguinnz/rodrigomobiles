import { Stack } from "expo-router";
import { View } from "react-native";
import Header from "@/components/Header";
import BottomBar from "@/components/BottomBar";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

export default function Layout() {
  return (
    <AuthProvider>
      <CartProvider>
        <View style={{ flex: 1 }}>
          <Header />
          <Stack screenOptions={{ headerShown: false }} />
          <BottomBar />
        </View>
      </CartProvider>
    </AuthProvider>
  );
}
