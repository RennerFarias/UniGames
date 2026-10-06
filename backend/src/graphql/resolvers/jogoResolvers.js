const Game = require('../../models/Game');
const domain = require('../../services/domainService');

const escaped = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

module.exports = {
  Query: {
    getGames: (_, { search, genero, plataforma }) => {
      const filter = {};
      if (search?.trim()) filter.titulo = { $regex: escaped(search.trim()), $options: 'i' };
      if (genero) filter.generos = genero;
      if (plataforma) filter.plataformas = plataforma;
      return Game.find(filter).sort({ createdAt: 1 }).exec();
    },
    getGame: async (_, { id }) => {
      domain.validId(id);
      const game = await Game.findById(id);
      if (!game) domain.error('Jogo não encontrado.', 'NOT_FOUND');
      return game;
    },
  },
  Mutation: {
    createGame: (_, { input }, { usuario }) => {
      domain.requireAdmin(usuario);
      return Game.create(input);
    },
    updateGame: async (_, { id, input }, { usuario }) => {
      domain.requireAdmin(usuario);
      domain.validId(id);
      const game = await Game.findByIdAndUpdate(
        id,
        { $set: input },
        {
          returnDocument: 'after',
          runValidators: true,
        },
      );
      if (!game) domain.error('Jogo não encontrado.', 'NOT_FOUND');
      return game;
    },
    deleteGame: (_, { id }, { usuario }) => domain.deleteGame(id, usuario),
  },
};
