const dns = require('dns');
dns.setServers(['8.8.8.8']);

require('dotenv').config();

const express = require('express');
const conectarBanco = require('./database');

const authRoutes = require('./routes/authRoutes');
const jogoRoutes = require('./routes/jogoRoutes');
const revendaRoutes = require('./routes/revendaRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');

const app = express();

app.use(express.json());
app.use(usuarioRoutes);

conectarBanco();

app.use(authRoutes);
app.use(jogoRoutes);
app.use(revendaRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});