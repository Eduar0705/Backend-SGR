const express = require('express');
const router = express.Router();
const PeriodosController = require('../controllers/PeriodosController');
const authMiddleware = require('../middleware/auth.middleware');

// Todas las rutas de permisos requieren autenticación
router.use(authMiddleware);

router.get('/', PeriodosController.getPeriodos);
router.post('/crear', PeriodosController.createPeriodo);
router.delete('/delete/:codigo_periodo', PeriodosController.deletePeriodo)

router.get('/cortes', PeriodosController.getCortes);
router.post('/crearcorte', PeriodosController.createCorte);
router.delete('/deletecorte/:codigo_periodo/:orden', PeriodosController.deleteCorte);
router.put('/updcortes/:codigo_periodo/:orden', PeriodosController.updateCorte);

router.get('/lapsos', PeriodosController.getLapsos);
router.post('/lapsos/crear', PeriodosController.createLapso);
router.put('/lapsos/update/:id', PeriodosController.updateLapso);
router.delete('/lapsos/delete/:id', PeriodosController.deleteLapso);

router.get('/pensums', PeriodosController.getPensums)

module.exports = router;