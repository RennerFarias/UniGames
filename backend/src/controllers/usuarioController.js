const User = require('../models/User');
const users = require('../services/userService');
const domain = require('../services/domainService');
const { handle } = require('./integrationController');

const obterPerfil = handle(async (req, res) => {
  res.json({ usuario: await users.getProfile(req.usuario) });
});

const atualizarPerfil = handle(async (req, res) => {
  res.json({ usuario: await users.updateProfile(req.body, req.usuario) });
});

const listarUsuarios = handle(async (_, res) => {
  res.json({ usuarios: await User.find().select('-senha').sort({ nome: 1 }) });
});

const tornarRevendedor = handle(async (req, res) => {
  res.json({ usuario: await domain.tornarRevendedor(req.body.dataNascimento, req.usuario) });
});

const obterUsuarioPublico = handle(async (req, res) => {
  domain.validId(req.params.id);
  const usuario = await User.findById(req.params.id).select(
    'nome perfil foto revendedor createdAt updatedAt',
  );
  if (!usuario) domain.error('Usuário não encontrado.', 'NOT_FOUND');
  res.json({ usuario });
});

module.exports = {
  obterUsuarioPublico,
  obterPerfil,
  atualizarPerfil,
  listarUsuarios,
  tornarRevendedor,
};
