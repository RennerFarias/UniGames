---

markdown
<div align="center">

# 🎮 UniGames

**Compare preços, acompanhe ofertas e revenda jogos tudo em um só lugar.**

![Status](https://img.shields.io/badge/status-backend%20em%20desenvolvimento-yellow)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)
![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=flat&logo=graphql&logoColor=white)

</div>

## Sobre

Pesquisar o melhor preço de um jogo em várias lojas ao mesmo tempo é cansativo. O UniGames centraliza ofertas, histórico de preços e revenda de mídia física em uma única plataforma, facilitando a decisão de compra do jogador.

## Equipe

Elian Barros · Igor Morais · José Artur · Rafael Barbosa · Renner Farias

<sub>Projeto acadêmico — Sistemas de Informação, CESED/UNIFACISA · Competência: Integrar Interfaces e Serviço Web · Prof. Sheila Maria · 2026.2</sub>

---

## Rodando o projeto

bash
cd backend
npm install
# crie um arquivo .env na pasta backend com:
# MONGODB_URI=...
# JWT_SECRET=...
# PORT=3000
npm start


## Autenticação

A maioria das rotas exige um token JWT, obtido no login. Envie no header:


Authorization: Bearer SEU_TOKEN


Existem dois perfis de usuário: `usuario` (padrão) e `admin`. Algumas rotas exigem especificamente perfil `admin`.

---

## Rotas REST

### Autenticação (`/auth`)

| Método | Rota | Protegida | Descrição |
|---|---|---|---|
| POST | `/auth/cadastro` | Não | Cria um novo usuário (perfil `usuario` por padrão) |
| POST | `/auth/login` | Não | Autentica e retorna um token JWT |

### Usuários (`/usuarios`)

| Método | Rota | Protegida | Descrição |
|---|---|---|---|
| GET | `/usuarios` | Sim (admin) | Lista todos os usuários cadastrados |
| GET | `/usuarios/perfil` | Sim | Retorna os dados do usuário autenticado |
| PUT | `/usuarios/perfil` | Sim | Atualiza dados do próprio usuário (nome, email, senha) |
| DELETE | `/usuarios/:id` | Sim (admin) | Remove um usuário pelo ID |

### Jogos (`/jogos`)

| Método | Rota | Protegida | Descrição |
|---|---|---|---|
| GET | `/jogos` | Não | Lista jogos, com filtro (`titulo`, `genero`, `plataforma`) e paginação (`pagina`, `limite`) |
| GET | `/jogos/:id` | Não | Retorna um jogo específico |
| POST | `/jogos` | Sim (admin) | Cadastra um novo jogo no catálogo |
| PUT | `/jogos/:id` | Sim | Atualiza um jogo existente |
| DELETE | `/jogos/:id` | Sim | Remove um jogo do catálogo |

### Anúncios de revenda (`/anuncios`)

| Método | Rota | Protegida | Descrição |
|---|---|---|---|
| GET | `/anuncios` | Não | Lista anúncios, com filtro (`plataforma`, `estadoConservacao`) e paginação |
| GET | `/anuncios/:id` | Não | Retorna um anúncio específico |
| POST | `/anuncios` | Sim | Cria um anúncio de revenda de mídia física |
| PUT | `/anuncios/:id` | Sim | Atualiza um anúncio existente |
| DELETE | `/anuncios/:id` | Sim | Remove um anúncio |

## API GraphQL (`/graphql`)

Cobre atualmente a entidade **Jogo**, como forma alternativa de acesso ao mesmo dado do REST:

- `query { getGames(search: String) }` — lista jogos, com busca opcional por título
- `query { getGame(id: ID!) }` — retorna um jogo específico
- `mutation { createGame(input: CreateGameInput!) }` — cadastra jogo (exige token de **admin**)
- `mutation { deleteGame(id: ID!) }` — remove jogo (exige token de **admin**)

---

## O que fica para a segunda etapa

- **Relatórios** (`/relatorios`): ofertas em destaque e histórico de variação de preço por jogo — ainda não implementado (controller, rotas e models `Report`/`PriceOffer` vazios)
- **Sistema de assinatura para revendedor** (anual/vitalícia, perfil de revendedor): funcionalidade planejada pelo grupo, ainda não faz parte do escopo desta entrega
- **GraphQL para Usuários e Anúncios**: hoje o GraphQL cobre só Jogos
- **Frontend**: interface visual completa (login, catálogo, perfil, revenda) — esta entrega cobre somente o backend