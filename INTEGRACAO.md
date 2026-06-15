# IFBurguer Mobile — Integração com Backend

## O que foi integrado

| Tela            | Antes              | Depois                                      |
|-----------------|--------------------|--------------------------------------------|
| `login.tsx`     | Mock (sem ação)    | Login e cadastro reais via `/auth/login` e `/auth/register` |
| `home.tsx`      | Dados hardcoded    | Produtos TOP e promoções via API, saudação personalizada |
| `cardapio.tsx`  | Dados hardcoded    | Produtos por categoria via API, desconto, avaliação |
| `pedidos.tsx`   | Mock estático      | Sacola real (Add/Remove/Qty) + Histórico de pedidos |
| `fidelidade.tsx`| Só redirecionamento| Pontos reais, barra de progresso, resgate de recompensas |
| `perfil.tsx`    | Placeholder vazio  | Dados reais do usuário, nível de fidelidade, logout |
| `Header.tsx`    | Sem badge          | Badge com quantidade de itens no carrinho |
| `BottomBar.tsx` | Sem Perfil         | Rota de Perfil adicionada |

## Novos arquivos criados

- `services/api.ts` — cliente de API com token JWT (AsyncStorage)
- `context/AuthContext.tsx` — sessão do usuário (login/logout/refresh)
- `context/CartContext.tsx` — carrinho local com sync para o backend

## Configuração do IP do backend

> Edite `services/api.ts` e ajuste `BASE_URL`:

```ts
// Android Emulator
export const BASE_URL = 'http://10.0.2.2:3334';

// iOS Simulator
export const BASE_URL = 'http://localhost:3334';

// Dispositivo físico (Wi-Fi) — substitua pelo IP da sua máquina
export const BASE_URL = 'http://192.168.1.XXX:3334';
```

## Como rodar

### 1. Backend

```bash
cd Projeto-integrador-IFBURGUER/back
cp .env.example .env
# Edite .env com suas credenciais do MySQL
npm install
npm run dev
```

### 2. Mobile

```bash
cd ifburguer-mobile-integrado
npm install
npx expo start
```

## Como a autenticação funciona no mobile

O backend aceita tanto **cookie HttpOnly** (para o front web) quanto **Bearer Token** no header Authorization.

O mobile usa a segunda opção:
1. Ao fazer login/cadastro, salva o `accessToken` no **AsyncStorage**
2. Toda requisição autenticada inclui `Authorization: Bearer <token>`
3. Ao abrir o app, restaura a sessão automaticamente se o token ainda for válido
