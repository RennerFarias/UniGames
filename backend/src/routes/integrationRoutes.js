const router = require('express').Router();
const { autenticar, autorizar } = require('../middlewares/authMiddleware');
const c = require('../controllers/integrationController');
router.get('/ofertas', c.offers);
router.post('/ofertas', autenticar, autorizar('admin'), c.createOffer);
router.put('/ofertas/:id', autenticar, autorizar('admin'), c.updateOffer);
router.get('/avaliacoes', c.reviews);
router.post('/avaliacoes', autenticar, c.createReview);
router.get('/relatorios/minha-atividade', autenticar, c.myReport);

router.delete('/ofertas/:id', autenticar, autorizar('admin'), c.deleteOffer);
router.put('/avaliacoes/:id', autenticar, c.updateReview);
router.delete('/avaliacoes/:id', autenticar, c.deleteReview);
router.get('/relatorios/salvos', autenticar, autorizar('admin'), c.savedReports);
router.get('/relatorios/salvos/:id', autenticar, autorizar('admin'), c.savedReport);
router.post('/relatorios/salvos', autenticar, autorizar('admin'), c.generateReport);
router.delete('/relatorios/salvos/:id', autenticar, autorizar('admin'), c.deleteReport);

module.exports = router;
