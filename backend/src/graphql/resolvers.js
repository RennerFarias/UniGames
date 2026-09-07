import Game from '../models/Game.js';

export const resolvers = {
  Query: {
    getGames: async (_, { search }) => {
      const query = search ? { titulo: { $regex: search, $options: 'i' } } : {};
      return await Game.find(query);
    },
    getGame: async (_, { id }) => {
      return await Game.findById(id);
    },
  },

  Mutation: {
    createGame: async (_, { input }) => {
      const newGame = new Game(input);
      return await newGame.save();
    },
    deleteGame: async (_, { id }) => {
      const result = await Game.deleteOne({ _id: id });
      return result.deletedCount > 0;
    },
  },
};