import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { useRouter } from "expo-router";
import { Flame, ShoppingBag } from "lucide-react-native";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const router = useRouter();
  const { totalItems } = useCart();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.05, duration: 1200, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Flame size={16} color="#ff3b30" />
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Text style={styles.logo}>
            <Text style={styles.if}>IF</Text>
            <Text style={styles.burger}>BURGUER</Text>
          </Text>
        </Animated.View>
      </View>

      <TouchableOpacity onPress={() => router.push("/pedidos")} style={styles.bagBtn}>
        <ShoppingBag size={20} color="#fff" />
        {totalItems > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{totalItems > 99 ? '99+' : totalItems}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 55,
    backgroundColor: "#0f0505",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#3a2a2a",
  },
  left: { flexDirection: "row", alignItems: "center", gap: 6 },
  logo: { fontSize: 16, fontWeight: "900" },
  if: { color: "#fff" },
  burger: { color: "#ffcc00" },
  bagBtn: { position: "relative", padding: 4 },
  badge: {
    position: "absolute",
    top: -2,
    right: -4,
    backgroundColor: "#E31837",
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "900" },
});
