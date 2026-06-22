import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { useState } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Dados fictícios para renderização das abas de Encomenda
const PEDIDOS_MOCK = [
  { id: "1024", cliente: "Rodrigo Silva", itens: "1x Double Cheddar, 1x Batata Frita M, 1x Coca-Cola", total: "15,90", status: "PENDENTE", hora: "20:45" },
  { id: "1023", cliente: "Ana Oliveira", itens: "2x Classic Burger, 1x Sumo de Laranja", total: "18,40", status: "PREPARANDO", hora: "20:30" },
  { id: "1022", cliente: "Gabriel Santos", itens: "1x IF-Combo Família", total: "24,50", status: "ENTREGUE", hora: "19:15" }
];

export default function AdminPedidos() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<"PENDENTE" | "PREPARANDO" | "ENTREGUE">("PENDENTE");

  const filteredPedidos = PEDIDOS_MOCK.filter(p => p.status === selectedTab);

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>📦 Encomendas</Text>
          <Text style={styles.subtitle}>Gestão de entregas em tempo real</Text>
        </View>
      </View>

      {/* Abas Superiores */}
      <View style={styles.tabContainer}>
        {(["PENDENTE", "PREPARANDO", "ENTREGUE"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.activeTab]}
            onPress={() => setSelectedTab(tab)}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>
              {tab === "PENDENTE" ? "Novas" : tab === "PREPARANDO" ? "Preparo" : "Concluídas"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista de Encomendas */}
      <FlatList
        data={filteredPedidos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="clipboard-text-outline" size={48} color="#333" />
            <Text style={styles.emptyText}>Sem atividade nesta secção</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderNumber}>Pedido #{item.id}</Text>
              <Text style={styles.orderTime}>{item.hora}</Text>
            </View>

            <Text style={styles.clientName}>{item.cliente}</Text>
            <Text style={styles.itemsText}>{item.itens}</Text>

            <View style={styles.orderDivider} />

            <View style={styles.orderFooter}>
              <View>
                <Text style={styles.totalLabel}>Total a Receber</Text>
                <Text style={styles.totalValue}>€ {item.total}</Text>
              </View>

              {item.status === "PENDENTE" && (
                <TouchableOpacity 
                  style={styles.statusActionBtn} 
                  onPress={() => console.log("Aceitar pedido", item.id)}
                >
                  <Text style={styles.statusActionBtnText}>Aceitar Pedido</Text>
                </TouchableOpacity>
              )}
              {item.status === "PREPARANDO" && (
                <TouchableOpacity 
                  style={[styles.statusActionBtn, { backgroundColor: "#22c55e" }]} 
                  onPress={() => console.log("Despachar encomenda", item.id)}
                >
                  <Text style={styles.statusActionBtnText}>Finalizar</Text>
                </TouchableOpacity>
              )}
              {item.status === "ENTREGUE" && (
                <View style={styles.completedBadge}>
                  <Ionicons name="checkmark-done" size={16} color="#22c55e" />
                  <Text style={styles.completedText}>Entregue</Text>
                </View>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0505",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
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
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
  },
  subtitle: {
    color: "#aaa",
    fontSize: 13,
    marginTop: 2,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#160a0a",
    marginHorizontal: 20,
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: "#2c1414",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: "#E31837",
  },
  tabText: {
    color: "#888",
    fontWeight: "bold",
    fontSize: 13,
  },
  activeTabText: {
    color: "#fff",
  },
  listContent: {
    padding: 20,
    gap: 15,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
  },
  emptyText: {
    color: "#555",
    marginTop: 10,
    fontSize: 14,
  },
  orderCard: {
    backgroundColor: "#160a0a",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2c1414",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  orderNumber: {
    color: "#E31837",
    fontWeight: "bold",
    fontSize: 14,
  },
  orderTime: {
    color: "#888",
    fontSize: 12,
  },
  clientName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  itemsText: {
    color: "#aaa",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },
  orderDivider: {
    height: 1,
    backgroundColor: "#2c1414",
    marginBottom: 14,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    color: "#888",
    fontSize: 11,
  },
  totalValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  statusActionBtn: {
    backgroundColor: "#E31837",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  statusActionBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(34, 197, 94, 0.12)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  completedText: {
    color: "#22c55e",
    fontWeight: "bold",
    fontSize: 13,
  },
});