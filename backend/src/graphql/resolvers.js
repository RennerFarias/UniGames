const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Game = require('../models/Game');
const Listing = require('../models/Listing');
const PriceOffer = require('../models/PriceOffer');
const Review = require('../models/Review');

const resolvers = {
  Query: {
    // Retorna dados do usuário logado
    me: async (_, __, context) => {
      if (!context.usuario) throw new Error('Não autenticado');
      return await User.findById(context.usuario.id).select('-senha');
    },

    // Lista todos os usuários (apenas admin)
    getUsers: async (_, __, context) => {
      if (!context.usuario || context.usuario.perfil !== 'admin') {
        throw new Error('Acesso não autorizado');
      }
      return await User.find().select('-senha');
    },

    // Lista jogos (com opção de busca por nome)
    getGames: async (_, { search }) => {
      const filter = search ? { titulo: { $regex: search.trim(), $options: 'i' } } : {};
      return await Game.find(filter).sort({ titulo: 1 });
    },

    // Detalhes de um jogo específico
    getGame: async (_, { id }) => {
      const jogo = await Game.findById(id);
      if (!jogo) throw new Error('Jogo não encontrado');
      return jogo;
    },

    // Lista anúncios de mídia física da comunidade
    getListings: async () => {
      return await Listing.find().populate('jogo').sort({ createdAt: -1 });
    },

    getListing: async (_, { id }) => {
      const anuncio = await Listing.findById(id).populate('jogo');
      if (!anuncio) throw new Error('Anúncio não encontrado');
      return anuncio;
    },

    // Ofertas de preços em lojas
    getPriceOffers: async (_, { jogoId }) => {
      const filter = jogoId ? { jogo: jogoId } : {};
      return await PriceOffer.find(filter).populate('jogo').sort({ preco: 1 });
    },

    // Maior porcentagem de desconto
    getFeaturedOffers: async () => {
      return await PriceOffer.find().populate('jogo').sort({ descontoPercentual: -1 }).limit(10);
    },

    getPriceHistory: async (_, { jogoId }) => {
      return await PriceOffer.find({ jogo: jogoId }).populate('jogo');
    },

    // Lista avaliações por jogo ou usuário
    getReviews: async (_, { jogoId, usuarioId }) => {
      const filter = {};
      if (jogoId) filter.jogo = jogoId;
      if (usuarioId) filter.avaliadoUser = usuarioId;
      return await Review.find(filter).populate('avaliador avaliadoUser jogo');
    }
  },

  Mutation: {
    // Cadastro de usuário
    register: async (_, { input }) => {
      const { nome, email, senha } = input;
      if (!nome || !email || !senha) throw new Error('Preencha todos os campos obrigatórios');

      const usuarioExistente = await User.findOne({ email });
      if (usuarioExistente) throw new Error('E-mail já cadastrado');

      const senhaCriptografada = await bcrypt.hash(senha, 10);
      const usuario = new User({ nome, email, senha: senhaCriptografada });
      await usuario.save();

      const token = jwt.sign(
        { id: usuario._id, email: usuario.email, perfil: usuario.perfil },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return { token, usuario };
    },

    // Login do usuário
    login: async (_, { input }) => {
      const { email, senha } = input;
      const usuario = await User.findOne({ email });
      if (!usuario) throw new Error('E-mail ou senha inválidos');

      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) throw new Error('E-mail ou senha inválidos');

      const token = jwt.sign(
        { id: usuario._id, email: usuario.email, perfil: usuario.perfil },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return { token, usuario };
    },

    updateProfile: async (_, { input }, context) => {
      if (!context.usuario) throw new Error('Não autenticado');
      const dados = {};
      if (input.nome) dados.nome = input.nome;
      if (input.email) dados.email = input.email;
      if (input.senha) dados.senha = await bcrypt.hash(input.senha, 10);

      return await User.findByIdAndUpdate(context.usuario.id, dados, { new: true }).select('-senha');
    },

    deleteUser: async (_, { id }, context) => {
      if (!context.usuario || context.usuario.perfil !== 'admin') {
        throw new Error('Apenas admin pode excluir usuários');
      }
      const res = await User.findByIdAndDelete(id);
      return !!res;
    },

    // Cadastrar jogo no catálogo (Admin)
    createGame: async (_, { input }, context) => {
      if (!context.usuario || context.usuario.perfil !== 'admin') {
        throw new Error('Apenas admin pode criar jogos');
      }
      const novoJogo = new Game(input);
      return await novoJogo.save();
    },

    updateGame: async (_, { id, input }, context) => {
      if (!context.usuario || context.usuario.perfil !== 'admin') {
        throw new Error('Apenas admin pode editar jogos');
      }
      const jogo = await Game.findByIdAndUpdate(id, input, { new: true });
      if (!jogo) throw new Error('Jogo não encontrado');
      return jogo;
    },

    deleteGame: async (_, { id }, context) => {
      if (!context.usuario || context.usuario.perfil !== 'admin') {
        throw new Error('Apenas admin pode excluir jogos');
      }
      const res = await Game.deleteOne({ _id: id });
      return res.deletedCount > 0;
    },

    // Anúncio de revenda dos jogos
    createListing: async (_, { input }, context) => {
      if (!context.usuario) throw new Error('Não autenticado');
      const { jogoId, ...resto } = input;
      const anuncio = new Listing({ jogo: jogoId, ...resto });
      await anuncio.save();
      return await Listing.findById(anuncio._id).populate('jogo');
    },

    updateListing: async (_, { id, input }, context) => {
      if (!context.usuario) throw new Error('Não autenticado');
      const anuncio = await Listing.findByIdAndUpdate(id, input, { new: true }).populate('jogo');
      if (!anuncio) throw new Error('Anúncio não encontrado');
      return anuncio;
    },

    deleteListing: async (_, { id }, context) => {
      if (!context.usuario) throw new Error('Não autenticado');
      const res = await Listing.deleteOne({ _id: id });
      return res.deletedCount > 0;
    },

    // Cadastrar oferta de preço dos jogos
    createPriceOffer: async (_, { input }, context) => {
      if (!context.usuario || context.usuario.perfil !== 'admin') {
        throw new Error('Apenas admin pode cadastrar ofertas');
      }
      const { jogoId, preco, precoOriginal, ...resto } = input;
      let desconto = 0;
      if (precoOriginal && precoOriginal > preco) {
        desconto = Math.round(((precoOriginal - preco) / precoOriginal) * 100);
      }
      const oferta = new PriceOffer({
        jogo: jogoId,
        preco,
        precoOriginal,
        descontoPercentual: desconto,
        historicoPrecos: [{ preco, data: new Date() }],
        ...resto
      });
      await oferta.save();
      return await PriceOffer.findById(oferta._id).populate('jogo');
    },

    // Aqui podemos criar avaliação 
    createReview: async (_, { input }, context) => {
      if (!context.usuario) throw new Error('Não autenticado');
      const review = new Review({
        avaliador: context.usuario.id,
        avaliadoUser: input.avaliadoUserId,
        jogo: input.jogoId,
        nota: input.nota,
        comentario: input.comentario
      });
      await review.save();
      return await Review.findById(review._id).populate('avaliador avaliadoUser jogo');
    }
  }
};

module.exports = resolvers;