import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  CreditCard,
  Wallet,
  Banknote,
  MapPin,
  Receipt,
  CheckCircle2,
} from "lucide-react-native";
import { useCart } from "@/context/CartContext";

export default function Pagamento() {
  const router = useRouter();
  const { totalPrice, confirmOrder } = useCart();

  const [paymentMethod, setPaymentMethod] = useState("pix");

  const entrega = 7.0;
  const descontoPix = paymentMethod === "pix" ? totalPrice * 0.05 : 0;

  const totalFinal = totalPrice + entrega - descontoPix;

  async function finalizarPedido() {
    try {
      await confirmOrder();

      Alert.alert(
        "Pedido Confirmado 🎉",
        "Seu pedido foi enviado para a cozinha!"
      );

      router.replace("/home");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível finalizar o pedido.");
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color="#fff" size={22} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Pagamento</Text>

        <View style={{ width: 22 }} />
      </View>

      {/* CARD PRINCIPAL */}
      <LinearGradient
        colors={["#E31837", "#ff4d4d"]}
        style={styles.card}
      >
        <Text style={styles.cardLabel}>TOTAL DO PEDIDO</Text>

        <Text style={styles.cardValue}>
          R$ {totalFinal.toFixed(2).replace(".", ",")}
        </Text>

        <Text style={styles.cardSub}>
          Pagamento 100% seguro
        </Text>
      </LinearGradient>

      {/* ENTREGA */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📍 Endereço de Entrega</Text>

        <View style={styles.infoCard}>
          <MapPin size={18} color="#E31837" />
          <Text style={styles.infoText}>
            Rua do Cliente, 123 - Centro
          </Text>
        </View>
      </View>

      {/* RESUMO */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🧾 Resumo</Text>

        <View style={styles.summaryCard}>
          <View style={styles.row}>
            <Text style={styles.label}>Subtotal</Text>
            <Text style={styles.value}>
              R$ {totalPrice.toFixed(2).replace(".", ",")}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Entrega</Text>
            <Text style={styles.value}>R$ 7,00</Text>
          </View>

          {paymentMethod === "pix" && (
            <View style={styles.row}>
              <Text style={styles.discount}>Desconto PIX</Text>
              <Text style={styles.discount}>
                - R$ {descontoPix.toFixed(2).replace(".", ",")}
              </Text>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.totalLabel}>TOTAL</Text>
            <Text style={styles.totalValue}>
              R$ {totalFinal.toFixed(2).replace(".", ",")}
            </Text>
          </View>
        </View>
      </View>

      {/* PAGAMENTO */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💳 Forma de Pagamento</Text>

        <TouchableOpacity
          style={[
            styles.paymentCard,
            paymentMethod === "pix" && styles.paymentSelected,
          ]}
          onPress={() => setPaymentMethod("pix")}
        >
          <Wallet color="#00D26A" size={22} />
          <View style={{ flex: 1 }}>
            <Text style={styles.paymentTitle}>PIX</Text>
            <Text style={styles.paymentDesc}>
              5% de desconto
            </Text>
          </View>

          {paymentMethod === "pix" && (
            <CheckCircle2 color="#00D26A" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.paymentCard,
            paymentMethod === "cartao" && styles.paymentSelected,
          ]}
          onPress={() => setPaymentMethod("cartao")}
        >
          <CreditCard color="#fff" size={22} />
          <View style={{ flex: 1 }}>
            <Text style={styles.paymentTitle}>
              Cartão de Crédito
            </Text>
            <Text style={styles.paymentDesc}>
              Visa, Master, Elo
            </Text>
          </View>

          {paymentMethod === "cartao" && (
            <CheckCircle2 color="#00D26A" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.paymentCard,
            paymentMethod === "dinheiro" && styles.paymentSelected,
          ]}
          onPress={() => setPaymentMethod("dinheiro")}
        >
          <Banknote color="#fff" size={22} />
          <View style={{ flex: 1 }}>
            <Text style={styles.paymentTitle}>Dinheiro</Text>
            <Text style={styles.paymentDesc}>
              Pagar na entrega
            </Text>
          </View>

          {paymentMethod === "dinheiro" && (
            <CheckCircle2 color="#00D26A" />
          )}
        </TouchableOpacity>
      </View>

      {/* CUPOM */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎁 Cupom</Text>

        <View style={styles.infoCard}>
          <Receipt size={18} color="#E31837" />
          <Text style={styles.infoText}>
            Nenhum cupom aplicado
          </Text>
        </View>
      </View>

      {/* BOTÃO */}
      <TouchableOpacity
        style={styles.finalizarBtn}
        onPress={finalizarPedido}
      >
        <Text style={styles.finalizarText}>
          Finalizar Pedido 🍔
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B0B",
  },

  header: {
    height: 70,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  card: {
    margin: 16,
    borderRadius: 24,
    padding: 24,
  },

  cardLabel: {
    color: "#fff",
    opacity: 0.8,
    fontSize: 12,
  },

  cardValue: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "900",
    marginTop: 6,
  },

  cardSub: {
    color: "#fff",
    opacity: 0.8,
    marginTop: 4,
  },

  section: {
    paddingHorizontal: 16,
    marginTop: 12,
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 10,
  },

  infoCard: {
    backgroundColor: "#171717",
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },

  infoText: {
    color: "#fff",
    flex: 1,
  },

  summaryCard: {
    backgroundColor: "#171717",
    borderRadius: 16,
    padding: 16,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },

  label: {
    color: "#aaa",
  },

  value: {
    color: "#fff",
  },

  discount: {
    color: "#00D26A",
    fontWeight: "bold",
  },

  divider: {
    height: 1,
    backgroundColor: "#2a2a2a",
    marginVertical: 12,
  },

  totalLabel: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
  },

  totalValue: {
    color: "#E31837",
    fontWeight: "900",
    fontSize: 18,
  },

  paymentCard: {
    backgroundColor: "#171717",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#222",
  },

  paymentSelected: {
    borderColor: "#E31837",
  },

  paymentTitle: {
    color: "#fff",
    fontWeight: "700",
  },

  paymentDesc: {
    color: "#999",
    fontSize: 12,
    marginTop: 2,
  },

  finalizarBtn: {
    backgroundColor: "#E31837",
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 18,
    padding: 18,
    alignItems: "center",
  },

  finalizarText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
  },
});

