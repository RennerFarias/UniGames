const domain = require('../services/domainService');
const Listing = require('../models/Listing');
const reports = require('../services/reportService');
const PriceOffer = require('../models/PriceOffer');
const handle = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (error) {
    const codes = {
      UNAUTHENTICATED: 401,
      INVALID_CREDENTIALS: 401,
      FORBIDDEN: 403,
      NOT_FOUND: 404,
      BAD_USER_INPUT: 400,
    };
    const status =
      (error.code === 11000 ? 409 : codes[error.extensions?.code]) ||
      (['ValidationError', 'CastError'].includes(error.name) ? 400 : 500);
    res.status(status).json({
      mensagem: error.code === 11000 ? 'Este registro já está cadastrado.' : error.message,
    });
  }
};
module.exports = {
  handle,
  createListing: handle(async (req, res) =>
    res.status(201).json({
      anuncio: await domain.createListing({ ...req.body, jogoId: req.body.jogo }, req.usuario),
    }),
  ),
  updateListing: handle(async (req, res) =>
    res.json({ anuncio: await domain.updateListing(req.params.id, req.body, req.usuario) }),
  ),
  deleteListing: handle(async (req, res) => {
    await domain.deleteListing(req.params.id, req.usuario);
    res.json({ mensagem: 'Anúncio excluído.' });
  }),
  myListings: handle(async (req, res) =>
    res.json({ anuncios: await domain.getMyListings(req.usuario) }),
  ),
  myReport: handle(async (req, res) =>
    res.json({ relatorio: await domain.getMyReport(req.usuario) }),
  ),
  listListings: handle(async (req, res) => {
    const page = Math.max(1, Number.parseInt(req.query.pagina) || 1);
    const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limite) || 10));
    const query = { ...domain.publicListings };
    if (req.query.plataforma) query.plataforma = req.query.plataforma;
    if (req.query.estadoConservacao) query.estadoConservacao = req.query.estadoConservacao;
    const [anuncios, total] = await Promise.all([
      domain.populated(
        Listing.find(query)
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit),
      ),
      Listing.countDocuments(query),
    ]);
    res.json({
      anuncios,
      paginacao: { total, pagina: page, limite: limit, paginas: Math.ceil(total / limit) },
    });
  }),
  listing: handle(async (req, res) => {
    const anuncio = await domain.getListing(req.params.id, req.usuario);
    res.json({ anuncio });
  }),
  offers: handle(async (req, res) => {
    const filter = req.query.jogoId ? { jogo: domain.validId(req.query.jogoId) } : {};
    res.json({ ofertas: await PriceOffer.find(filter).populate('jogo').sort({ preco: 1 }) });
  }),
  createOffer: handle(async (req, res) =>
    res.status(201).json({ oferta: await domain.createPriceOffer(req.body, req.usuario) }),
  ),
  updateOffer: handle(async (req, res) =>
    res.json({ oferta: await domain.updatePriceOffer(req.params.id, req.body, req.usuario) }),
  ),
  reviews: handle(async (req, res) => {
    res.json({ avaliacoes: await domain.getReviews(req.query) });
  }),
  createReview: handle(async (req, res) =>
    res.status(201).json({ avaliacao: await domain.createReview(req.body, req.usuario) }),
  ),
  updateReview: handle(async (req, res) =>
    res.json({ avaliacao: await domain.updateReview(req.params.id, req.body, req.usuario) }),
  ),
  deleteReview: handle(async (req, res) => {
    await domain.deleteReview(req.params.id, req.usuario);
    res.json({ mensagem: 'Avaliação excluída.' });
  }),
  deleteOffer: handle(async (req, res) => {
    await domain.deletePriceOffer(req.params.id, req.usuario);
    res.json({ mensagem: 'Oferta excluída.' });
  }),
  savedReports: handle(async (req, res) =>
    res.json({ relatorios: await reports.getReports(req.query.tipo, req.usuario) }),
  ),
  savedReport: handle(async (req, res) =>
    res.json({ relatorio: await reports.getReport(req.params.id, req.usuario) }),
  ),
  generateReport: handle(async (req, res) =>
    res.status(201).json({
      relatorio: await reports.generateReport(req.body.tipo, req.body.descricao, req.usuario),
    }),
  ),
  deleteReport: handle(async (req, res) => {
    await reports.deleteReport(req.params.id, req.usuario);
    res.json({ mensagem: 'Relatório excluído.' });
  }),
  deleteGame: handle(async (req, res) => {
    await domain.deleteGame(req.params.id, req.usuario);
    res.json({ mensagem: 'Jogo excluído.' });
  }),
  deleteUser: handle(async (req, res) => {
    await domain.deleteUser(req.params.id, req.usuario);
    res.json({ mensagem: 'Usuário excluído.' });
  }),
};
