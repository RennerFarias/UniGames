const router = require('express').Router();
const { autenticar, identificarUsuario } = require('../middlewares/authMiddleware');
const c = require('../controllers/integrationController');

router.get(['/revendas/meus', '/anuncios/meus'], autenticar, c.myListings);
router.get(['/revendas', '/anuncios'], c.listListings);
router.post(['/revendas', '/anuncios'], autenticar, c.createListing);
router.get(['/revendas/:id', '/anuncios/:id'], identificarUsuario, c.listing);
router.put(['/revendas/:id', '/anuncios/:id'], autenticar, c.updateListing);
router.delete(['/revendas/:id', '/anuncios/:id'], autenticar, c.deleteListing);
module.exports = router;
