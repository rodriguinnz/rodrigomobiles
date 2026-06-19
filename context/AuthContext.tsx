import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  authApi,
  getToken,
  removeToken,
  saveToken,
  type Usuario,
} from "../services/api";

interface AuthState {
  user: Usuario | null;
  token: string | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, senha: string) => Promise<void>;

  register: (
    nome: string,
    email: string,
    senha: string,
    telefone?: string,
  ) => Promise<void>;

  logout: () => Promise<void>;

  refreshUser: () => Promise<void>;

  updateProfile: (
    nome: string,
    email: string,
    telefone?: string,
    fotoPerfil?: string,
  ) => Promise<void>;

  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    loading: true,
  });

  useEffect(() => {
    loadSession();
  }, []);

  async function loadSession() {
    try {
      const token = await getToken();

      if (!token) {
        setState({
          user: null,
          token: null,
          loading: false,
        });
        return;
      }

      const { user } = await authApi.me();

      setState({
        user,
        token,
        loading: false,
      });
    } catch (error) {
      console.log("Erro ao carregar sessão:", error);

      await removeToken();

      setState({
        user: null,
        token: null,
        loading: false,
      });
    }
  }

  const login = useCallback(async (email: string, senha: string) => {
    const { user, accessToken } = await authApi.login(email, senha);

    await saveToken(accessToken);

    setState({
      user,
      token: accessToken,
      loading: false,
    });
  }, []);

  const register = useCallback(
    async (nome: string, email: string, senha: string, telefone?: string) => {
      const { user, accessToken } = await authApi.register(
        nome,
        email,
        senha,
        telefone,
      );

      await saveToken(accessToken);

      setState({
        user,
        token: accessToken,
        loading: false,
      });
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {}

    await removeToken();

    setState({
      user: null,
      token: null,
      loading: false,
    });

    console.log("Usuário deslogado");
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const { user } = await authApi.me();

      setState((prev) => ({
        ...prev,
        user,
      }));
    } catch (error) {
      console.log("Erro ao atualizar usuário:", error);
    }
  }, []);

  const updateProfile = useCallback(
    async (
      nome: string,
      email: string,
      telefone?: string,
      fotoPerfil?: string,
    ) => {
      // Call authApi.updateProfile using an object payload (matches editar-perfil)
      const { user } = await authApi.updateProfile({
        nome,
        email,
        telefone,
        fotoPerfil,
      });

      setState((prev) => ({
        ...prev,
        user,
      }));
    },
    [],
  );

  const deleteAccount = useCallback(async () => {
    await authApi.deleteAccount();

    await removeToken();

    setState({
      user: null,
      token: null,
      loading: false,
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        refreshUser,
        updateProfile,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro do AuthProvider");
  }

  return context;
}
