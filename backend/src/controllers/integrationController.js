const domain = require('../services/domainService');
const Listing = require('../models/Listing');
const PriceOffer = require('../models/PriceOffer');
const Review = require('../models/Review');
const handle = fn => async (req, res) => { try { await fn(req, res); } catch (error) { const codes = { UNAUTHENTICATED: 401, FORBIDDEN: 403, NOT_FOUND: 404, BAD_USER_INPUT: 400 }; const status = codes[error.extensions?.code] || (['ValidationError', 'CastError'].includes(error.name) ? 400 : 500); res.status(status).json({ mensagem: error.code === 11000 ? 'Este registro já está cadastrado.' : error.message }); } };
module.exports = {
  handle,
  createListing: handle(async (req, res) => res.status(201).json({ anuncio: await domain.createListing({ ...req.body, jogoId: req.body.jogo }, req.usuario) })),
  updateListing: handle(async (req, res) => res.json({ anuncio: await domain.updateListing(req.params.id, req.body, req.usuario) })),
  deleteListing: handle(async (req, res) => { await domain.deleteListing(req.params.id, req.usuario); res.json({ mensagem: 'Anúncio excluído.' }); }),
  myListings: handle(async (req, res) => res.json({ anuncios: await domain.getMyListings(req.usuario) })),
  myReport: handle(async (req, res) => res.json({ relatorio: await domain.getMyReport(req.usuario) })),
  listListings: handle(async (req, res) => {
    const page = Math.max(1, Number.parseInt(req.query.pagina) || 1); const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limite) || 10));
    const query = { ...domain.publicListings };
    if (req.query.plataforma) query.plataforma = req.query.plataforma;
    if (req.query.estadoConservacao) query.estadoConservacao = req.query.estadoConservacao;
    const [anuncios, total] = await Promise.all([domain.populated(Listing.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit)), Listing.countDocuments(query)]);
    res.json({ anuncios, paginacao: { total, pagina: page, limite: limit, paginas: Math.ceil(total / limit) } });
  }),
  listing: handle(async (req, res) => { domain.validId(req.params.id); const anuncio = await domain.populated(Listing.findById(req.params.id)); if (!anuncio) domain.error('Anúncio não encontrado.', 'NOT_FOUND'); res.json({ anuncio }); }),
  offers: handle(async (req, res) => { const filter = req.query.jogoId ? { jogo: domain.validId(req.query.jogoId) } : {}; res.json({ ofertas: await PriceOffer.find(filter).populate('jogo').sort({ preco: 1 }) }); }),
  createOffer: handle(async (req, res) => res.status(201).json({ oferta: await domain.createPriceOffer(req.body, req.usuario) })),
  updateOffer: handle(async (req, res) => res.json({ oferta: await domain.updatePriceOffer(req.params.id, req.body, req.usuario) })),
  reviews: handle(async (req, res) => { const query = {}; if (req.query.jogoId) query.jogo = domain.validId(req.query.jogoId); if (req.query.usuarioId) query.avaliadoUser = domain.validId(req.query.usuarioId); res.json({ avaliacoes: await Review.find(query).populate('avaliador avaliadoUser jogo').sort({ createdAt: -1 }) }); }),
  createReview: handle(async (req, res) => res.status(201).json({ avaliacao: await domain.createReview(req.body, req.usuario) })),
  deleteGame: handle(async (req, res) => { await domain.deleteGame(req.params.id, req.usuario); res.json({ mensagem: 'Jogo excluído.' }); }),
  deleteUser: handle(async (req, res) => { await domain.deleteUser(req.params.id, req.usuario); res.json({ mensagem: 'Usuário excluído.' }); }),
};
