const express = require('express');
const router = express.Router();
const integration = require('../controllers/integrationController');
const {
    obterPerfil,
    atualizarPerfil,
    listarUsuarios,
    tornarRevendedor
} = require('../controllers/usuarioController');
const { autenticar, autorizar } = require('../middlewares/authMiddleware');

router.get('/usuarios', autenticar, autorizar('admin'), listarUsuarios);
router.get('/usuarios/perfil', autenticar, obterPerfil);
router.put('/usuarios/perfil', autenticar, atualizarPerfil);
router.post('/usuarios/revendedor', autenticar, tornarRevendedor);
router.delete('/usuarios/:id', autenticar, autorizar('admin'), integration.deleteUser);

module.exports = router;