const jwt = require('jsonwebtoken');
const User = require('../models/User');
const autenticar = async (req, res, next) => {
  const authorization = req.headers.authorization || '';
  const [tipo, token] = authorization.split(' ');
  if (tipo !== 'Bearer' || !token) return res.status(401).json({ mensagem: 'Entre na sua conta para continuar.' });
  try {
    const claims = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(claims.id).select('perfil email dataNascimento revendedor');
    if (!user) return res.status(401).json({ mensagem: 'Sessão inválida.' });
    req.usuario = { id: user.id, email: user.email, perfil: user.perfil, dataNascimento: user.dataNascimento, revendedor: user.revendedor }; next();
  } catch (error) {
    if (['JsonWebTokenError', 'TokenExpiredError', 'NotBeforeError'].includes(error.name)) return res.status(401).json({ mensagem: 'Sua sessão expirou. Entre novamente.' });
    return res.status(503).json({ mensagem: 'Não foi possível validar sua sessão. Tente novamente.' });
  }
};
const autorizar = (...perfis) => (req, res, next) => {
  if (!req.usuario) return res.status(401).json({ mensagem: 'Entre na sua conta para continuar.' });
  if (!perfis.includes(req.usuario.perfil)) return res.status(403).json({ mensagem: 'Usuário não possui permissão.' });
  next();
};
module.exports = { autenticar, autorizar };
