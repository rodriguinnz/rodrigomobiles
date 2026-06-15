import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { carrinhoApi, pedidosApi, type Produto } from '../services/api';
import { useAuth } from './AuthContext';

export interface CartItem {
  produtoId: number;
  titulo: string;
  descricao: string;
  foto: string;
  quantidade: number;
  preco: number;
}

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (produto: Produto) => void;
  removeItem: (produtoId: number) => void;
  updateQty: (produtoId: number, qty: number) => void;
  clearCart: () => void;
  confirmOrder: () => Promise<void>;
  loadingSync: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loadingSync, setLoadingSync] = useState(false);

  // Carrega carrinho do servidor quando usuário loga
  useEffect(() => {
    if (user) {
      (async () => {
        try {
          const { itens } = await carrinhoApi.get();
          setItems(
            itens.map(i => ({
              produtoId: i.produtoId,
              titulo: i.produto.titulo,
              descricao: i.produto.descricao,
              foto: i.produto.foto,
              quantidade: i.quantidade,
              preco: i.preco,
            }))
          );
        } catch {}
      })();
    } else {
      // Limpa cart local ao deslogar
      setItems([]);
    }
  }, [user?.id]);

  // Sincroniza com o servidor sempre que items muda (só se logado)
  const syncToServer = useCallback(async (newItems: CartItem[]) => {
    if (!user) return;
    try {
      setLoadingSync(true);
      await carrinhoApi.sync(
        newItems.map(i => ({
          produtoId: i.produtoId,
          quantidade: i.quantidade,
          preco: i.preco,
        }))
      );
    } catch {} finally {
      setLoadingSync(false);
    }
  }, [user]);

  const addItem = useCallback((produto: Produto) => {
    setItems(prev => {
      const existing = prev.find(i => i.produtoId === produto.id);
      let next: CartItem[];
      if (existing) {
        next = prev.map(i =>
          i.produtoId === produto.id ? { ...i, quantidade: i.quantidade + 1 } : i
        );
      } else {
        next = [
          ...prev,
          {
            produtoId: produto.id,
            titulo: produto.titulo,
            descricao: produto.descricao,
            foto: produto.foto,
            quantidade: 1,
            preco: Number(produto.preco),
          },
        ];
      }
      syncToServer(next);
      return next;
    });
  }, [syncToServer]);

  const removeItem = useCallback((produtoId: number) => {
    setItems(prev => {
      const next = prev.filter(i => i.produtoId !== produtoId);
      syncToServer(next);
      return next;
    });
  }, [syncToServer]);

  const updateQty = useCallback((produtoId: number, qty: number) => {
    setItems(prev => {
      const next =
        qty <= 0
          ? prev.filter(i => i.produtoId !== produtoId)
          : prev.map(i => (i.produtoId === produtoId ? { ...i, quantidade: qty } : i));
      syncToServer(next);
      return next;
    });
  }, [syncToServer]);

  const clearCart = useCallback(() => {
    setItems([]);
    if (user) {
      carrinhoApi.clear().catch(() => {});
    }
  }, [user]);

  const confirmOrder = useCallback(async () => {
    if (!user) throw new Error('Faça login para confirmar o pedido.');
    if (items.length === 0) throw new Error('Seu carrinho está vazio.');
    setLoadingSync(true);
    try {
      await pedidosApi.confirmar(
        items.map(i => ({
          produtoId: i.produtoId,
          quantidade: i.quantidade,
          preco: i.preco,
        }))
      );
      setItems([]);
      await carrinhoApi.clear().catch(() => {});
    } finally {
      setLoadingSync(false);
    }
  }, [user, items]);

  const totalItems = items.reduce((s, i) => s + i.quantidade, 0);
  const totalPrice = items.reduce((s, i) => s + i.preco * i.quantidade, 0);

  return (
    <CartContext.Provider
      value={{ items, totalItems, totalPrice, addItem, removeItem, updateQty, clearCart, confirmOrder, loadingSync }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart deve ser usado dentro de CartProvider');
  return ctx;
}
