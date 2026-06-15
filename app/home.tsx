import {
  View, Text, ScrollView, Image,
  TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { produtosApi, BASE_URL, type Produto } from '@/services/api';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Star, WifiOff, RefreshCw } from 'lucide-react-native';

export default function Home() {
  const [topProdutos, setTopProdutos] = useState<Produto[]>([]);
  const [promos, setPromos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addItem } = useCart();
  const { user } = useAuth();

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const [top, promo] = await Promise.all([
        produtosApi.getTop(),
        produtosApi.getPromocoes(),
      ]);
      setTopProdutos(top);
      setPromos(promo);
    } catch (e: any) {
      setError(e?.message ?? 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }

  const fmtPreco = (p: string | number) =>
    `R$ ${Number(p).toFixed(2).replace('.', ',')}`;
  const precoFinal = (prod: Produto) => {
    const base = Number(prod.preco);
    return prod.desconto > 0 ? base * (1 - prod.desconto / 100) : base;
  };

  return (
    <ScrollView style={{ backgroundColor: '#0f0505' }}>
      <View style={{ padding: 20, maxWidth: 430, alignSelf: 'center' }}>

        {/* HERO */}
        <LinearGradient
          colors={['#1a0a0a', '#0f0505']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={{ borderRadius: 25, padding: 22 }}
        >
          <Text style={{ color: '#F5A623', fontSize: 13 }}>🔥 GRELHADO NA BRASA</Text>
          <View style={{ flexDirection: 'row', marginTop: 12, alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              {user && (
                <Text style={{ color: '#F5A623', fontSize: 13, marginBottom: 4 }}>
                  Olá, {user.nome.split(' ')[0]}! 👋
                </Text>
              )}
              <Text style={{ color: '#fff', fontSize: 32, fontWeight: '900' }}>SABOR QUE</Text>
              <Text style={{ color: '#E31837', fontSize: 32, fontWeight: '900' }}>CONQUISTA</Text>
              <Text style={{ color: '#aaa', marginTop: 10 }}>Hambúrgueres artesanais premium.</Text>
            </View>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd' }}
              style={{ width: 110, height: 110, borderRadius: 20, marginLeft: 10 }}
            />
          </View>
          <View style={{ flexDirection: 'row', marginTop: 18 }}>
            <TouchableOpacity
              onPress={() => router.push('/cardapio')}
              style={{
                backgroundColor: '#E31837', paddingVertical: 16,
                borderRadius: 30, flex: 1, alignItems: 'center', marginRight: 10,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '700' }}>Ver Cardápio →</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/promos')}
              style={{
                borderWidth: 1, borderColor: '#444',
                paddingVertical: 16, paddingHorizontal: 20, borderRadius: 30,
              }}
            >
              <Text style={{ color: '#fff' }}>PROMOS</Text>
            </TouchableOpacity>
          </View>
          <View style={{
            flexDirection: 'row', justifyContent: 'space-between', marginTop: 18,
            backgroundColor: '#0f0505', padding: 12, borderRadius: 12,
            borderWidth: 1, borderColor: '#2a2a2a',
          }}>
            <Text style={{ color: '#fff' }}>🍔 50+ Produtos</Text>
            <Text style={{ color: '#fff' }}>⏱ 30 min</Text>
            <Text style={{ color: '#fff' }}>⭐ 4.9</Text>
          </View>
        </LinearGradient>

        {/* ERRO DE CONEXÃO */}
        {error !== '' && !loading && (
          <View style={{
            backgroundColor: '#1a0505', borderRadius: 14, padding: 16,
            marginTop: 20, borderWidth: 1, borderColor: '#5a0000',
            alignItems: 'center', gap: 10,
          }}>
            <WifiOff size={28} color="#E31837" />
            <Text style={{ color: '#E31837', fontWeight: '700', textAlign: 'center' }}>
              Sem conexão com o servidor
            </Text>
            <Text style={{ color: '#aaa', fontSize: 12, textAlign: 'center' }}>
              Backend URL: {BASE_URL}
            </Text>
            <Text style={{ color: '#777', fontSize: 11, textAlign: 'center' }}>
              Verifique se o backend está rodando{'\n'}e se o IP/porta estão corretos em{'\n'}services/api.ts
            </Text>
            <TouchableOpacity
              onPress={load}
              style={{
                flexDirection: 'row', alignItems: 'center', gap: 6,
                backgroundColor: '#E31837', paddingHorizontal: 18,
                paddingVertical: 10, borderRadius: 10, marginTop: 4,
              }}
            >
              <RefreshCw size={16} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '700' }}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* PROMOÇÕES */}
        <Text style={{ color: '#fff', fontSize: 20, marginTop: 28, fontWeight: '700' }}>
          🏷️ Promoções do Dia
        </Text>

        {loading ? (
          <ActivityIndicator color="#E31837" style={{ marginTop: 20 }} />
        ) : error === '' && promos.length === 0 ? (
          <Text style={{ color: '#555', marginTop: 12, fontSize: 13 }}>
            Nenhuma promoção ativa no momento.{'\n'}
            <Text style={{ color: '#444', fontSize: 11 }}>
              (Dica: cadastre produtos com desconto &gt; 0 e fimDesconto no futuro)
            </Text>
          </Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {promos.map((item) => (
              <View key={item.id} style={{
                width: 210, backgroundColor: '#1a0a0a', borderRadius: 18,
                padding: 12, marginRight: 12, marginTop: 12,
                borderWidth: 1, borderColor: '#2a2a2a',
              }}>
                <Image source={{ uri: item.foto }} style={{ width: '100%', height: 120, borderRadius: 12 }} />
                <View style={{
                  position: 'absolute', top: 20, right: 20,
                  backgroundColor: '#E31837', borderRadius: 12, padding: 6,
                }}>
                  <Text style={{ color: '#fff', fontWeight: '900', fontSize: 12 }}>-{item.desconto}%</Text>
                </View>
                <Text style={{ color: '#fff', marginTop: 8 }}>{item.titulo}</Text>
                <Text style={{ color: '#aaa', fontSize: 12 }} numberOfLines={1}>{item.descricao}</Text>
                <Text style={{ color: '#666', fontSize: 11, textDecorationLine: 'line-through', marginTop: 4 }}>
                  {fmtPreco(item.preco)}
                </Text>
                <Text style={{ color: '#F5A623', fontWeight: '700' }}>{fmtPreco(precoFinal(item))}</Text>
                <TouchableOpacity
                  onPress={() => addItem(item)}
                  style={{ backgroundColor: '#E31837', marginTop: 8, padding: 10, borderRadius: 10 }}
                >
                  <Text style={{ color: '#fff', textAlign: 'center' }}>Adicionar</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}

        {/* MAIS PEDIDOS */}
        <Text style={{ color: '#fff', fontSize: 20, marginTop: 28, fontWeight: '700' }}>
          🔥 Mais Pedidos
        </Text>

        {loading ? (
          <ActivityIndicator color="#E31837" style={{ marginTop: 20 }} />
        ) : error === '' && topProdutos.length === 0 ? (
          <Text style={{ color: '#555', marginTop: 12, fontSize: 13 }}>
            Nenhum produto em destaque.{'\n'}
            <Text style={{ color: '#444', fontSize: 11 }}>
              (Dica: rode o seed do backend ou marque produtos com top = 1)
            </Text>
          </Text>
        ) : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 12 }}>
            {topProdutos.map((item) => (
              <View key={item.id} style={{
                width: '48%', backgroundColor: '#1a0a0a', borderRadius: 18,
                padding: 12, marginBottom: 12,
                borderWidth: 1, borderColor: '#2a2a2a',
              }}>
                <Image source={{ uri: item.foto }} style={{ width: '100%', height: 120, borderRadius: 12 }} />
                <Text style={{ color: '#fff', marginTop: 6 }}>{item.titulo}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                  <Star size={11} color="#F5A623" fill="#F5A623" />
                  <Text style={{ color: '#aaa', fontSize: 11, marginLeft: 3 }}>
                    {Number(item.avaliacao).toFixed(1)}
                  </Text>
                </View>
                <Text style={{ color: '#F5A623', fontWeight: '700' }}>{fmtPreco(item.preco)}</Text>
                <TouchableOpacity
                  onPress={() => addItem(item)}
                  style={{ backgroundColor: '#E31837', marginTop: 8, padding: 10, borderRadius: 10 }}
                >
                  <Text style={{ color: '#fff', textAlign: 'center' }}>Adicionar</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

      </View>
    </ScrollView>
  );
}
