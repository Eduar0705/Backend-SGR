const express = require('express');
const router = express.Router();
const PeriodosController = require('../controllers/PeriodosController');
const authMiddleware = require('../middleware/auth.middleware');

// Todas las rutas de permisos requieren autenticación
router.use(authMiddleware);
//Para obtener todos los periodos
router.get('/', PeriodosController.getPeriodos);
router.get('/cortes', PeriodosController.getCortes);
router.put('/cortes/:codigo_periodo/:orden', PeriodosController.updateCorte);

module.exports = router;