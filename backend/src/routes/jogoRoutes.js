const express = require('express');
const router = express.Router();
const integration = require('../controllers/integrationController');
const { autenticar, autorizar } = require('../middlewares/authMiddleware');
const {
    cadastrarJogo,
    listarJogos,
    obterJogoPorId,
    atualizarJogo
} = require('../controllers/jogoController');

router.get('/jogos', listarJogos);
router.get('/jogos/:id', obterJogoPorId);

// Rotas protegidas por JWT
router.post('/jogos', autenticar, autorizar('admin'), cadastrarJogo);
router.put('/jogos/:id', autenticar, autorizar('admin'), atualizarJogo);
router.delete('/jogos/:id', autenticar, autorizar('admin'), integration.deleteGame);

module.exports = router;
