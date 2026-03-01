const express = require('express');
const router = express.Router();
const StudentEvaluacionesController = require('../controllers/StudentEvaluacionesController');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

// GET /api/student/evaluaciones → Listar evaluaciones del estudiante
router.get('/', StudentEvaluacionesController.getEvaluaciones);

// GET /api/student/evaluaciones/:id/detalles → Detalle de una evaluación
router.get('/:id/detalles', StudentEvaluacionesController.getDetalleEvaluacion);

module.exports = router;
