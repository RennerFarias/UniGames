const domain = require('../../services/domainService');
const reports = require('../../services/reportService');

module.exports = {
  ReportType: {
    BUSCAS_FREQUENTES: 'buscas_frequentes',
    VARIACAO_PRECOS: 'variacao_precos',
    ATIVIDADE_USUARIOS: 'atividade_usuarios',
    OFERTAS_DESTAQUE: 'ofertas_destaque',
  },
  Query: {
    getMyReport: (_, __, { usuario }) => domain.getMyReport(usuario),
    getReports: (_, { tipo }, { usuario }) => reports.getReports(tipo, usuario),
    getReport: (_, { id }, { usuario }) => reports.getReport(id, usuario),
  },
  Mutation: {
    generateReport: (_, { tipo, descricao }, { usuario }) =>
      reports.generateReport(tipo, descricao, usuario),
    deleteReport: (_, { id }, { usuario }) => reports.deleteReport(id, usuario),
  },
};
