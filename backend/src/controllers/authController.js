const users = require('../services/userService');
const { handle } = require('./integrationController');

const cadastrarUsuario = handle(async (req, res) => {
  const payload = await users.register(req.body);
  const usuario = payload.usuario.toObject();
  delete usuario.senha;
  res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso.', usuario });
});

const login = handle(async (req, res) => {
  const payload = await users.login(req.body);
  const usuario = payload.usuario.toObject();
  delete usuario.senha;
  res.json({ token: payload.token, usuario });
});

module.exports = { cadastrarUsuario, login };
