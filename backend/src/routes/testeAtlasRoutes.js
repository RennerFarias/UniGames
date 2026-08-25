const express = require('express');
const router = express.Router();
const { testarConexao, enviarDado } = require('../controllers/testeAtlasController');

router.get('/testeAtlas', testarConexao);
router.post('/testeAtlas', enviarDado);

module.exports = router;
