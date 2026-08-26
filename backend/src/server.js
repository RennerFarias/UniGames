require('dotenv').config();
const express = require('express');
const conectarBanco = require('./database');
const jogoRoutes = require('./routes/jogoRoutes');
const app = express();
app.use(express.json());
conectarBanco();
app.use(jogoRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});