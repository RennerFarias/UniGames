const express = require('express');
const router = express.Router();
const {
    criarAnuncio,
    listarAnuncios,
    deletarAnuncio,
    obterAnuncioPorId,
    atualizarAnuncio
} = require('../controllers/revendaController');

router.post('/anuncios', criarAnuncio);
router.get('/anuncios', listarAnuncios);
router.get('/anuncios/:id', obterAnuncioPorId)
router.put('/anuncios/:id', atualizarAnuncio)
router.delete('/anuncios/:id', deletarAnuncio);


module.exports = router;
