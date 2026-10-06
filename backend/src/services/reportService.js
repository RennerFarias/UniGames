const Report = require('../models/Report');
const User = require('../models/User');
const Listing = require('../models/Listing');
const PriceOffer = require('../models/PriceOffer');
const domain = require('./domainService');

async function getReports(tipo, user) {
  domain.requireAdmin(user);
  return Report.find(tipo ? { tipo } : {}).sort({ createdAt: -1 });
}

async function getReport(id, user) {
  domain.requireAdmin(user);
  domain.validId(id);
  const report = await Report.findById(id);
  if (!report) domain.error('Relatório não encontrado.', 'NOT_FOUND');
  return report;
}

async function generateReport(tipo, descricao, user) {
  domain.requireAdmin(user);
  let dados;

  if (tipo === 'atividade_usuarios') {
    const [totalUsuarios, porStatus] = await Promise.all([
      User.countDocuments(),
      Listing.aggregate([
        {
          $group: {
            _id: { $ifNull: ['$status', 'ativo'] },
            quantidade: { $sum: 1 },
            valor: { $sum: '$preco' },
          },
        },
      ]),
    ]);
    dados = {
      totalUsuarios,
      totalAnuncios: porStatus.reduce((total, item) => total + item.quantidade, 0),
      porStatus: porStatus.map((item) => ({
        status: item._id,
        quantidade: item.quantidade,
        valor: item.valor,
      })),
    };
  } else if (tipo === 'ofertas_destaque' || tipo === 'variacao_precos') {
    let query = PriceOffer.find().populate('jogo', 'titulo').sort({ descontoPercentual: -1 });
    if (tipo === 'ofertas_destaque') query = query.limit(10);
    const offers = await query;
    dados = offers.map((offer) => ({
      jogoId: offer.jogo?.id,
      titulo: offer.jogo?.titulo,
      loja: offer.loja,
      preco: offer.preco,
      precoOriginal: offer.precoOriginal,
      descontoPercentual: offer.descontoPercentual,
      ...(tipo === 'variacao_precos' && { historicoPrecos: offer.historicoPrecos }),
    }));
  } else {
    domain.error('O projeto ainda não registra buscas frequentes para gerar esse relatório.');
  }

  return Report.create({
    tipo,
    descricao: String(descricao || '').trim(),
    dados: JSON.parse(JSON.stringify(dados)),
  });
}

async function deleteReport(id, user) {
  await getReport(id, user);
  await Report.deleteOne({ _id: id });
  return true;
}

module.exports = { getReports, getReport, generateReport, deleteReport };
