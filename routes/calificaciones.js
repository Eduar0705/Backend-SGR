const express = require('express');
const router = express.Router();
const CalificacionesController = require('../controllers/CalificacionesController');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

// GET /api/calificaciones → Obtener calificaciones del estudiante autenticado
router.get('/', CalificacionesController.getCalificaciones);

module.exports = router;
