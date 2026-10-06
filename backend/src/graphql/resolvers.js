const usuario = require('./resolvers/usuarioResolvers');
const jogo = require('./resolvers/jogoResolvers');
const revenda = require('./resolvers/revendaResolvers');
const oferta = require('./resolvers/ofertaResolvers');
const avaliacao = require('./resolvers/avaliacaoResolvers');
const relatorio = require('./resolvers/relatorioResolvers');
const scalars = require('./scalars');

module.exports = {
  ...scalars,
  ReportType: relatorio.ReportType,
  User: {
    revendedor: (user) => Boolean(user.revendedor),
    dataNascimento: (user) => user.dataNascimento?.toISOString().slice(0, 10),
  },
  PublicUser: {
    revendedor: (user) => Boolean(user.revendedor),
  },
  Listing: {
    status: (listing) => listing.status || 'ativo',
  },
  Query: {
    ...usuario.Query,
    ...jogo.Query,
    ...revenda.Query,
    ...oferta.Query,
    ...avaliacao.Query,
    ...relatorio.Query,
  },
  Mutation: {
    ...usuario.Mutation,
    ...jogo.Mutation,
    ...revenda.Mutation,
    ...oferta.Mutation,
    ...avaliacao.Mutation,
    ...relatorio.Mutation,
  },
};
