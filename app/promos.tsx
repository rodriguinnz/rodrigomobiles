import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Flame } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function Promos() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      {/* HEADER */}
      <Text style={styles.title}>Promoções 🔥</Text>
      <Text style={styles.subtitle}>As melhores ofertas para você</Text>

      {/* 🔥 OFERTA ESPECIAL */}
      <LinearGradient
        colors={["#E31837", "#ff7a00"]}
        style={styles.specialCard}
      >
        <View style={styles.tag}>
          <Flame size={14} color="#000" />
          <Text style={styles.tagText}>OFERTA ESPECIAL</Text>
        </View>

        <View style={styles.specialContent}>
          <View style={{ flex: 1 }}>
            <Text style={styles.specialTitle}>
              Ganhe um Milkshake Grátis!
            </Text>

            <Text style={styles.specialDesc}>
              Compras acima de R$ 80 ganham um milkshake grátis!
            </Text>

            <TouchableOpacity style={styles.specialButton}>
              <Text style={styles.specialButtonText}>Aproveitar oferta</Text>
            </TouchableOpacity>
          </View>

          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1572490122747-3968b75cc699",
            }}
            style={styles.specialImage}
          />
        </View>
      </LinearGradient>

      {/* 🍔 TODOS COM IMAGEM */}

      <PromoCard
        title="Combo Família"
        desc="4 burgers + 4 batatas + 4 bebidas"
        price="R$ 119,90"
        oldPrice="R$ 159,90"
        image="https://images.unsplash.com/photo-1550547660-d9450f859349"
      />

      <PromoCard
        title="Combo Namorados"
        desc="2 burgers + batata + 2 milkshakes"
        price="R$ 79,90"
        oldPrice="R$ 99,90"
        image="https://images.unsplash.com/photo-1606755962773-d324e7a7a1a6"
      />

      <PromoCard
        title="Happy Hour"
        desc="Batata em dobro das 18h às 20h"
        price="Todos os dias"
        image="https://images.unsplash.com/photo-1606755962773-0a6f0c0a3b4f"
      />

      <PromoCard
        title="Delivery Grátis"
        desc="Frete grátis acima de R$ 50"
        price="Sem taxa"
        image="https://images.unsplash.com/photo-1601924928357-22a1a8c5c5c8"
      />

      <PromoCard
        title="Primeiro Pedido"
        desc="15% OFF para novos clientes"
        price="15% OFF"
        image="https://images.unsplash.com/photo-1521305916504-4a1121188589"
      />

      <PromoCard
        title="Terça do Cheese"
        desc="Queijo extra grátis em todos os burgers"
        price="Promo ativa"
        image="https://images.unsplash.com/photo-1551782450-a2132b4ba21d"
      />

      <PromoCard
        title="Mega Bacon Burger"
        desc="Burger duplo com bacon crocante"
        price="R$ 89,90"
        image="https://images.unsplash.com/photo-1551782450-17144f9b1b2f"
      />

      {/* FINAL */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Não encontrou o que procurava?
        </Text>

        <TouchableOpacity onPress={() => router.push("/cardapio")}>
          <Text style={styles.link}>Ver Cardápio Completo</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/* 🧩 CARD PADRÃO */
function PromoCard({ title, desc, price, oldPrice, image }: any) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />

      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.desc}>{desc}</Text>

        {oldPrice && (
          <Text style={styles.priceOld}>{oldPrice}</Text>
        )}

        <Text style={styles.price}>{price}</Text>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Ver oferta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* 🎨 ESTILOS */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0505",
  },

  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#aaa",
    marginBottom: 20,
    marginTop: 5,
  },

  /* 🔥 ESPECIAL */
  specialCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
  },

  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.15)",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
  },

  tagText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 11,
  },

  specialContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  specialTitle: {
    color: "#000",
    fontSize: 16,
    fontWeight: "900",
  },

  specialDesc: {
    color: "#1a1a1a",
    marginTop: 6,
    fontSize: 12,
  },

  specialButton: {
    marginTop: 10,
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: "flex-start",
  },

  specialButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 12,
  },

  specialImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginLeft: 10,
  },

  /* 🍔 CARD */
  card: {
    flexDirection: "row",
    backgroundColor: "#1a0f0f",
    padding: 12,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#3a2a2a",
    alignItems: "center",
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 10,
  },

  cardTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },

  desc: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 4,
  },

  priceOld: {
    color: "#777",
    textDecorationLine: "line-through",
    marginTop: 6,
  },

  price: {
    color: "#fff",
    fontWeight: "bold",
  },

  button: {
    backgroundColor: "#E31837",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 8,
    alignSelf: "flex-start",
  },

  buttonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },

  footer: {
    marginTop: 20,
    alignItems: "center",
  },

  footerText: {
    color: "#aaa",
  },

  link: {
    color: "#E31837",
    marginTop: 6,
    fontWeight: "bold",
  },
});