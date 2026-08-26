const express = require('express');
const router = express.Router();
const {
    cadastrarJogo,
    listarJogos,
    obterJogoPorId,
    atualizarJogo,
    deletarJogo
} = require('../controllers/jogoController');

router.post('/jogos', cadastrarJogo);
router.get('/jogos', listarJogos);
router.get('/jogos/:id', obterJogoPorId);
router.put('/jogos/:id', atualizarJogo);
router.delete('/jogos/:id', deletarJogo);

module.exports = router;
