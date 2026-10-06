const PriceOffer = require('../../models/PriceOffer');
const domain = require('../../services/domainService');

module.exports = {
  Query: {
    getPriceOffers: (_, { jogoId }) => {
      const filter = jogoId ? { jogo: domain.validId(jogoId) } : {};
      return PriceOffer.find(filter).populate('jogo').sort({ preco: 1 }).exec();
    },
    getFeaturedOffers: () =>
      PriceOffer.find().populate('jogo').sort({ descontoPercentual: -1 }).limit(10).exec(),
    getPriceHistory: (_, { jogoId }) =>
      PriceOffer.find({ jogo: domain.validId(jogoId) })
        .populate('jogo')
        .exec(),
  },
  Mutation: {
    createPriceOffer: (_, { input }, { usuario }) => domain.createPriceOffer(input, usuario),
    updatePriceOffer: (_, { id, input }, { usuario }) =>
      domain.updatePriceOffer(id, input, usuario),
    deletePriceOffer: (_, { id }, { usuario }) => domain.deletePriceOffer(id, usuario),
  },
};
