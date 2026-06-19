import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { authApi } from "@/services/api";
import * as ImagePicker from "expo-image-picker";
import {
  User,
  Mail,
  Phone,
  Camera,
  Save,
  ArrowLeft,
} from "lucide-react-native";

export default function EditarPerfil() {
  const router = useRouter();

  const {
    user,
    refreshUser,
  } = useAuth();

  const [nome, setNome] = useState(user?.nome ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [telefone, setTelefone] = useState(user?.telefone ?? "");
  const [fotoPerfil, setFotoPerfil] = useState(
    user?.fotoPerfil ?? ""
  );

  const [loading, setLoading] = useState(false);

  async function selecionarFoto() {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permissão necessária",
        "Permita acesso às fotos."
      );
      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

    if (!result.canceled) {
      setFotoPerfil(result.assets[0].uri);
    }
  }

  async function salvarPerfil() {
    try {
      setLoading(true);

      await authApi.updateProfile({
        nome,
        email,
        telefone,
        fotoPerfil,
      });

      await refreshUser();

      Alert.alert(
        "Sucesso",
        "Perfil atualizado com sucesso!"
      );

      router.back();
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error?.message ??
          "Não foi possível atualizar o perfil."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <ArrowLeft size={22} color="#fff" />
      </TouchableOpacity>

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={selecionarFoto}
        >
          {fotoPerfil ? (
            <Image
              source={{ uri: fotoPerfil }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarLetter}>
                {nome.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}

          <View style={styles.cameraButton}>
            <Camera size={18} color="#fff" />
          </View>
        </TouchableOpacity>

        <Text style={styles.title}>
          Editar Perfil
        </Text>

        <Text style={styles.subtitle}>
          Atualize suas informações
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>
          Nome
        </Text>

        <View style={styles.inputContainer}>
          <User size={20} color="#E31837" />

          <TextInput
            value={nome}
            onChangeText={setNome}
            style={styles.input}
            placeholder="Seu nome"
            placeholderTextColor="#666"
          />
        </View>

        <Text style={styles.label}>
          Email
        </Text>

        <View style={styles.inputContainer}>
          <Mail size={20} color="#E31837" />

          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholder="Seu email"
            placeholderTextColor="#666"
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <Text style={styles.label}>
          Telefone
        </Text>

        <View style={styles.inputContainer}>
          <Phone size={20} color="#E31837" />

          <TextInput
            value={telefone ?? ""}
            onChangeText={setTelefone}
            style={styles.input}
            placeholder="Seu telefone"
            placeholderTextColor="#666"
            keyboardType="phone-pad"
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={salvarPerfil}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Save size={20} color="#fff" />
            <Text style={styles.saveText}>
              Salvar Alterações
            </Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0505",
  },

  content: {
    padding: 24,
    paddingBottom: 120,
  },

  backButton: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#1a0a0a",
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    alignItems: "center",
    marginTop: 20,
  },

  avatarContainer: {
    position: "relative",
  },

  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#E31837",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#2d0f14",
  },

  avatarLetter: {
    color: "#fff",
    fontSize: 48,
    fontWeight: "bold",
  },

  cameraButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#E31837",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#0f0505",
  },

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 20,
  },

  subtitle: {
    color: "#888",
    marginTop: 6,
  },

  card: {
    marginTop: 30,
    backgroundColor: "#1a0a0a",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "#2c2c2c",
  },

  label: {
    color: "#aaa",
    marginBottom: 8,
    marginTop: 10,
    fontWeight: "600",
  },

  inputContainer: {
    height: 58,
    backgroundColor: "#111",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#2c2c2c",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  input: {
    flex: 1,
    color: "#fff",
    marginLeft: 12,
    fontSize: 15,
  },

  saveButton: {
    backgroundColor: "#E31837",
    height: 60,
    borderRadius: 16,
    marginTop: 25,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  saveText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});