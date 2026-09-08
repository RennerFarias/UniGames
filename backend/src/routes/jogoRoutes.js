const express = require('express');
const router = express.Router();
const { autenticar, autorizar } = require('../middlewares/authMiddleware');
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
router.post('/jogos', autenticar, autorizar('admin'), cadastrarJogo);
router.put('/jogos/:id', autenticar, atualizarJogo);
router.delete('/jogos/:id', autenticar, deletarJogo);

module.exports = router;
