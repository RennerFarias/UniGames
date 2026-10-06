const router = require('express').Router();
const { autenticar, identificarUsuario } = require('../middlewares/authMiddleware');
const c = require('../controllers/integrationController');

router.get('/anuncios/meus', autenticar, c.myListings);
router.get('/anuncios', c.listListings);
router.post('/anuncios', autenticar, c.createListing);
router.get('/anuncios/:id', identificarUsuario, c.listing);
router.put('/anuncios/:id', autenticar, c.updateListing);
router.delete('/anuncios/:id', autenticar, c.deleteListing);
module.exports = router;
