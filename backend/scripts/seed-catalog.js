// Acrescenta o catálogo de exemplo sem apagar documentos ou sobrescrever jogos existentes.
// Nenhuma oferta de preço fictícia é gravada no banco. Cadastre ofertas no painel de administração.
const path = require('node:path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Game = require('../src/models/Game');
const User = require('../src/models/User');
async function run() {
  if (!process.env.MONGODB_URI) throw new Error('Configure MONGODB_URI em backend/.env.');
  await mongoose.connect(process.env.MONGODB_URI);
  const { demoGames } = await import('../../frontend/src/data/catalog.js');
  let created = 0;
  for (const { _demo, id, createdAt, updatedAt, ...game } of demoGames) {
    if (!await Game.exists({ titulo: game.titulo })) { await Game.create(game); created++; }
  }
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (email && password) {
    if (password.length < 8 || password.startsWith('defina-')) throw new Error('Defina SEED_ADMIN_PASSWORD com uma senha de pelo menos 8 caracteres.');
    if (!await User.exists({ email })) {
      await User.create({ nome: 'Administrador UniGames', email, senha: await bcrypt.hash(password, 10), perfil: 'admin' });
      console.log('Administrador criado com o e-mail configurado.');
    } else console.log('Usuário existente preservado; perfil e senha não foram alterados.');
  }
  console.log(`${created} jogos acrescentados. Catálogo existente preservado.`);
}
run().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => mongoose.disconnect());
