import {
  View, Text, ScrollView, TouchableOpacity,
  Image, Animated, ActivityIndicator,
} from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { produtosApi, BASE_URL, type Produto } from '@/services/api';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Star, WifiOff, RefreshCw } from 'lucide-react-native';

type Categoria = 'burgers' | 'bebidas' | 'combos' | 'sobremesas' | 'acompanhamentos';

const categorias: { id: Categoria; label: string; icon: string }[] = [
  { id: 'burgers',        label: 'Burgers',        icon: '🔥' },
  { id: 'combos',         label: 'Combos',          icon: '🍟' },
  { id: 'bebidas',        label: 'Bebidas',         icon: '🥤' },
  { id: 'sobremesas',     label: 'Sobremesas',      icon: '🍰' },
  { id: 'acompanhamentos',label: 'Acompanhamentos', icon: '🍗' },
];

export default function Cardapio() {
  const [categoria, setCategoria] = useState<Categoria>('burgers');
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const { addItem } = useCart();

  useEffect(() => { fetchCategoria('burgers'); }, []);

  async function fetchCategoria(cat: Categoria) {
    setLoading(true);
    setError('');
    try {
      const data = await produtosApi.getByCategoria(cat);
      setProdutos(data);
    } catch (e: any) {
      setError(e?.message ?? 'Erro ao carregar produtos.');
      setProdutos([]);
    } finally {
      setLoading(false);
    }
  }

  function trocarCategoria(nova: Categoria) {
    Animated.timing(fadeAnim, { toValue: 0, duration: 120, useNativeDriver: true }).start(() => {
      setCategoria(nova);
      fetchCategoria(nova).then(() => {
        Animated.timing(fadeAnim, { toValue: 1, duration: 120, useNativeDriver: true }).start();
      });
    });
  }

  const fmtPreco = (p: string | number) =>
    `R$ ${Number(p).toFixed(2).replace('.', ',')}`;
  const precoFinal = (p: Produto) => {
    const base = Number(p.preco);
    return p.desconto > 0 ? base * (1 - p.desconto / 100) : base;
  };

  return (
    <ScrollView style={{ backgroundColor: '#0f0505' }}>
      <View style={{ padding: 20 }}>
        <Text style={{ color: '#fff', fontSize: 32, fontWeight: '900' }}>Cardápio</Text>
        <Text style={{ color: '#666', marginBottom: 20 }}>Escolha seus favoritos</Text>

        {/* CATEGORIAS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categorias.map((cat) => {
            const active = categoria === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => trocarCategoria(cat.id)}
                style={{
                  flexDirection: 'row', alignItems: 'center',
                  backgroundColor: active ? '#fff' : '#1a0a0a',
                  paddingVertical: 10, paddingHorizontal: 16,
                  borderRadius: 30, marginRight: 10,
                }}
              >
                <Text style={{ marginRight: 5 }}>{cat.icon}</Text>
                <Text style={{ color: active ? '#000' : '#aaa', fontWeight: '600' }}>{cat.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={{ height: 1, backgroundColor: '#222', marginVertical: 20 }} />

        {loading && (
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <ActivityIndicator color="#E31837" size="large" />
            <Text style={{ color: '#555', marginTop: 12, fontSize: 12 }}>Conectando ao servidor...</Text>
          </View>
        )}

        {/* ERRO */}
        {error !== '' && !loading && (
          <View style={{
            backgroundColor: '#1a0505', borderRadius: 14, padding: 16,
            borderWidth: 1, borderColor: '#5a0000', alignItems: 'center', gap: 10,
          }}>
            <WifiOff size={28} color="#E31837" />
            <Text style={{ color: '#E31837', fontWeight: '700', textAlign: 'center' }}>
              Erro ao conectar
            </Text>
            <Text style={{ color: '#aaa', fontSize: 12, textAlign: 'center' }}>
              {BASE_URL}
            </Text>
            <Text style={{ color: '#777', fontSize: 11, textAlign: 'center' }}>
              Backend está rodando? IP correto?{'\n'}Edite BASE_URL em services/api.ts
            </Text>
            <TouchableOpacity
              onPress={() => fetchCategoria(categoria)}
              style={{
                flexDirection: 'row', alignItems: 'center', gap: 6,
                backgroundColor: '#E31837', paddingHorizontal: 18,
                paddingVertical: 10, borderRadius: 10,
              }}
            >
              <RefreshCw size={16} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '700' }}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && error === '' && (
          <Animated.View style={{ opacity: fadeAnim }}>
            {produtos.length === 0 && (
              <Text style={{ color: '#666', textAlign: 'center', marginTop: 20 }}>
                Nenhum produto nessa categoria.
              </Text>
            )}

            {/* BURGERS → GRID */}
            {categoria === 'burgers' && (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                {produtos.map((item) => (
                  <View key={item.id} style={{
                    width: '48%', backgroundColor: '#1a0a0a', borderRadius: 16,
                    marginBottom: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#2a2a2a',
                  }}>
                    <Image source={{ uri: item.foto }} style={{ height: 120 }} />
                    {item.top === 1 && (
                      <Text style={{
                        position: 'absolute', top: 8, left: 8,
                        backgroundColor: '#F5A623', padding: 5, borderRadius: 20,
                        fontSize: 10, fontWeight: '900',
                      }}>🔥 TOP</Text>
                    )}
                    {item.desconto > 0 && (
                      <Text style={{
                        position: 'absolute', top: 8, right: 8,
                        backgroundColor: '#E31837', color: '#fff',
                        padding: 5, borderRadius: 20, fontSize: 10, fontWeight: '900',
                      }}>-{item.desconto}%</Text>
                    )}
                    <View style={{ padding: 10 }}>
                      <Text style={{ color: '#fff', fontWeight: '700' }}>{item.titulo}</Text>
                      <Text style={{ color: '#777', fontSize: 11 }} numberOfLines={2}>{item.descricao}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                        <Star size={10} color="#F5A623" fill="#F5A623" />
                        <Text style={{ color: '#aaa', fontSize: 10, marginLeft: 3 }}>
                          {Number(item.avaliacao).toFixed(1)}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                        <View>
                          {item.desconto > 0 && (
                            <Text style={{ color: '#666', fontSize: 10, textDecorationLine: 'line-through' }}>
                              {fmtPreco(item.preco)}
                            </Text>
                          )}
                          <Text style={{ color: '#E31837', fontWeight: '900' }}>
                            {fmtPreco(precoFinal(item))}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => addItem(item)}
                          style={{ backgroundColor: '#E31837', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 }}
                        >
                          <Text style={{ color: '#fff', fontSize: 11 }}>+ Add</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* OUTRAS → LISTA */}
            {categoria !== 'burgers' && (
              <View>
                {produtos.map((item) => (
                  <View key={item.id} style={{
                    backgroundColor: '#1a0a0a', borderRadius: 18, marginBottom: 14,
                    overflow: 'hidden', borderWidth: 1, borderColor: '#2a2a2a',
                  }}>
                    <Image source={{ uri: item.foto }} style={{ height: 160 }} />
                    {item.desconto > 0 && (
                      <Text style={{
                        position: 'absolute', top: 10, right: 10,
                        backgroundColor: '#E31837', color: '#fff',
                        padding: 6, borderRadius: 20, fontSize: 12, fontWeight: '900',
                      }}>-{item.desconto}%</Text>
                    )}
                    <View style={{ padding: 14 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>{item.titulo}</Text>
                          <Text style={{ color: '#777', marginTop: 4 }} numberOfLines={2}>{item.descricao}</Text>
                          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                            <Star size={12} color="#F5A623" fill="#F5A623" />
                            <Text style={{ color: '#aaa', fontSize: 11, marginLeft: 4 }}>
                              {Number(item.avaliacao).toFixed(1)}
                            </Text>
                          </View>
                          {item.desconto > 0 && (
                            <Text style={{ color: '#666', fontSize: 12, textDecorationLine: 'line-through', marginTop: 4 }}>
                              {fmtPreco(item.preco)}
                            </Text>
                          )}
                          <Text style={{ color: '#E31837', fontWeight: '900', marginTop: 4 }}>
                            {fmtPreco(precoFinal(item))}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => addItem(item)}
                          style={{
                            backgroundColor: '#E31837', padding: 10,
                            borderRadius: 12, marginLeft: 10, alignItems: 'center',
                          }}
                        >
                          <ShoppingCart size={18} color="#fff" />
                          <Text style={{ color: '#fff', fontSize: 10, marginTop: 2 }}>Add</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </Animated.View>
        )}
      </View>
    </ScrollView>
  );
}
