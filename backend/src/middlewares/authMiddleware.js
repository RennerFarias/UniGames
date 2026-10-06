const { userFromToken } = require('../services/userService');

async function autenticar(req, res, next) {
  try {
    req.usuario = await userFromToken(req.headers.authorization);
    if (!req.usuario) {
      return res.status(401).json({ mensagem: 'Entre na sua conta para continuar.' });
    }
    next();
  } catch {
    res.status(503).json({ mensagem: 'Não foi possível validar sua sessão. Tente novamente.' });
  }
}

const autorizar =
  (...perfis) =>
  (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ mensagem: 'Entre na sua conta para continuar.' });
    }
    if (!perfis.includes(req.usuario.perfil)) {
      return res.status(403).json({ mensagem: 'Usuário não possui permissão.' });
    }
    next();
  };

async function identificarUsuario(req, res, next) {
  try {
    req.usuario = await userFromToken(req.headers.authorization);
    next();
  } catch {
    res.status(503).json({ mensagem: 'Não foi possível validar sua sessão. Tente novamente.' });
  }
}

module.exports = { autenticar, autorizar, identificarUsuario };
