const { gql } = require('graphql-tag');

const typeDefs = gql`
  scalar DateTime
  scalar JSON
  type User {
    id: ID!
    nome: String!
    email: String!
    perfil: String!
    foto: String
    dataNascimento: String
    revendedor: Boolean!
    createdAt: DateTime
    updatedAt: DateTime
  }

  type PublicUser {
    id: ID!
    nome: String!
    perfil: String!
    foto: String
    revendedor: Boolean!
    createdAt: DateTime
    updatedAt: DateTime
  }

  enum ReportType {
    BUSCAS_FREQUENTES
    VARIACAO_PRECOS
    ATIVIDADE_USUARIOS
    OFERTAS_DESTAQUE
  }

  type Report {
    id: ID!
    tipo: ReportType!
    dados: JSON!
    descricao: String
    createdAt: DateTime
    updatedAt: DateTime
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
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Contato {
    nome: String!
    info: String!
  }

  type Listing {
    id: ID!
    jogo: Game
    vendedor: PublicUser
    status: String!
    vendidoEm: DateTime
    preco: Float!
    estadoConservacao: String!
    plataforma: String!
    contato: Contato!
    descricao: String
    createdAt: DateTime
    updatedAt: DateTime
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
    data: DateTime
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
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Review {
    id: ID!
    avaliador: PublicUser!
    avaliadoUser: PublicUser
    jogo: Game
    nota: Int!
    comentario: String
    createdAt: DateTime
    updatedAt: DateTime
  }

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

  input UpdateReviewInput {
    nota: Int
    comentario: String
  }

  type Query {
    me: User
    getUsers: [User!]!
    getUser(id: ID!): PublicUser

    getGames(search: String, genero: String, plataforma: String): [Game!]!
    getGame(id: ID!): Game

    getListings(
      jogoId: ID
      plataforma: String
      estadoConservacao: String
      precoMaximo: Float
    ): [Listing!]!
    getMyListings: [Listing!]!
    getMyReport: ActivityReport!
    getReports(tipo: ReportType): [Report!]!
    getReport(id: ID!): Report
    getListing(id: ID!): Listing

    getPriceOffers(jogoId: ID): [PriceOffer!]!
    getFeaturedOffers: [PriceOffer!]!
    getPriceHistory(jogoId: ID!): [PriceOffer!]!

    getReviews(jogoId: ID, usuarioId: ID): [Review!]!
  }

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
    updateReview(id: ID!, input: UpdateReviewInput!): Review!
    deleteReview(id: ID!): Boolean!
    deletePriceOffer(id: ID!): Boolean!
    generateReport(tipo: ReportType!, descricao: String): Report!
    deleteReport(id: ID!): Boolean!
  }
`;

module.exports = typeDefs;
