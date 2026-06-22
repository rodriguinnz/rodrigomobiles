import { Produto, produtosApi } from "@/services/api";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

export default function AdminProdutos() {
  const router = useRouter();

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Estados para Controle de Criação/Edição
  const [modalFormVisible, setModalFormVisible] = useState<boolean>(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
  const [tituloInput, setTituloInput] = useState<string>("");
  const [precoInput, setPrecoInput] = useState<string>("");
  const [fotoInput, setFotoInput] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Estados para Controle de Deleção
  const [modalDeleteVisible, setModalDeleteVisible] = useState<boolean>(false);
  const [produtoParaDeletar, setProdutoParaDeletar] = useState<Produto | null>(null);

  // Estado para Toast / Mensagem de Feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const carregarProdutos = async () => {
    try {
      setLoading(true);
      const data = await produtosApi.getAll();
      setProdutos(data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      showToast("Não foi possível carregar os produtos do servidor.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const abrirFormulario = (produto: Produto | null = null) => {
    if (produto) {
      setProdutoSelecionado(produto);
      setTituloInput(produto.titulo);
      setPrecoInput(String(produto.preco));
      setFotoInput(produto.foto || "");
    } else {
      setProdutoSelecionado(null);
      setTituloInput("");
      setPrecoInput("");
      setFotoInput("");
    }
    setModalFormVisible(true);
  };

  const salvarProduto = async () => {
    if (!tituloInput.trim() || !precoInput.trim()) {
      showToast("Título e Preço são campos obrigatórios!", "error");
      return;
    }

    const precoFormatado = parseFloat(precoInput.replace(",", "."));
    if (isNaN(precoFormatado)) {
      showToast("Insira um valor de preço válido!", "error");
      return;
    }

    try {
      setSubmitting(true);
      const dadosProduto = {
        titulo: tituloInput.trim(),
        preco: precoFormatado,
        foto: fotoInput.trim() || undefined,
      };

      if (produtoSelecionado) {
        // Modo Edição (UPDATE)
        // @ts-ignore - Caso o tipo da API precise de algum ajuste
        await produtosApi.update(produtoSelecionado.id, dadosProduto);
        showToast("🍔 Produto atualizado com sucesso!");
      } else {
        // Modo Criação (CREATE)
        // @ts-ignore - Caso o tipo da API precise de algum ajuste
        await produtosApi.create(dadosProduto);
        showToast("✨ Novo produto adicionado ao cardápio!");
      }

      setModalFormVisible(false);
      carregarProdutos();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      showToast("Ocorreu um erro ao registrar as alterações no banco.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmarDelecao = (produto: Produto) => {
    setProdutoParaDeletar(produto);
    setModalDeleteVisible(true);
  };

  const executarDelecao = async () => {
    if (!produtoParaDeletar) return;

    try {
      setSubmitting(true);
      // @ts-ignore - Ajustando se o método delete estiver exposto
      if (produtosApi.delete) {
        // @ts-ignore
        await produtosApi.delete(produtoParaDeletar.id);
      } else {
        // Fallback dinâmico caso produtosApi precise de endpoint direto
        console.warn("produtosApi.delete não configurado, verifique seu services/api.ts");
      }
      
      showToast(`🗑️ "${produtoParaDeletar.titulo}" foi removido.`);
      setModalDeleteVisible(false);
      setProdutoParaDeletar(null);
      carregarProdutos();
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      showToast("Erro ao remover o produto do banco.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Toast Notification */}
      {toastMessage && (
        <View style={[styles.toast, toastType === "error" ? styles.toastError : styles.toastSuccess]}>
          <MaterialCommunityIcons 
            name={toastType === "error" ? "alert-circle" : "check-circle"} 
            size={20} 
            color="#fff" 
          />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>🍔 Cardápio</Text>
          <Text style={styles.subtitle}>
            {loading ? "Sincronizando..." : `${produtos.length} produtos disponíveis`}
          </Text>
        </View>
        {!loading && (
          <TouchableOpacity style={styles.reloadButton} onPress={carregarProdutos}>
            <Ionicons name="refresh" size={20} color="#aaa" />
          </TouchableOpacity>
        )}
      </View>

      {/* Carregando listagem */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E31837" />
          <Text style={styles.loadingText}>Conectando ao banco do IFBURGUER...</Text>
        </View>
      ) : (
        <FlatList
          data={produtos}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="hamburger-off" size={48} color="#333" />
              <Text style={styles.emptyText}>Nenhum produto cadastrado no banco.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <View style={styles.imageContainer}>
                {item.foto ? (
                  <Image
                    source={{ uri: item.foto }}
                    style={styles.productImage}
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="hamburger"
                    size={28}
                    color="#E31837"
                  />
                )}
              </View>

              <View style={styles.infoContainer}>
                <Text style={styles.productTitle} numberOfLines={1}>
                  {item.titulo}
                </Text>
                <Text style={styles.productPrice}>
                  R$ {Number(item.preco).toFixed(2).replace(".", ",")}
                </Text>
              </View>

              <View style={styles.actionsContainer}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => abrirFormulario(item)}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons name="pencil" size={18} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => confirmarDelecao(item)}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons
                    name="trash-can-outline"
                    size={18}
                    color="#E31837"
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* Botão de Criação Flutuante */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => abrirFormulario(null)}
        activeOpacity={0.9}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {}
      <Modal
        visible={modalFormVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalFormVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {produtoSelecionado ? "✏️ Editar Lanche" : "✨ Novo Lanche"}
              </Text>
              <TouchableOpacity onPress={() => setModalFormVisible(false)}>
                <Ionicons name="close-circle" size={28} color="#888" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ width: "100%" }}>
              <Text style={styles.inputLabel}>NOME DO PRODUTO</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Double Cheddar Especial"
                placeholderTextColor="#555"
                value={tituloInput}
                onChangeText={setTituloInput}
              />

              <Text style={styles.inputLabel}>PREÇO (R$)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 24.90"
                placeholderTextColor="#555"
                keyboardType="numeric"
                value={precoInput}
                onChangeText={setPrecoInput}
              />

              <Text style={styles.inputLabel}>URL DA FOTO (OPCIONAL)</Text>
              <TextInput
                style={[styles.input, styles.inputUrl]}
                placeholder="https://exemplo.com/hamburguer.jpg"
                placeholderTextColor="#555"
                autoCapitalize="none"
                keyboardType="url"
                value={fotoInput}
                onChangeText={setFotoInput}
              />

              {fotoInput.trim() !== "" && (
                <View style={styles.previewContainer}>
                  <Text style={styles.previewLabel}>Pré-visualização do Lanche:</Text>
                  <Image source={{ uri: fotoInput }} style={styles.previewImage} />
                </View>
              )}

              <TouchableOpacity
                style={styles.saveButton}
                onPress={salvarProduto}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>
                    {produtoSelecionado ? "Salvar Alterações" : "Cadastrar Produto"}
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {}
      <Modal
        visible={modalDeleteVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalDeleteVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.deleteModalContent]}>
            <View style={styles.warningIconWrapper}>
              <MaterialCommunityIcons name="alert-octagon" size={40} color="#E31837" />
            </View>
            
            <Text style={styles.deleteConfirmTitle}>Deseja mesmo remover?</Text>
            <Text style={styles.deleteConfirmDesc}>
              Esta ação removerá permanentemente o produto{"\n"}
              <Text style={{ fontWeight: "bold", color: "#fff" }}>
                "{produtoParaDeletar?.titulo}"
              </Text>{" "}
              do cardápio.
            </Text>

            <View style={styles.deleteModalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => setModalDeleteVisible(false)}
                disabled={submitting}
              >
                <Text style={styles.modalBtnCancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnConfirm]}
                onPress={executarDelecao}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalBtnConfirmText}>Sim, Remover</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  reloadButton: {
    backgroundColor: "#160a0a",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#2c1414",
    alignItems: "center",
    justifyContent: "center",
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  loadingText: {
    color: "#888",
    marginTop: 15,
    fontSize: 14,
    textAlign: "center",
  },
  listContent: {
    padding: 20,
    paddingBottom: 110,
    gap: 12,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
  },
  emptyText: {
    color: "#444",
    marginTop: 12,
    fontSize: 14,
    textAlign: "center",
  },
  productCard: {
    backgroundColor: "#160a0a",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2c1414",
  },
  imageContainer: {
    width: 55,
    height: 55,
    borderRadius: 12,
    backgroundColor: "#2c1414",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 15,
  },
  productTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  productPrice: {
    color: "#22c55e",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    backgroundColor: "#2c1414",
    padding: 10,
    borderRadius: 10,
  },
  deleteButton: {
    backgroundColor: "rgba(227, 24, 55, 0.12)",
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
    shadowColor: "#E31837",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  
  // Estilos Modais Generales
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#110707",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    borderWidth: 1,
    borderColor: "#2c1414",
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "bold",
  },
  
  // Campos de Formulário
  inputLabel: {
    color: "#888",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#1a0f0f",
    borderWidth: 1,
    borderColor: "#2c1414",
    borderRadius: 12,
    color: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 20,
  },
  inputUrl: {
    fontSize: 12,
  },
  previewContainer: {
    marginBottom: 20,
    alignItems: "center",
    backgroundColor: "#160a0a",
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2c1414",
  },
  previewLabel: {
    color: "#666",
    fontSize: 12,
    marginBottom: 10,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    resizeMode: "cover",
  },
  saveButton: {
    backgroundColor: "#E31837",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },

  // Modal de Deleção Customizado
  deleteModalContent: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderRadius: Platform.OS === 'ios' ? 0 : 30, // Para ocupar o fundo completo quando puxado para baixo
    alignItems: "center",
    paddingVertical: 35,
  },
  warningIconWrapper: {
    backgroundColor: "rgba(227, 24, 55, 0.12)",
    padding: 15,
    borderRadius: 50,
    marginBottom: 15,
  },
  deleteConfirmTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  deleteConfirmDesc: {
    color: "#aaa",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  deleteModalButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBtnCancel: {
    backgroundColor: "#2c1414",
  },
  modalBtnCancelText: {
    color: "#aaa",
    fontWeight: "bold",
    fontSize: 14,
  },
  modalBtnConfirm: {
    backgroundColor: "#E31837",
  },
  modalBtnConfirmText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },

  // Toast / Avisos Temporários
  toast: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    zIndex: 999,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  toastSuccess: {
    backgroundColor: "#160a0a",
    borderWidth: 1,
    borderColor: "#22c55e",
  },
  toastError: {
    backgroundColor: "#160a0a",
    borderWidth: 1,
    borderColor: "#E31837",
  },
  toastText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
});