import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

export default function Admin() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Proteção de rota para garantir que apenas administradores acedam
  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "ADMIN") {
        router.replace("/home");
      }
    }
  }, [user, loading]);

  if (loading || !user || user.role !== "ADMIN") return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Cabeçalho do Painel */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>🔧 Painel Admin</Text>
          <Text style={styles.subtitle}>Bem-vindo de volta, {user.nome}</Text>
        </View>
      </View>

      {/* Cartões de Estatísticas Rápidas */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <MaterialCommunityIcons name="currency-eur" size={20} color="#22c55e" />
            <Text style={styles.statLabel}>Vendas Hoje</Text>
          </View>
          <Text style={styles.statValue}>€ 1.420,00</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <MaterialCommunityIcons name="moped" size={20} color="#E31837" />
            <Text style={styles.statLabel}>Pedidos</Text>
          </View>
          <Text style={styles.statValue}>18 novos</Text>
        </View>
      </View>

      {/* Secção de Gerenciamento */}
      <Text style={styles.sectionTitle}>Opções de Gestão</Text>
      
      <View style={styles.menuGrid}>
        {/* CARDÁPIO / PRODUTOS */}
        <TouchableOpacity 
          style={styles.menuCard} 
          onPress={() => router.push("/admin-produtos")}
          activeOpacity={0.85}
        >
          <View style={styles.cardLeftContent}>
            <View style={[styles.iconWrapper, { backgroundColor: "rgba(227, 24, 55, 0.15)" }]}>
              <MaterialCommunityIcons name="hamburger" size={28} color="#E31837" />
            </View>
            <View style={styles.cardTextWrapper}>
              <Text style={styles.menuTitle}>Gerir Cardápio</Text>
              <Text style={styles.menuDesc}>Hambúrgueres, bebidas e preços</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#444" />
        </TouchableOpacity>

        {/* ENCOMENDAS / PEDIDOS */}
        <TouchableOpacity 
          style={styles.menuCard} 
          onPress={() => router.push("/admin-pedidos")}
          activeOpacity={0.85}
        >
          <View style={styles.cardLeftContent}>
            <View style={[styles.iconWrapper, { backgroundColor: "rgba(34, 197, 94, 0.15)" }]}>
              <MaterialCommunityIcons name="clipboard-text-clock" size={28} color="#22c55e" />
            </View>
            <View style={styles.cardTextWrapper}>
              <Text style={styles.menuTitle}>Encomendas em Curso</Text>
              <Text style={styles.menuDesc}>Acompanhar status de entregas</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#444" />
        </TouchableOpacity>

        {/* PROMOÇÕES */}
        <TouchableOpacity 
          style={styles.menuCard} 
          onPress={() => router.push("/admin-promos")}
          activeOpacity={0.85}
        >
          <View style={styles.cardLeftContent}>
            <View style={[styles.iconWrapper, { backgroundColor: "rgba(234, 179, 8, 0.15)" }]}>
              <MaterialCommunityIcons name="ticket-percent" size={28} color="#eab308" />
            </View>
            <View style={styles.cardTextWrapper}>
              <Text style={styles.menuTitle}>Promoções & Cupons</Text>
              <Text style={styles.menuDesc}>Configurar descontos ativos</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#444" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0505",
  },
  content: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 35,
    gap: 15,
  },
  backButton: {
    backgroundColor: "#160a0a",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#2c1414",
  },
  title: {
    fontSize: 26,
    color: "#fff",
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  subtitle: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 3,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 35,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#160a0a",
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#2c1414",
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  statLabel: {
    color: "#888",
    fontSize: 12,
    fontWeight: "600",
  },
  statValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 18,
    letterSpacing: 0.3,
  },
  menuGrid: {
    gap: 12,
  },
  menuCard: {
    backgroundColor: "#160a0a",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2c1414",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardLeftContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    flex: 1,
  },
  iconWrapper: {
    padding: 10,
    borderRadius: 14,
  },
  cardTextWrapper: {
    flex: 1,
  },
  menuTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  menuDesc: {
    color: "#888",
    fontSize: 12,
    marginTop: 3,
    lineHeight: 16,
  },
});