const { gql } = require('graphql-tag');
const Game = require('../models/Game');

const typeDefs = gql`
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

const resolvers = {
  Query: {
    getGames: async (_, { search }) => {
      try {
        const query = search
          ? { titulo: { $regex: search.trim(), $options: 'i' } }
          : {};
        return await Game.find(query).sort({ titulo: 1 });
      } catch (error) {
        throw new Error('Erro ao buscar jogos: ' + error.message);
      }
    },

    getGame: async (_, { id }) => {
      try {
        const jogo = await Game.findById(id);
        if (!jogo) {
          throw new Error('Jogo não encontrado');
        }
        return jogo;
      } catch (error) {
        if (error.kind === 'ObjectId') {
          throw new Error('ID de jogo inválido');
        }
        throw error;
      }
    },
  },

  Mutation: {
    createGame: async (_, { input }, context) => {
      if (!context.usuario || context.usuario.perfil !== 'admin') {
          throw new Error('Apenas administradores podem realizar esta ação');
      }

      if (!input.titulo || !input.titulo.trim()) {
        throw new Error('O título do jogo é obrigatório');
      }

      try {
        const newGame = new Game(input);
        return await newGame.save();
      } catch (error) {
        throw new Error('Erro ao cadastrar jogo: ' + error.message);
      }
    },

    deleteGame: async (_, { id }, context) => {
      if (!context.usuario || context.usuario.perfil !== 'admin') {
        throw new Error('Apenas administradores podem realizar esta ação');
    }

      try {
        const result = await Game.deleteOne({ _id: id });
        return result.deletedCount > 0;
      } catch (error) {
        if (error.kind === 'ObjectId') {
          throw new Error('ID de jogo inválido');
        }
        throw new Error('Erro ao excluir jogo: ' + error.message);
      }
    },
  },
};

module.exports = {
  typeDefs,
  resolvers
};