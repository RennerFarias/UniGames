const express = require('express');
const router = express.Router();
const {
    criarAnuncio,
    listarAnuncios,
    deletarAnuncio
} = require('../controllers/revendaController');

router.post('/anuncios', criarAnuncio);
router.get('/anuncios', listarAnuncios);
router.delete('/anuncios/:id', deletarAnuncio);

module.exports = router;
