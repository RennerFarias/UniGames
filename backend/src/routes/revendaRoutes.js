const router = require('express').Router();
const { autenticar } = require('../middlewares/authMiddleware');
const c = require('../controllers/integrationController');
// A rota estática precisa vir antes de /anuncios/:id.
router.get('/anuncios/meus', autenticar, c.myListings);
router.get('/anuncios', c.listListings);
router.post('/anuncios', autenticar, c.createListing);
router.get('/anuncios/:id', c.listing);
router.put('/anuncios/:id', autenticar, c.updateListing);
router.delete('/anuncios/:id', autenticar, c.deleteListing);
module.exports = router;
