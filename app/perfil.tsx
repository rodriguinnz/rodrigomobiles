import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  Mail,
  Phone,
  Trophy,
  Calendar,
  Star,
  ShieldCheck,
  LogOut,
  Pencil,
  Trash2,
} from "lucide-react-native";

export default function Perfil() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const [loggingOut, setLoggingOut] = useState(false);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E31837" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <User size={70} color="#555" />

        <Text style={styles.notLogged}>
          Você não está logado
        </Text>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.loginText}>
            Entrar / Cadastrar
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  async function handleLogout() {
    try {
      setLoggingOut(true);

      await logout();

      router.replace("/login");
    } catch (error) {
      console.log(error);

      Alert.alert(
        "Erro",
        "Não foi possível sair da conta."
      );
    } finally {
      setLoggingOut(false);
    }
  }

  const nivel =
    user.pontos >= 500
      ? "Ouro 🥇"
      : user.pontos >= 200
      ? "Prata 🥈"
      : "Bronze 🥉";

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        padding: 20,
        paddingBottom: 120,
      }}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarLetter}>
          {user.nome.charAt(0).toUpperCase()}
        </Text>
      </View>

      <Text style={styles.nome}>
        {user.nome}
      </Text>

      {user.role === "ADMIN" && (
        <View style={styles.adminBadge}>
          <ShieldCheck size={14} color="#fff" />
          <Text style={styles.adminText}>
            ADMIN
          </Text>
        </View>
      )}

      <View style={styles.card}>
        <Trophy size={24} color="#F5A623" />

        <View style={{ marginLeft: 10 }}>
          <Text style={styles.cardLabel}>
            Pontos Fidelidade
          </Text>

          <Text style={styles.cardValue}>
            {user.pontos} pontos
          </Text>

          <Text style={styles.cardSmall}>
            {nivel}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>
        Informações da Conta
      </Text>

      <InfoRow
        icon={<Mail size={18} color="#E31837" />}
        label="E-mail"
        value={user.email ?? "-"}
      />

      {user.telefone && (
        <InfoRow
          icon={<Phone size={18} color="#E31837" />}
          label="Telefone"
          value={user.telefone}
        />
      )}

      <InfoRow
        icon={<Calendar size={18} color="#E31837" />}
        label="Cadastro"
        value={new Date(
          user.createdAt
        ).toLocaleDateString("pt-BR")}
      />

      <InfoRow
        icon={<Star size={18} color="#E31837" />}
        label="Nível"
        value={nivel}
      />

      

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() =>
          Alert.alert(
            "Excluir conta",
            "Deseja excluir sua conta?"
          )
        }
      >
        <Trash2 size={18} color="#fff" />
        <Text style={styles.buttonText}>
          Excluir Conta
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        disabled={loggingOut}
      >
        {loggingOut ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <LogOut size={18} color="#fff" />
            <Text style={styles.buttonText}>
              Sair da Conta
            </Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      {icon}

      <View style={{ marginLeft: 12 }}>
        <Text style={styles.infoLabel}>
          {label}
        </Text>

        <Text style={styles.infoValue}>
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0505",
  },

  center: {
    flex: 1,
    backgroundColor: "#0f0505",
    justifyContent: "center",
    alignItems: "center",
  },

  notLogged: {
    color: "#fff",
    marginTop: 10,
    marginBottom: 20,
  },

  loginButton: {
    backgroundColor: "#E31837",
    padding: 14,
    borderRadius: 12,
  },

  loginText: {
    color: "#fff",
    fontWeight: "bold",
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#E31837",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarLetter: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "bold",
  },

  nome: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },

  adminBadge: {
    alignSelf: "center",
    flexDirection: "row",
    backgroundColor: "#E31837",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 10,
  },

  adminText: {
    color: "#fff",
    marginLeft: 5,
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#1a0a0a",
    padding: 16,
    borderRadius: 16,
    marginTop: 25,
    flexDirection: "row",
    alignItems: "center",
  },

  cardLabel: { color: "#aaa" },
  cardValue: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  cardSmall: { color: "#aaa" },

  sectionTitle: {
    color: "#aaa",
    marginTop: 25,
    marginBottom: 10,
    fontWeight: "bold",
  },

  infoRow: {
    backgroundColor: "#1a0a0a",
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  infoLabel: {
    color: "#777",
    fontSize: 12,
  },

  infoValue: {
    color: "#fff",
    fontSize: 15,
  },

  editButton: {
    backgroundColor: "#E31837",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  deleteButton: {
    backgroundColor: "#6b1010",
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  logoutButton: {
    backgroundColor: "#2a0a0a",
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#E31837",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

