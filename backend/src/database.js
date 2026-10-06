const dns = require('node:dns');
const mongoose = require('mongoose');

async function conectarBanco() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('Configure MONGODB_URI no arquivo backend/.env.');
  }

  const servidoresDns = process.env.MONGODB_DNS_SERVERS;
  if (servidoresDns) {
    dns.setServers(servidoresDns.split(',').map((endereco) => endereco.trim()));
  }

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log('MongoDB conectado com sucesso!');
  return mongoose.connection;
}

module.exports = conectarBanco;
