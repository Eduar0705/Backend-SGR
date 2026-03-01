const express = require('express');
const router = express.Router();
const AcademicoController = require('../controllers/AcademicoController');
const authMiddleware = require('../middleware/auth.middleware');
const evaluacionesRouter = require('./evaluaciones');

// Rutas generales
router.get('/carreras', AcademicoController.getCarreras);
router.get('/estrategias_eval', AcademicoController.getEstrategias);
router.get('/tipos-rubrica', AcademicoController.getTiposRubrica);

// Integrar Evaluaciones como sub-ruta: /api/evaluaciones
router.use('/evaluaciones', evaluacionesRouter);

// Rutas con prefijo admin
router.get('/admin/semestres/:carreraCodigo', AcademicoController.getSemestres);
router.get('/admin/materias/:carreraCodigo/:semestreId', AcademicoController.getMaterias);
router.get('/admin/secciones/:materiaCodigo/:carreraCodigo', AcademicoController.getSecciones);
router.get('/admin/evaluaciones/:seccionId', AcademicoController.getEvaluaciones); // Agregada
router.get('/admin/evaluacion/:evalId', AcademicoController.getEvaluacionDetalle);

module.exports = router;
