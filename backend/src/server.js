const dns = require('dns');
dns.setServers(['8.8.8.8']);

require('dotenv').config();

const express = require('express');
const conectarBanco = require('./database');

const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json());

conectarBanco();

app.use(authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});