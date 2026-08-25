require('dotenv').config();
const express = require('express');
const conectarBanco = require('./database');
const testeAtlasRoutes = require('./routes/testeAtlasRoutes');
const app = express();
app.use(express.json());
conectarBanco();
app.use(testeAtlasRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});