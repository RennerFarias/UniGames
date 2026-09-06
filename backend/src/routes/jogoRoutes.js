const express = require('express');
const router = express.Router();
const { autenticar } = require('../middlewares/authMiddleware');
const {
    cadastrarJogo,
    listarJogos,
    obterJogoPorId,
    atualizarJogo,
    deletarJogo
} = require('../controllers/jogoController');

router.get('/jogos', listarJogos);
router.get('/jogos/:id', obterJogoPorId);

// Rotas protegidas por JWT
router.post('/jogos', autenticar, cadastrarJogo);
router.put('/jogos/:id', autenticar, atualizarJogo);
router.delete('/jogos/:id', autenticar, deletarJogo);

module.exports = router;
