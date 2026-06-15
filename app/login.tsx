import React, { useState } from "react";
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, Alert, ActivityIndicator,
} from "react-native";
import { Mail, Lock, User, Phone } from "lucide-react-native";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";

export default function Login() {
  const { login, register, loading: authLoading } = useAuth();
  const router = useRouter();

  const [isSignUp, setIsSignUp] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email.trim() || !senha.trim()) {
      Alert.alert("Atenção", "Preencha e-mail e senha.");
      return;
    }
    if (isSignUp && !nome.trim()) {
      Alert.alert("Atenção", "Preencha seu nome.");
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await register(nome.trim(), email.trim(), senha, telefone.trim() || undefined);
      } else {
        await login(email.trim(), senha);
      }
      router.replace("/home");
    } catch (e: any) {
      Alert.alert("Erro", e?.message ?? "Não foi possível autenticar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>
        <Text style={{ color: "#fff" }}>IF</Text>
        <Text style={{ color: "#ffcc00" }}>BURGUER</Text>
      </Text>

      <Text style={styles.subtitle}>
        {isSignUp ? "Crie sua conta 🍔" : "Entre na sua conta 🍔"}
      </Text>

      {isSignUp && (
        <View style={styles.inputBox}>
          <User size={20} color="#aaa" />
          <TextInput
            placeholder="Nome"
            placeholderTextColor="#777"
            style={styles.input}
            value={nome}
            onChangeText={setNome}
          />
        </View>
      )}

      <View style={styles.inputBox}>
        <Mail size={20} color="#aaa" />
        <TextInput
          placeholder="E-mail"
          placeholderTextColor="#777"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputBox}>
        <Lock size={20} color="#aaa" />
        <TextInput
          placeholder="Senha"
          placeholderTextColor="#777"
          secureTextEntry
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
        />
      </View>

      {isSignUp && (
        <View style={styles.inputBox}>
          <Phone size={20} color="#aaa" />
          <TextInput
            placeholder="Telefone (opcional)"
            placeholderTextColor="#777"
            style={styles.input}
            value={telefone}
            onChangeText={setTelefone}
            keyboardType="phone-pad"
          />
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleSubmit}
        disabled={loading || authLoading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {isSignUp ? "Cadastrar" : "Entrar"}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
        <Text style={styles.switch}>
          {isSignUp ? "Já tem conta? Entrar" : "Não tem conta? Criar agora"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0505",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: { fontSize: 34, fontWeight: "900", marginBottom: 10 },
  subtitle: { color: "#aaa", marginBottom: 30 },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    width: "100%",
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 12,
    height: 50,
    gap: 10,
  },
  input: { flex: 1, color: "#fff" },
  button: {
    backgroundColor: "#E31837",
    width: "100%",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  switch: { color: "#aaa", marginTop: 20 },
});
