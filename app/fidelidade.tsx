import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Trophy, Star, Gift, Zap } from "lucide-react-native";
import { useAuth } from "@/context/AuthContext";
import { authApi } from "@/services/api";

const RECOMPENSAS = [
  { pontos: 50,  descricao: 'Batata Frita Grátis 🍟',    icon: '🍟' },
  { pontos: 100, descricao: 'Refrigerante Grátis 🥤',    icon: '🥤' },
  { pontos: 200, descricao: 'Hambúrguer Simples Grátis 🍔', icon: '🍔' },
  { pontos: 350, descricao: 'Combo Individual Grátis 🎁', icon: '🎁' },
  { pontos: 500, descricao: 'Jantar para 2 Grátis 👫',   icon: '👫' },
];

export default function Fidelidade() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [redeeming, setRedeeming] = useState<number | null>(null);

  if (!user) {
    return (
      <View style={styles.center}>
        <Trophy size={90} color="#E31837" />
        <Text style={styles.title}>Programa de Fidelidade</Text>
        <Text style={styles.subtitle}>
          Faça login para acumular pontos e resgatar produtos grátis!
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/login")}>
          <Text style={styles.buttonText}>Entrar / Cadastrar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  async function handleResgatar(pontos: number, descricao: string) {
    if (user!.pontos < pontos) {
      Alert.alert("Pontos insuficientes", `Você precisa de ${pontos} pontos para este resgate.`);
      return;
    }
    Alert.alert(
      "Confirmar resgate",
      `Resgatar ${pontos} pontos por: ${descricao}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Resgatar", onPress: async () => {
            setRedeeming(pontos);
            try {
              await authApi.redeem(pontos);
              await refreshUser();
              Alert.alert("Resgatado! 🎉", `Aproveite: ${descricao}`);
            } catch (e: any) {
              Alert.alert("Erro", e?.message ?? "Não foi possível resgatar.");
            } finally {
              setRedeeming(null);
            }
          }
        }
      ]
    );
  }

  const nivelInfo = () => {
    if (user.pontos >= 500) return { nivel: 'Ouro', cor: '#F5A623', proximo: null, falta: 0 };
    if (user.pontos >= 200) return { nivel: 'Prata', cor: '#ccc', proximo: 'Ouro', falta: 500 - user.pontos };
    return { nivel: 'Bronze', cor: '#cd7f32', proximo: 'Prata', falta: 200 - user.pontos };
  };

  const { nivel, cor, proximo, falta } = nivelInfo();

  return (
    <ScrollView style={styles.container}>
      <View style={{ padding: 20 }}>

        {/* HERO DE PONTOS */}
        <View style={styles.pontosCard}>
          <Trophy size={40} color={cor} />
          <View style={{ marginLeft: 14 }}>
            <Text style={styles.pontosLabel}>Seus pontos</Text>
            <Text style={[styles.pontosValor, { color: cor }]}>{user.pontos}</Text>
            <Text style={styles.nivelText}>Nível {nivel} 🏅</Text>
          </View>
        </View>

        {proximo && (
          <View style={styles.progressCard}>
            <Text style={styles.progressText}>
              Faltam <Text style={{ color: '#E31837', fontWeight: '900' }}>{falta} pontos</Text> para o nível {proximo}!
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${Math.min(100, (user.pontos / (user.pontos + falta)) * 100)}%` }]} />
            </View>
          </View>
        )}

        {/* COMO GANHAR */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Como ganhar pontos 🎯</Text>
          <View style={styles.infoCard}>
            <Zap size={20} color="#F5A623" />
            <Text style={styles.infoText}>1 ponto por real gasto em pedidos</Text>
          </View>
          <View style={styles.infoCard}>
            <Star size={20} color="#F5A623" />
            <Text style={styles.infoText}>Avalie produtos e ganhe bônus</Text>
          </View>
        </View>

        {/* RECOMPENSAS */}
        <Text style={styles.sectionTitle}>Recompensas disponíveis 🎁</Text>

        {RECOMPENSAS.map((r) => {
          const podeResgatar = user.pontos >= r.pontos;
          return (
            <View key={r.pontos} style={[styles.recompensaCard, !podeResgatar && { opacity: 0.5 }]}>
              <Text style={{ fontSize: 28 }}>{r.icon}</Text>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.recompensaNome}>{r.descricao}</Text>
                <Text style={styles.recompensaPontos}>{r.pontos} pontos</Text>
              </View>
              <TouchableOpacity
                style={[styles.resgateBtn, podeResgatar ? {} : styles.resgateBtnDisabled]}
                onPress={() => handleResgatar(r.pontos, r.descricao)}
                disabled={!podeResgatar || redeeming !== null}
              >
                {redeeming === r.pontos
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={styles.resgateBtnText}>Resgatar</Text>
                }
              </TouchableOpacity>
            </View>
          );
        })}

        <Text style={styles.hint}>
          💡 Os pontos são creditados automaticamente ao confirmar pedidos.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0505" },
  center: {
    flex: 1, backgroundColor: "#0f0505",
    alignItems: "center", justifyContent: "center", padding: 20,
  },
  title: { color: "#fff", fontSize: 22, fontWeight: "bold", textAlign: "center", marginTop: 20 },
  subtitle: { color: "#aaa", fontSize: 14, textAlign: "center", marginTop: 10, marginBottom: 30 },
  button: {
    backgroundColor: "#E31837", paddingVertical: 14,
    paddingHorizontal: 30, borderRadius: 12, width: "80%", alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  pontosCard: {
    backgroundColor: '#1a0a0a', borderRadius: 16, padding: 20,
    flexDirection: 'row', alignItems: 'center', marginBottom: 14,
    borderWidth: 1, borderColor: '#2a2a2a',
  },
  pontosLabel: { color: '#aaa', fontSize: 12 },
  pontosValor: { fontSize: 42, fontWeight: '900' },
  nivelText: { color: '#aaa', fontSize: 13, marginTop: 2 },
  progressCard: {
    backgroundColor: '#1a0a0a', borderRadius: 12, padding: 14,
    marginBottom: 20, borderWidth: 1, borderColor: '#2a2a2a',
  },
  progressText: { color: '#aaa', marginBottom: 10, fontSize: 13 },
  progressBar: {
    height: 6, backgroundColor: '#2a2a2a', borderRadius: 3, overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: '#E31837', borderRadius: 3 },
  section: { marginBottom: 16 },
  sectionTitle: {
    color: '#aaa', fontSize: 12, fontWeight: '700',
    marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1,
  },
  infoCard: {
    backgroundColor: '#1a0a0a', borderRadius: 10, padding: 12,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginBottom: 8, borderWidth: 1, borderColor: '#2a2a2a',
  },
  infoText: { color: '#ddd', flex: 1 },
  recompensaCard: {
    backgroundColor: '#1a0a0a', borderRadius: 14, padding: 14,
    flexDirection: 'row', alignItems: 'center', marginBottom: 10,
    borderWidth: 1, borderColor: '#2a2a2a',
  },
  recompensaNome: { color: '#fff', fontWeight: '600' },
  recompensaPontos: { color: '#E31837', fontWeight: '900', marginTop: 2 },
  resgateBtn: {
    backgroundColor: '#E31837', paddingHorizontal: 14,
    paddingVertical: 8, borderRadius: 10,
  },
  resgateBtnDisabled: { backgroundColor: '#333' },
  resgateBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  hint: { color: '#555', fontSize: 12, textAlign: 'center', marginTop: 20, marginBottom: 10 },
});
