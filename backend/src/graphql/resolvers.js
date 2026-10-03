const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Game = require('../models/Game');
const Listing = require('../models/Listing');
const PriceOffer = require('../models/PriceOffer');
const Review = require('../models/Review');
const domain = require('../services/domainService');
const emailOf = value => String(value || '').trim().toLowerCase();
const payload = usuario => ({ token: jwt.sign({ id: usuario.id, email: usuario.email, perfil: usuario.perfil }, process.env.JWT_SECRET, { expiresIn: '1h' }), usuario });
const escaped = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const resolvers = {
  Listing: { status: row => row.status || 'ativo' },
  Query: {
    me: async (_, __, { usuario }) => { domain.requireUser(usuario); const row = await User.findById(usuario.id).select('-senha'); if (!row) domain.error('Sessão inválida.', 'UNAUTHENTICATED'); return row; },
    getUsers: async (_, __, { usuario }) => { domain.requireAdmin(usuario); return User.find().select('-senha'); },
    getGames: async (_, { search }) => Game.find(search ? { titulo: { $regex: escaped(search.trim()), $options: 'i' } } : {}).sort({ createdAt: 1 }),
    getGame: async (_, { id }) => { domain.validId(id); const row = await Game.findById(id); if (!row) domain.error('Jogo não encontrado.', 'NOT_FOUND'); return row; },
    getListings: async () => domain.populated(Listing.find(domain.publicListings).sort({ createdAt: -1 })),
    getListing: async (_, { id }) => { domain.validId(id); const row = await domain.populated(Listing.findById(id)); if (!row) domain.error('Anúncio não encontrado.', 'NOT_FOUND'); return row; },
    getMyListings: (_, __, { usuario }) => domain.getMyListings(usuario),
    getMyReport: (_, __, { usuario }) => domain.getMyReport(usuario),
    getPriceOffers: async (_, { jogoId }) => { if (jogoId) domain.validId(jogoId); return PriceOffer.find(jogoId ? { jogo: jogoId } : {}).populate('jogo').sort({ preco: 1 }); },
    getFeaturedOffers: async () => PriceOffer.find().populate('jogo').sort({ descontoPercentual: -1 }).limit(10),
    getPriceHistory: async (_, { jogoId }) => { domain.validId(jogoId); return PriceOffer.find({ jogo: jogoId }).populate('jogo'); },
    getReviews: async (_, { jogoId, usuarioId }) => { const filter = {}; if (jogoId) filter.jogo = domain.validId(jogoId); if (usuarioId) filter.avaliadoUser = domain.validId(usuarioId); return Review.find(filter).populate('avaliador avaliadoUser jogo').sort({ createdAt: -1 }); },
  },
  Mutation: {
    register: async (_, { input }) => {
      const nome = input.nome.trim(); const email = emailOf(input.email);
      if (!nome || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || input.senha.length < 6) domain.error('Informe nome, e-mail válido e senha com pelo menos 6 caracteres.');
      if (await User.exists({ email })) domain.error('E-mail já cadastrado.');
      const usuario = await User.create({ nome, email, senha: await bcrypt.hash(input.senha, 10) }); return payload(usuario);
    },
    login: async (_, { input }) => { const usuario = await User.findOne({ email: emailOf(input.email) }); if (!usuario || !await bcrypt.compare(input.senha, usuario.senha)) domain.error('E-mail ou senha inválidos.'); return payload(usuario); },
    updateProfile: async (_, { input }, { usuario }) => {
      domain.requireUser(usuario); const fields = {};
      if (input.nome !== undefined) { fields.nome = input.nome.trim(); if (!fields.nome) domain.error('Informe seu nome.'); }
      if (input.email !== undefined) { fields.email = emailOf(input.email); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) domain.error('E-mail inválido.'); if (await User.exists({ email: fields.email, _id: { $ne: usuario.id } })) domain.error('Este e-mail já está cadastrado.'); }
      if (input.foto !== undefined) fields.foto = input.foto.trim();
      if (input.senha) { if (input.senha.length < 6) domain.error('A senha deve ter pelo menos 6 caracteres.'); fields.senha = await bcrypt.hash(input.senha, 10); }
      return User.findByIdAndUpdate(usuario.id, { $set: fields }, { new: true, runValidators: true }).select('-senha');
    },
    deleteUser: (_, { id }, { usuario }) => domain.deleteUser(id, usuario),
    createGame: async (_, { input }, { usuario }) => { domain.requireAdmin(usuario); return Game.create(input); },
    updateGame: async (_, { id, input }, { usuario }) => { domain.requireAdmin(usuario); domain.validId(id); const row = await Game.findByIdAndUpdate(id, { $set: input }, { new: true, runValidators: true }); if (!row) domain.error('Jogo não encontrado.', 'NOT_FOUND'); return row; },
    deleteGame: (_, { id }, { usuario }) => domain.deleteGame(id, usuario),
    createListing: (_, { input }, { usuario }) => domain.createListing(input, usuario),
    updateListing: (_, { id, input }, { usuario }) => domain.updateListing(id, input, usuario),
    deleteListing: (_, { id }, { usuario }) => domain.deleteListing(id, usuario),
    createPriceOffer: (_, { input }, { usuario }) => domain.createPriceOffer(input, usuario),
    updatePriceOffer: (_, { id, input }, { usuario }) => domain.updatePriceOffer(id, input, usuario),
    createReview: (_, { input }, { usuario }) => domain.createReview(input, usuario),
  },
};
module.exports = resolvers;
