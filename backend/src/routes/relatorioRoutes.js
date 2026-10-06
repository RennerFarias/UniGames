const express = require('express');
const router = express.Router();
const {
  obterOfertasDestaque,
  obterHistoricoPrecos,
} = require('../controllers/relatorioController');

router.get('/relatorios/ofertas-destaque', obterOfertasDestaque);
router.get('/relatorios/historico-precos/:jogoId', obterHistoricoPrecos);

module.exports = router;
