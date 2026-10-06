// Regras compartilhadas entre REST e GraphQL, para manter as duas integrações equivalentes.
const { GraphQLError } = require('graphql');
const mongoose = require('mongoose');
const Game = require('../models/Game');
const Listing = require('../models/Listing');
const PriceOffer = require('../models/PriceOffer');
const Review = require('../models/Review');
const User = require('../models/User');
const error = (message, code = 'BAD_USER_INPUT') => { throw new GraphQLError(message, { extensions: { code } }); };

const requireUser = user => user || error('Sua sessão expirou. Entre novamente.', 'UNAUTHENTICATED');

const requireAdmin = user => { requireUser(user); if (user.perfil !== 'admin') error('Apenas administradores podem realizar esta ação.', 'FORBIDDEN'); };

const validId = id => { if (!mongoose.isValidObjectId(id)) error('Identificador inválido.'); return id; };

const existsGame = async id => { validId(id); if (!await Game.exists({ _id: id })) error('Jogo não encontrado.', 'NOT_FOUND'); };

const publicListings = { $or: [{ status: 'ativo' }, { status: { $exists: false } }] };

const populated = query => query.populate('jogo').populate('vendedor', 'nome perfil');

const ownListing = async (id, user) => {
  requireUser(user); validId(id);
  const row = await Listing.findById(id);
  if (!row) error('Anúncio não encontrado.', 'NOT_FOUND');
  if (String(row.vendedor) !== String(user.id) && user.perfil !== 'admin') error('Você só pode alterar seus próprios anúncios.', 'FORBIDDEN');
  return row;
};

const priceCheck = (price, field = 'preço') => { if (typeof price !== 'number' || !Number.isFinite(price) || price < 0) error(`Informe um ${field} válido e não negativo.`); };

const checkUrl = url => { if (!url) return; try { const parsed = new URL(url); if (['http:', 'https:'].includes(parsed.protocol)) return; } catch {} error('Use um link HTTP ou HTTPS válido.'); };

const listingFields = input => {
  const fields = {}; ['preco', 'estadoConservacao', 'plataforma', 'contato', 'descricao', 'status'].forEach(key => { if (input[key] !== undefined) fields[key] = input[key]; });
  if (fields.preco !== undefined) priceCheck(fields.preco);
  if (fields.contato) fields.contato = { nome: String(fields.contato.nome || '').trim(), info: String(fields.contato.info || '').trim() };
  if (fields.status && !['ativo', 'vendido', 'pausado'].includes(fields.status)) error('Status de anúncio inválido.');
  return fields;
};
function offerFields(input) {
  const fields = {}; ['loja', 'preco', 'precoOriginal', 'urlLoja'].forEach(key => { if (input[key] !== undefined) fields[key] = input[key]; });
  if (fields.preco !== undefined) priceCheck(fields.preco);
  if (fields.precoOriginal != null) priceCheck(fields.precoOriginal, 'preço original');
  if (fields.urlLoja !== undefined) checkUrl(fields.urlLoja);
  if (fields.loja !== undefined) { fields.loja = String(fields.loja).trim(); if (!fields.loja) error('Informe o nome da loja.'); }
  return fields;
}

