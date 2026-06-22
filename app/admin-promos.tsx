import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Dados fictícios de promoções do estabelecimento
const CUPONS_MOCK = [
  { id: "1", codigo: "BURGUER10", desconto: "10%", desc: "Desconto em consumos superiores a €15", ativo: true },
  { id: "2", codigo: "FRETEGRATIS", desconto: "Entrega Grátis", desc: "Campanha válida aos fins de semana", ativo: false }
];

export default function AdminPromos() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>💸 Promoções</Text>
          <Text style={styles.subtitle}>Configurar cupons de desconto</Text>
        </View>
      </View>

      {/* Lista de Campanhas */}
      <FlatList
        data={CUPONS_MOCK}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.promoCard}>
            <View style={styles.promoHeader}>
              <View style={styles.couponTag}>
                <MaterialCommunityIcons name="ticket-percent-outline" size={16} color="#eab308" />
                <Text style={styles.couponCode}>{item.codigo}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: item.ativo ? "rgba(34, 197, 94, 0.12)" : "rgba(136, 136, 136, 0.12)" }]}>
                <Text style={[styles.statusText, { color: item.ativo ? "#22c55e" : "#888" }]}>
                  {item.ativo ? "Em vigor" : "Suspenso"}
                </Text>
              </View>
            </View>

            <Text style={styles.discountValue}>{item.desconto}</Text>
            <Text style={styles.promoDesc}>{item.desc}</Text>

            <View style={styles.divider} />

            <View style={styles.footerActions}>
              <TouchableOpacity style={styles.actionBtn} activeOpacity={0.75}>
                <MaterialCommunityIcons name="pencil" size={16} color="#aaa" />
                <Text style={styles.actionText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.actionBtn, { borderColor: "#E31837" }]} activeOpacity={0.75}>
                <MaterialCommunityIcons name={item.ativo ? "eye-off" : "eye"} size={16} color={item.ativo ? "#E31837" : "#22c55e"} />
                <Text style={[styles.actionText, { color: item.ativo ? "#E31837" : "#22c55e" }]}>
                  {item.ativo ? "Desativar" : "Ativar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Botão de Criação de Cupom */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.9}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
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
  listContent: {
    padding: 20,
    gap: 15,
  },
  promoCard: {
    backgroundColor: "#160a0a",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2c1414",
  },
  promoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  couponTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(234, 179, 8, 0.12)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  couponCode: {
    color: "#eab308",
    fontWeight: "bold",
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  discountValue: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 15,
  },
  promoDesc: {
    color: "#888",
    fontSize: 13,
    marginTop: 5,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: "#2c1414",
    marginVertical: 15,
  },
  footerActions: {
    flexDirection: "row",
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#2c1414",
    backgroundColor: "#1c1111",
    paddingVertical: 10,
    borderRadius: 12,
  },
  actionText: {
    color: "#aaa",
    fontSize: 13,
    fontWeight: "bold",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#E31837",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
});