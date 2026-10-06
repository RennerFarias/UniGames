const Listing = require('../../models/Listing');
const domain = require('../../services/domainService');

module.exports = {
  Query: {
    getListings: (_, { jogoId, plataforma, estadoConservacao, precoMaximo }) => {
      const filter = { ...domain.publicListings };
      if (jogoId) filter.jogo = domain.validId(jogoId);
      if (plataforma) filter.plataforma = plataforma;
      if (estadoConservacao) filter.estadoConservacao = estadoConservacao;
      if (precoMaximo != null) {
        if (precoMaximo < 0) domain.error('Informe um preço máximo não negativo.');
        filter.preco = { $lte: precoMaximo };
      }
      return domain.populated(Listing.find(filter).sort({ createdAt: -1 })).exec();
    },
    getListing: (_, { id }, { usuario }) => domain.getListing(id, usuario),
    getMyListings: (_, __, { usuario }) => domain.getMyListings(usuario),
  },
  Mutation: {
    createListing: (_, { input }, { usuario }) => domain.createListing(input, usuario),
    updateListing: (_, { id, input }, { usuario }) => domain.updateListing(id, input, usuario),
    deleteListing: (_, { id }, { usuario }) => domain.deleteListing(id, usuario),
  },
};
