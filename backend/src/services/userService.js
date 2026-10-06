const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const domain = require('./domainService');

const normalizeEmail = (value) =>
  String(value || '')
    .trim()
    .toLowerCase();
const validEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function birthDate(value) {
  if (value == null || value === '') return undefined;

  const text = value instanceof Date ? value.toISOString().slice(0, 10) : String(value);
  const date = new Date(text + 'T00:00:00.000Z');

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(text) ||
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== text ||
    date > new Date()
  ) {
    domain.error('Informe uma data de nascimento válida no formato AAAA-MM-DD.');
  }

  return date;
}

function authPayload(usuario) {
  const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return { token, usuario };
}

async function register(input) {
  const nome = String(input.nome || '').trim();
  const email = normalizeEmail(input.email);

  if (!nome || !validEmail(email) || typeof input.senha !== 'string' || input.senha.length < 6) {
    domain.error('Informe nome, e-mail válido e senha com pelo menos 6 caracteres.');
  }

  if (await User.exists({ email })) domain.error('E-mail já cadastrado.');

  const usuario = await User.create({
    nome,
    email,
    senha: await bcrypt.hash(input.senha, 10),
    dataNascimento: birthDate(input.dataNascimento),
  });

  return authPayload(usuario);
}

async function login(input) {
  const usuario = await User.findOne({ email: normalizeEmail(input.email) });
  const senhaValida =
    usuario &&
    typeof input.senha === 'string' &&
    (await bcrypt.compare(input.senha, usuario.senha));

  if (!senhaValida) domain.error('E-mail ou senha inválidos.', 'INVALID_CREDENTIALS');
  return authPayload(usuario);
}

async function getProfile(user) {
  domain.requireUser(user);
  const usuario = await User.findById(user.id).select('-senha');
  if (!usuario) domain.error('Sessão inválida.', 'UNAUTHENTICATED');
  return usuario;
}

async function updateProfile(input, user) {
  domain.requireUser(user);
  const fields = {};

  if (input.nome !== undefined) {
    fields.nome = String(input.nome || '').trim();
    if (!fields.nome) domain.error('Informe seu nome.');
  }

  if (input.email !== undefined) {
    fields.email = normalizeEmail(input.email);
    if (!validEmail(fields.email)) domain.error('E-mail inválido.');
    if (await User.exists({ email: fields.email, _id: { $ne: user.id } })) {
      domain.error('Este e-mail já está cadastrado.');
    }
  }

  if (input.foto !== undefined) fields.foto = String(input.foto || '').trim();

  if (input.dataNascimento !== undefined) {
    fields.dataNascimento = birthDate(input.dataNascimento);
    if (!fields.dataNascimento) domain.error('Informe sua data de nascimento.');
    if (user.revendedor && domain.calcularIdade(fields.dataNascimento) < 16) {
      domain.error('Revendedores precisam ter pelo menos 16 anos.', 'FORBIDDEN');
    }
  }

  if (input.senha) {
    if (typeof input.senha !== 'string' || input.senha.length < 6) {
      domain.error('A senha deve ter pelo menos 6 caracteres.');
    }
    fields.senha = await bcrypt.hash(input.senha, 10);
  }

  const updated = await User.findByIdAndUpdate(
    user.id,
    { $set: fields },
    {
      returnDocument: 'after',
      runValidators: true,
    },
  ).select('-senha');

  if (!updated) domain.error('Sessão inválida.', 'UNAUTHENTICATED');
  return updated;
}

async function userFromToken(authorization = '') {
  const [type, token] = authorization.split(' ');
  if (type !== 'Bearer' || !token) return null;

  let claims;
  try {
    claims = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (['JsonWebTokenError', 'TokenExpiredError', 'NotBeforeError'].includes(error.name)) {
      return null;
    }
    throw error;
  }

  if (!claims.id || !mongoose.isValidObjectId(claims.id)) return null;
  const user = await User.findById(claims.id).select('perfil email dataNascimento revendedor');
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    perfil: user.perfil,
    dataNascimento: user.dataNascimento,
    revendedor: user.revendedor,
  };
}

module.exports = { register, login, getProfile, updateProfile, userFromToken, birthDate };
