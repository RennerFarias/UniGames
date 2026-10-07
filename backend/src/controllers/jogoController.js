const Game = require('../models/Game');
const PriceOffer = require('../models/PriceOffer');
const domain = require('../services/domainService');
const { handle } = require('./integrationController');

const gameFields = (input) => {
  const fields = {};
  for (const key of [
    'titulo',
    'descricao',
    'generos',
    'plataformas',
    'imagemCapa',
    'linksReferencia',
  ]) {
    if (input[key] !== undefined) fields[key] = input[key];
  }
  return fields;
};

function positiveInteger(value, fallback, field) {
  if (value === undefined) return fallback;
  const number = Number(value);
  if (!Number.isInteger(number) || number < 1) {
    domain.error(`Informe um ${field} inteiro maior que zero.`);
  }
  return number;
}

const cadastrarJogo = handle(async (req, res) => {
  const jogo = await Game.create(gameFields(req.body));
  res.status(201).json({
    status: 'Sucesso',
    message: 'Jogo cadastrado com sucesso!',
    jogo,
  });
});

const listarJogos = handle(async (req, res) => {
  const { titulo, search, genero, plataforma } = req.query;
  const pagina = positiveInteger(req.query.pagina, 1, 'número de página');
  const limite = Math.min(100, positiveInteger(req.query.limite, 50, 'limite'));
  const filtro = {};
  const pesquisa = String(titulo || search || '').trim();

  if (pesquisa) {
    filtro.titulo = {
      $regex: pesquisa.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      $options: 'i',
    };
  }
  if (genero) filtro.generos = genero;
  if (plataforma) filtro.plataformas = plataforma;

  const [jogos, total] = await Promise.all([
    Game.find(filtro)
      .sort({ createdAt: -1 })
      .skip((pagina - 1) * limite)
      .limit(limite),
    Game.countDocuments(filtro),
  ]);

  res.json({
    status: 'Sucesso',
    jogos,
    paginacao: { total, pagina, limite, paginas: Math.ceil(total / limite) },
  });
});

const obterJogoPorId = handle(async (req, res) => {
  const id = domain.validId(req.params.id);
  const jogo = await Game.findById(id);
  if (!jogo) domain.error('Jogo não encontrado.', 'NOT_FOUND');
  const ofertas = await PriceOffer.find({ jogo: id }).sort({ preco: 1 });
  res.json({ status: 'Sucesso', jogo, ofertas });
});

const atualizarJogo = handle(async (req, res) => {
  const id = domain.validId(req.params.id);
  const jogo = await Game.findByIdAndUpdate(
    id,
    { $set: gameFields(req.body) },
    { returnDocument: 'after', runValidators: true },
  );
  if (!jogo) domain.error('Jogo não encontrado.', 'NOT_FOUND');
  res.json({ status: 'Sucesso', message: 'Jogo atualizado com sucesso!', jogo });
});

module.exports = { cadastrarJogo, listarJogos, obterJogoPorId, atualizarJogo };
