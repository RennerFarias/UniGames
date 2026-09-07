import { gql } from 'graphql-tag';

export const typeDefs = gql`
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

  input CreateGameInput {
    titulo: String!
    descricao: String
    generos: [String!]
    plataformas: [String!]
    imagemCapa: String
    linksReferencia: [String!]
  }

  type Query {
    getGames(search: String): [Game!]!
    getGame(id: ID!): Game
  }

  type Mutation {
    createGame(input: CreateGameInput!): Game!
    deleteGame(id: ID!): Boolean!
  }
`;