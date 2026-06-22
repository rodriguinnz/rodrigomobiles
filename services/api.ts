
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// ─── BASE URL CONFIGURADA ─────────────────────────────────────────────────────
//
// Seu IP da rede local descoberto via ipconfig: 192.168.0.117
const MEU_IP_REDE_LOCAL = "192.168.0.117";

const DEV_HOST = Platform.select({
  // Se for o Emulador Android, o IP 10.0.2.2 aponta para o localhost do seu PC
  android: "10.0.2.2", 
  // Se for dispositivo físico ou iOS, usa o IP da sua rede local
  ios: MEU_IP_REDE_LOCAL,
  default: MEU_IP_REDE_LOCAL,
});

// Junta o host correto com a porta 3334 que definimos no NestJS
export const BASE_URL = `http://${DEV_HOST}:3334/api/v1`;

// ─── Token helpers ────────────────────────────────────────────────────────────
const TOKEN_KEY = "@ifburguer:token";

export async function saveToken(token: string) {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}
export async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}
export async function removeToken() {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

// ─── Fetch com auth ───────────────────────────────────────────────────────────
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  } catch (err: any) {
    // Erro de rede (backend offline, IP errado, CORS etc.)
    throw new Error(
      `Não foi possível conectar ao servidor.\n\nVerifique:\n• O backend está rodando? (npm run dev)\n• BASE_URL está correto? (atual: ${BASE_URL})\n\nDetalhes: ${err?.message ?? err}`,
    );
  }

  if (!res.ok) {
    let msg = `Erro ${res.status}`;
    try {
      const data = await res.json();
      msg = Array.isArray(data?.message)
        ? data.message.join(". ")
        : (data?.message ?? msg);
    } catch {}
    throw new Error(msg);
  }

  if (res.status === 204) return undefined as unknown as T;
  return res.json();
}

// ─── Tipos ────────────────────────────────────────────────────────────────────
export type Role = "USER" | "ADMIN";

export interface Usuario {
  id: number;
  nome: string;
  email: string | null;
  telefone?: string | null;
  role: Role;
  pontos: number;
  createdAt: string;
  fotoPerfil?: string | null;
}

export interface Produto {
  id: number;
  titulo: string;
  categoria: string;
  descricao: string;
  foto: string;
  top: number;
  avaliacao: string | number;
  freteGratis: number;
  preco: string | number;
  desconto: number;
  fimDesconto?: string | null;
}

export interface CarrinhoItemInfo {
  produtoId: number;
  quantidade: number;
  preco: number;
  avaliacao: number;
  produto: {
    id: number;
    titulo: string;
    descricao: string;
    foto: string;
    avaliacao: string | number;
  };
  updatedAt: string;
}

export interface PedidoItem {
  pedidoId: number;
  produtoId: number;
  quantidade: number;
  preco: string | number;
  produto?: Produto;
}

export interface Pedido {
  id: number;
  data: string;
  usuarioId: number;
  itensPedido: PedidoItem[];
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, senha: string) =>
    request<{ user: Usuario; accessToken: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, senha }),
    }),

  register: (nome: string, email: string, senha: string, telefone?: string) =>
    request<{ user: Usuario; accessToken: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        nome,
        email,
        senha,
        telefone,
      }),
    }),

  me: () => request<{ user: Usuario }>("/auth/me"),

  logout: () =>
    request<{ ok: boolean }>("/auth/logout", {
      method: "POST",
    }),

  updateProfile: (
    payloadOrNome:
      | { nome: string; email: string; telefone?: string; fotoPerfil?: string }
      | string,
    emailArg?: string,
    telefoneArg?: string,
    fotoPerfilArg?: string,
  ) => {
    const payload =
      typeof payloadOrNome === "object"
        ? payloadOrNome
        : {
            nome: payloadOrNome as string,
            email: emailArg as string,
            telefone: telefoneArg,
            fotoPerfil: fotoPerfilArg,
          };

    return request<{ user: Usuario }>("/auth/profile", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
  deleteAccount: () =>
    request<{ ok: boolean; message: string }>("/auth/delete-account", {
      method: "DELETE",
    }),

  redeem: (pontos: number) =>
    request<{ user: { id: number; pontos: number } }>("/auth/redeem", {
      method: "POST",
      body: JSON.stringify({ pontos }),
    }),
};

// ─── Produtos ─────────────────────────────────────────────────────────────────
export const produtosApi = {
  getAll: () => request<Produto[]>("/produtos"),
  getById: (id: number) => request<Produto>(`/produtos/${id}`),
  getByCategoria: (categoria: string) =>
    request<Produto[]>(`/produtos/categoria/${encodeURIComponent(categoria)}`),
  getTop: () => request<Produto[]>("/produtos/top"),
  getPromocoes: () => request<Produto[]>("/produtos/promocoes"),
};

// ─── Carrinho ─────────────────────────────────────────────────────────────────
export interface SyncItem {
  produtoId: number;
  quantidade: number;
  preco: number;
  avaliacao?: number;
}

export const carrinhoApi = {
  get: () => request<{ itens: CarrinhoItemInfo[] }>("/carrinho"),
  sync: (itens: SyncItem[]) =>
    request<{ itens: CarrinhoItemInfo[] }>("/carrinho", {
      method: "PUT",
      body: JSON.stringify({ itens }),
    }),
  clear: () => request<{ ok: boolean }>("/carrinho", { method: "DELETE" }),
};

// ─── Pedidos ──────────────────────────────────────────────────────────────────
export interface ConfirmItem {
  produtoId: number;
  quantidade: number;
  preco: number;
}

export const pedidosApi = {
  confirmar: (itens: ConfirmItem[]) =>
    request<Pedido>("/pedidos/confirmar", {
      method: "POST",
      body: JSON.stringify({ itens }),
    }),
  historico: () => request<Pedido[]>("/pedidos/historico"),
};