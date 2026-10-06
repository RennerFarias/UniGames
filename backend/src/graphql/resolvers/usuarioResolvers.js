const User = require('../../models/User');
const users = require('../../services/userService');
const domain = require('../../services/domainService');

module.exports = {
  Query: {
    me: (_, __, { usuario }) => users.getProfile(usuario),
    getUser: async (_, { id }) => {
      domain.validId(id);
      const user = await User.findById(id).select(
        'nome perfil foto revendedor createdAt updatedAt',
      );
      if (!user) domain.error('Usuário não encontrado.', 'NOT_FOUND');
      return user;
    },
    getUsers: (_, __, { usuario }) => {
      domain.requireAdmin(usuario);
      return User.find().select('-senha').sort({ nome: 1 }).exec();
    },
  },
  Mutation: {
    register: (_, { input }) => users.register(input),
    login: (_, { input }) => users.login(input),
    updateProfile: (_, { input }, { usuario }) => users.updateProfile(input, usuario),
    deleteUser: (_, { id }, { usuario }) => domain.deleteUser(id, usuario),
    tornarRevendedor: (_, { dataNascimento }, { usuario }) =>
      domain.tornarRevendedor(dataNascimento, usuario),
  },
};
