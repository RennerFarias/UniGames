const express = require('express');

const router = express.Router();

const { autenticar } = require('../middlewares/authMiddleware');

const {
    criarAnuncio,
    listarAnuncios,
    deletarAnuncio,
    obterAnuncioPorId,
    atualizarAnuncio
} = require('../controllers/revendaController');


router.post('/anuncios', autenticar, criarAnuncio);

router.get('/anuncios', listarAnuncios);

router.get('/anuncios/:id', obterAnuncioPorId);

router.put('/anuncios/:id', autenticar, atualizarAnuncio);

router.delete('/anuncios/:id', autenticar, deletarAnuncio);


module.exports = router;