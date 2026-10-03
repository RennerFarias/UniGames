const { gql } = require('graphql-tag');

const typeDefs = gql`
  # --- TIPOS PRINCIPAIS ---
  type User {
    id: ID!
    nome: String!
    email: String!
    perfil: String!
    foto: String
    dataNascimento: String
    revendedor: Boolean!
    createdAt: String
    updatedAt: String
  }

  type AuthPayload {
    token: String!
    usuario: User!
  }

  type Game {
    id: ID!
    titulo: String!
    descricao: String
    generos: [String!]!
    plataformas: [String!]!
    imagemCapa: String
    linksReferencia: [String!]!
    createdAt: String
    updatedAt: String
  }

  type Contato {
    nome: String!
    info: String!
  }

  type Listing {
    id: ID!
    jogo: Game
    vendedor: User
    status: String!
    vendidoEm: String
    preco: Float!
    estadoConservacao: String!
    plataforma: String!
    contato: Contato!
    descricao: String
    createdAt: String
    updatedAt: String
  }

  type PlatformCount {
    plataforma: String!
    quantidade: Int!
  }

  type ActivityReport {
    totalAnuncios: Int!
    anunciosAtivos: Int!
    anunciosVendidos: Int!
    valorVendas: Float!
    porPlataforma: [PlatformCount!]!
  }

  type HistoricoPreco {
    preco: Float!
    data: String
  }

  type PriceOffer {
    id: ID!
    jogo: Game
    loja: String!
    preco: Float!
    precoOriginal: Float
    descontoPercentual: Float
    urlLoja: String
    historicoPrecos: [HistoricoPreco!]!
    createdAt: String
    updatedAt: String
  }

  type Review {
    id: ID!
    avaliador: User!
    avaliadoUser: User
    jogo: Game
    nota: Int!
    comentario: String
    createdAt: String
    updatedAt: String
  }

  # --- ENTRADAS (INPUTS) ---
  input RegisterInput {
    nome: String!
    email: String!
    senha: String!
    dataNascimento: String
  }

  input LoginInput {
    email: String!
    senha: String!
  }

  input UpdateUserInput {
    foto: String
    nome: String
    email: String
    senha: String
    dataNascimento: String
  }

  input CreateGameInput {
    titulo: String!
    descricao: String
    generos: [String!]
    plataformas: [String!]
    imagemCapa: String
    linksReferencia: [String!]
  }

  input UpdateGameInput {
    titulo: String
    descricao: String
    generos: [String!]
    plataformas: [String!]
    imagemCapa: String
    linksReferencia: [String!]
  }

  input ContatoInput {
    nome: String!
    info: String!
  }

  input CreateListingInput {
    jogoId: ID!
    preco: Float!
    estadoConservacao: String!
    plataforma: String!
    contato: ContatoInput!
    descricao: String
  }

  input UpdateListingInput {
    status: String
    preco: Float
    estadoConservacao: String
    plataforma: String
    contato: ContatoInput
    descricao: String
  }

  input CreatePriceOfferInput {
    jogoId: ID!
    loja: String!
    preco: Float!
    precoOriginal: Float
    urlLoja: String
  }

  input UpdatePriceOfferInput {
    loja: String
    preco: Float
    precoOriginal: Float
    urlLoja: String
  }

  input CreateReviewInput {
    avaliadoUserId: ID
    jogoId: ID
    nota: Int!
    comentario: String
  }

  # --- CONSULTAS (QUERIES) ---
  type Query {
    me: User
    getUsers: [User!]!

    getGames(search: String): [Game!]!
    getGame(id: ID!): Game

    getListings: [Listing!]!
    getMyListings: [Listing!]!
    getMyReport: ActivityReport!
    getListing(id: ID!): Listing

    getPriceOffers(jogoId: ID): [PriceOffer!]!
    getFeaturedOffers: [PriceOffer!]!
    getPriceHistory(jogoId: ID!): [PriceOffer!]!

    getReviews(jogoId: ID, usuarioId: ID): [Review!]!
  }

  # --- MUTATIONS ---
  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    updateProfile(input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!
    tornarRevendedor(dataNascimento: String): User!

    createGame(input: CreateGameInput!): Game!
    updateGame(id: ID!, input: UpdateGameInput!): Game!
    deleteGame(id: ID!): Boolean!

    createListing(input: CreateListingInput!): Listing!
    updateListing(id: ID!, input: UpdateListingInput!): Listing!
    deleteListing(id: ID!): Boolean!

    createPriceOffer(input: CreatePriceOfferInput!): PriceOffer!
    updatePriceOffer(id: ID!, input: UpdatePriceOfferInput!): PriceOffer!
    createReview(input: CreateReviewInput!): Review!
  }
`;

module.exports = typeDefs;