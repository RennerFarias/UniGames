const express = require('express');
const router = express.Router();
const {
    obterPerfil,
    atualizarPerfil,
    removerUsuario
} = require('../controllers/usuarioController');
const { autenticar, autorizar } = require('../middlewares/authMiddleware');

router.get('/usuarios/perfil', autenticar, obterPerfil);
router.put('/usuarios/perfil', autenticar, atualizarPerfil);
router.delete('/usuarios/:id', autenticar, autorizar('admin'), removerUsuario);

module.exports = router;