import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Alert, ActivityIndicator, Image, ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Trash2, ShoppingBag, History, Plus, Minus } from "lucide-react-native";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { pedidosApi, type Pedido } from "@/services/api";

type Tab = 'sacola' | 'historico';

export default function Pedidos() {
  const router = useRouter();
  const { items, totalPrice, removeItem, updateQty, confirmOrder, loadingSync } = useCart();
  const { user, refreshUser } = useAuth();
  const [tab, setTab] = useState<Tab>('sacola');
  const [historico, setHistorico] = useState<Pedido[]>([]);
  const [loadingHistorico, setLoadingHistorico] = useState(false);

  useEffect(() => {
    if (tab === 'historico' && user) {
      loadHistorico();
    }
  }, [tab, user]);

  async function loadHistorico() {
    setLoadingHistorico(true);
    try {
      const data = await pedidosApi.historico();
      setHistorico(data);
    } catch (e: any) {
      Alert.alert("Erro", e?.message ?? "Não foi possível carregar histórico.");
    } finally {
      setLoadingHistorico(false);
    }
  }

  async function handleConfirmar() {
    if (!user) {
      Alert.alert(
        "Login necessário",
        "Faça login para confirmar seu pedido.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Entrar", onPress: () => router.push("/login") },
        ]
      );
      return;
    }
    try {
      await confirmOrder();
      await refreshUser();
      Alert.alert(
        "Pedido confirmado! 🎉",
        `Seu pedido foi realizado com sucesso!\nPontos ganhos: ${Math.floor(totalPrice)}`,
        [{ text: "OK" }]
      );
    } catch (e: any) {
      Alert.alert("Erro", e?.message ?? "Não foi possível confirmar o pedido.");
    }
  }

  const fmtPreco = (p: string | number) =>
    `R$ ${Number(p).toFixed(2).replace('.', ',')}`;

  const fmtData = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Pedidos</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* TABS */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, tab === 'sacola' && styles.activeTab]}
          onPress={() => setTab('sacola')}
        >
          <ShoppingBag size={16} color={tab === 'sacola' ? '#E31837' : '#777'} />
          <Text style={[styles.tabText, tab === 'sacola' && styles.activeTabText]}>
            Sacola {items.length > 0 && `(${items.length})`}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'historico' && styles.activeTab]}
          onPress={() => setTab('historico')}
        >
          <History size={16} color={tab === 'historico' ? '#E31837' : '#777'} />
          <Text style={[styles.tabText, tab === 'historico' && styles.activeTabText]}>Histórico</Text>
        </TouchableOpacity>
      </View>

      {/* ─── SACOLA ─── */}
      {tab === 'sacola' && (
        <>
          {items.length === 0 ? (
            <View style={styles.emptyContainer}>
              <ShoppingBag size={60} color="#333" />
              <Text style={styles.emptyText}>Sua sacola está vazia</Text>
              <TouchableOpacity style={styles.ctaBtn} onPress={() => router.push('/cardapio')}>
                <Text style={styles.ctaBtnText}>Ver Cardápio</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <FlatList
                data={items}
                keyExtractor={(item) => String(item.produtoId)}
                contentContainerStyle={{ padding: 16 }}
                renderItem={({ item }) => (
                  <View style={styles.item}>
                    <Image source={{ uri: item.foto }} style={styles.itemImg} />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.itemName}>{item.titulo}</Text>
                      <Text style={styles.itemPrice}>{fmtPreco(item.preco * item.quantidade)}</Text>
                      {/* QTY CONTROL */}
                      <View style={styles.qtyRow}>
                        <TouchableOpacity
                          onPress={() => updateQty(item.produtoId, item.quantidade - 1)}
                          style={styles.qtyBtn}
                        >
                          <Minus size={14} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.qtyText}>{item.quantidade}</Text>
                        <TouchableOpacity
                          onPress={() => updateQty(item.produtoId, item.quantidade + 1)}
                          style={styles.qtyBtn}
                        >
                          <Plus size={14} color="#fff" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <TouchableOpacity onPress={() => removeItem(item.produtoId)} style={{ padding: 8 }}>
                      <Trash2 size={20} color="#ff3b30" />
                    </TouchableOpacity>
                  </View>
                )}
              />

              <View style={styles.footer}>
                {loadingSync && (
                  <Text style={{ color: '#aaa', fontSize: 12, textAlign: 'center', marginBottom: 8 }}>
                    Sincronizando carrinho...
                  </Text>
                )}
                <Text style={styles.total}>Total: {fmtPreco(totalPrice)}</Text>
                <TouchableOpacity
                  style={[styles.button, loadingSync && { opacity: 0.7 }]}
                  onPress={() => router.push("/pagamento")}
                  disabled={loadingSync}
                >
                  {loadingSync
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={styles.buttonText}>Confirmar Pedido 🍔</Text>
                  }
                </TouchableOpacity>
              </View>
            </>
          )}
        </>
      )}

      {/* ─── HISTÓRICO ─── */}
      {tab === 'historico' && (
        <>
          {!user ? (
            <View style={styles.emptyContainer}>
              <History size={60} color="#333" />
              <Text style={styles.emptyText}>Faça login para ver seu histórico</Text>
              <TouchableOpacity style={styles.ctaBtn} onPress={() => router.push('/login')}>
                <Text style={styles.ctaBtnText}>Entrar</Text>
              </TouchableOpacity>
            </View>
          ) : loadingHistorico ? (
            <View style={styles.emptyContainer}>
              <ActivityIndicator color="#E31837" size="large" />
            </View>
          ) : historico.length === 0 ? (
            <View style={styles.emptyContainer}>
              <History size={60} color="#333" />
              <Text style={styles.emptyText}>Nenhum pedido realizado ainda</Text>
            </View>
          ) : (
            <ScrollView contentContainerStyle={{ padding: 16 }}>
              {historico.map((pedido) => {
                const total = pedido.itensPedido.reduce(
                  (s, i) => s + Number(i.preco) * i.quantidade, 0
                );
                return (
                  <View key={pedido.id} style={styles.pedidoCard}>
                    <View style={styles.pedidoHeader}>
                      <Text style={styles.pedidoId}>Pedido #{pedido.id}</Text>
                      <Text style={styles.pedidoData}>{fmtData(pedido.data)}</Text>
                    </View>
                    {pedido.itensPedido.map((item) => (
                      <View key={item.produtoId} style={styles.pedidoItem}>
                        <Text style={styles.pedidoItemNome}>
                          {item.produto?.titulo ?? `Produto #${item.produtoId}`}
                        </Text>
                        <Text style={styles.pedidoItemDetalhe}>
                          {item.quantidade}x {fmtPreco(item.preco)}
                        </Text>
                      </View>
                    ))}
                    <View style={styles.pedidoTotal}>
                      <Text style={styles.pedidoTotalText}>Total: {fmtPreco(total)}</Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0505" },
  header: {
    height: 60, backgroundColor: "#0f0505",
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between", paddingHorizontal: 16,
    borderBottomWidth: 1, borderBottomColor: "#1a1a1a",
  },
  title: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1, borderBottomColor: '#222',
  },
  tab: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 6, paddingVertical: 12,
  },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#E31837' },
  tabText: { color: '#777', fontWeight: '600' },
  activeTabText: { color: '#E31837' },
  emptyContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12,
  },
  emptyText: { color: '#555', fontSize: 16 },
  ctaBtn: {
    backgroundColor: '#E31837', paddingHorizontal: 24,
    paddingVertical: 12, borderRadius: 12, marginTop: 8,
  },
  ctaBtnText: { color: '#fff', fontWeight: 'bold' },
  item: {
    backgroundColor: "#1a1a1a", borderRadius: 12,
    marginBottom: 12, flexDirection: "row",
    alignItems: "center", overflow: 'hidden',
  },
  itemImg: { width: 80, height: 80 },
  itemName: { color: "#fff", fontSize: 15, fontWeight: "600" },
  itemPrice: { color: "#E31837", fontWeight: '700', marginTop: 4 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 10 },
  qtyBtn: {
    backgroundColor: '#2a2a2a', borderRadius: 8,
    width: 28, height: 28, alignItems: 'center', justifyContent: 'center',
  },
  qtyText: { color: '#fff', fontWeight: '700', minWidth: 20, textAlign: 'center' },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: "#222" },
  total: { color: "#fff", fontSize: 18, fontWeight: '700', marginBottom: 12 },
  button: {
    backgroundColor: "#E31837", padding: 16,
    borderRadius: 12, alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  // Histórico
  pedidoCard: {
    backgroundColor: '#1a0a0a', borderRadius: 14,
    padding: 14, marginBottom: 14,
    borderWidth: 1, borderColor: '#2a2a2a',
  },
  pedidoHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginBottom: 10, borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a', paddingBottom: 8,
  },
  pedidoId: { color: '#fff', fontWeight: '700', fontSize: 15 },
  pedidoData: { color: '#777', fontSize: 12 },
  pedidoItem: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 4,
  },
  pedidoItemNome: { color: '#ddd', flex: 1 },
  pedidoItemDetalhe: { color: '#aaa', fontSize: 13 },
  pedidoTotal: {
    marginTop: 10, paddingTop: 8,
    borderTopWidth: 1, borderTopColor: '#2a2a2a',
  },
  pedidoTotalText: { color: '#E31837', fontWeight: '900', fontSize: 15 },
});