const discount = (price, original) => original > price ? Math.round((1 - price / original) * 100) : 0;
async function createListing(input, user) {
  requireUser(user); 
  if (user.revendedor !== true && user.perfil !== 'admin') error('Apenas revendedores podem criar anúncios.', 'FORBIDDEN');
  await existsGame(input.jogoId); priceCheck(input.preco);
  const row = await Listing.create({ ...listingFields(input), jogo: input.jogoId, vendedor: user.id, status: 'ativo', vendidoEm: null });
  return populated(Listing.findById(row.id));
}
async function updateListing(id, input, user) {
  const previous = await ownListing(id, user); const fields = listingFields(input);
  const status = fields.status || previous.status || 'ativo';
  fields.vendidoEm = status === 'vendido' ? previous.vendidoEm || new Date() : null;
  return populated(Listing.findByIdAndUpdate(id, { $set: fields }, { new: true, runValidators: true }));
}
async function deleteListing(id, user) { await ownListing(id, user); await Listing.deleteOne({ _id: id }); return true; }
async function getMyListings(user) { requireUser(user); return populated(Listing.find({ vendedor: user.id }).sort({ createdAt: -1 })); }
async function getMyReport(user) {
  const rows = await getMyListings(user); const sold = rows.filter(row => row.status === 'vendido'); const counts = {};
  rows.forEach(row => counts[row.plataforma] = (counts[row.plataforma] || 0) + 1);
  return { totalAnuncios: rows.length, anunciosAtivos: rows.filter(row => row.status === 'ativo').length, anunciosVendidos: sold.length, valorVendas: sold.reduce((n, row) => n + row.preco, 0), porPlataforma: Object.entries(counts).map(([plataforma, quantidade]) => ({ plataforma, quantidade })) };
}
async function createPriceOffer(input, user) {
  requireAdmin(user); await existsGame(input.jogoId); priceCheck(input.preco);
  const fields = offerFields(input);
  const row = await PriceOffer.create({ ...fields, jogo: input.jogoId, descontoPercentual: discount(fields.preco, fields.precoOriginal), historicoPrecos: [{ preco: fields.preco, data: new Date() }] });
  return PriceOffer.findById(row.id).populate('jogo');
}
async function updatePriceOffer(id, input, user) {
  requireAdmin(user); validId(id); const previous = await PriceOffer.findById(id); if (!previous) error('Oferta não encontrada.', 'NOT_FOUND');
  const fields = offerFields(input); const price = fields.preco ?? previous.preco; const original = Object.hasOwn(fields, 'precoOriginal') ? fields.precoOriginal : previous.precoOriginal;
  fields.descontoPercentual = discount(price, original);
  const update = { $set: fields };
  if (fields.preco !== undefined) update.$push = { historicoPrecos: { preco: price, data: new Date() } };
  return PriceOffer.findByIdAndUpdate(id, update, { new: true, runValidators: true }).populate('jogo');
}
async function createReview(input, user) {
  requireUser(user);
  if (!Number.isInteger(input.nota) || input.nota < 1 || input.nota > 5) error('Escolha uma nota inteira de 1 a 5.');
  if (!input.jogoId && !input.avaliadoUserId) error('Selecione o jogo ou vendedor que deseja avaliar.');
  if (input.jogoId) await existsGame(input.jogoId);
  if (input.avaliadoUserId) { validId(input.avaliadoUserId); if (!await User.exists({ _id: input.avaliadoUserId })) error('Vendedor não encontrado.', 'NOT_FOUND'); }
  const row = await Review.create({ avaliador: user.id, jogo: input.jogoId, avaliadoUser: input.avaliadoUserId, nota: input.nota, comentario: String(input.comentario || '').trim().slice(0, 1000) });
  return Review.findById(row.id).populate('avaliador avaliadoUser jogo');
}
async function deleteGame(id, user) {
  requireAdmin(user); validId(id);
  if (await Listing.exists({ jogo: id }) || await PriceOffer.exists({ jogo: id }) || await Review.exists({ jogo: id })) error('Este jogo possui anúncios, ofertas ou avaliações vinculados e não pode ser excluído.');
  const result = await Game.deleteOne({ _id: id }); if (!result.deletedCount) error('Jogo não encontrado.', 'NOT_FOUND'); return true;
}
async function deleteUser(id, user) {
  requireAdmin(user); validId(id); if (String(id) === String(user.id)) error('Você não pode excluir sua própria conta neste painel.');
  if (await Listing.exists({ vendedor: id }) || await Review.exists({ $or: [{ avaliador: id }, { avaliadoUser: id }] })) error('Este usuário possui anúncios ou avaliações vinculados e não pode ser excluído.');
  const result = await User.deleteOne({ _id: id }); if (!result.deletedCount) error('Usuário não encontrado.', 'NOT_FOUND'); return true;
}

function calcularIdade(dataNascimento) {
  const [ano, mes, dia] = String(dataNascimento).split('-').map(Number);
  const nascimento = new Date(ano, mes - 1, dia); // construído em horário local, sem shift de UTC
  if (Number.isNaN(nascimento.getTime())) return null;
  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) idade--;
  return idade;
}

async function tornarRevendedor(dataNascimentoInput, user) {
  requireUser(user);
  if (user.revendedor) return User.findById(user.id).select('-senha');
  
  const dataFinal = dataNascimentoInput || user.dataNascimento;
  
  if (!dataFinal) {
    error('Para se tornar um revendedor, você precisa informar sua data de nascimento.', 'BAD_USER_INPUT');
  }
  
  const idadeAtiva = calcularIdade(dataFinal);
  
  if (idadeAtiva === null || idadeAtiva < 16) {
    error('Você precisa ter pelo menos 16 anos para se tornar um revendedor.', 'FORBIDDEN');
  }
  
  const updateData = { revendedor: true };
  if (dataNascimentoInput) {
    updateData.dataNascimento = new Date(dataNascimentoInput);
  }
  
  const updatedUser = await User.findByIdAndUpdate(
    user.id, 
    { $set: updateData }, 
    { new: true, runValidators: true }
  ).select('-senha');
  
  return updatedUser;
}

module.exports = { error, requireUser, requireAdmin, validId, publicListings, populated, createListing, updateListing, deleteListing, getMyListings, getMyReport, createPriceOffer, updatePriceOffer, createReview, deleteGame, deleteUser, tornarRevendedor };
