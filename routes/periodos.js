const express = require('express');
const router = express.Router();
const PeriodosController = require('../controllers/PeriodosController');
const authMiddleware = require('../middleware/auth.middleware');

// Todas las rutas de permisos requieren autenticación
router.use(authMiddleware);
//Para obtener todos los periodos
router.get('/', PeriodosController.getPeriodos);

module.exports = router;