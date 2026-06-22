import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter, usePathname } from "expo-router";
import {
  Home,
  Utensils,
  Tag,
  Trophy,
  UserCircle,
  ShieldCheck,
} from "lucide-react-native";
import { useAuth } from "@/context/AuthContext";

export default function BottomBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const Item = ({ icon: Icon, label, route }: any) => {
    const active = pathname === route;

    return (
      <TouchableOpacity
        onPress={() => router.push(route)}
        style={[styles.item, active && styles.activeItem]}
      >
        <Icon size={20} color={active ? "#E31837" : "#777"} />
        <Text style={[styles.label, active && styles.activeLabel]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Item icon={Home} label="Início" route="/home" />
      <Item icon={Utensils} label="Cardápio" route="/cardapio" />
      <Item icon={Tag} label="Promos" route="/promos" />
      <Item icon={Trophy} label="Fidelidade" route="/fidelidade" />

      {/* 👇 ADMIN SÓ PARA ROLE ADMIN */}
      {user?.role === "ADMIN" && (
        <TouchableOpacity
          onPress={() => router.push("/admin")}
          style={styles.adminButton}
        >
          <ShieldCheck size={20} color="#E31837" />
          <Text style={styles.adminText}>Admin</Text>
        </TouchableOpacity>
      )}

      <Item icon={UserCircle} label="Perfil" route="/perfil" />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#0f0505",
    height: 65,
    borderTopWidth: 1,
    borderTopColor: "#3a2a2a",
  },

  item: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
  },

  activeItem: {
    backgroundColor: "#1a0f0f",
  },

  label: {
    fontSize: 10,
    color: "#777",
    marginTop: 2,
  },

  activeLabel: {
    color: "#E31837",
    fontWeight: "bold",
  },

  adminButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
  },

  adminText: {
    fontSize: 10,
    color: "#E31837",
    marginTop: 2,
    fontWeight: "bold",
  },
});