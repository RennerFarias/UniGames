const domain = require('../../services/domainService');

module.exports = {
  Query: {
    getReviews: (_, filter) => domain.getReviews(filter),
  },
  Mutation: {
    createReview: (_, { input }, { usuario }) => domain.createReview(input, usuario),
    updateReview: (_, { id, input }, { usuario }) => domain.updateReview(id, input, usuario),
    deleteReview: (_, { id }, { usuario }) => domain.deleteReview(id, usuario),
  },
};
