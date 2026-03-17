const express = require('express');
const router = express.Router();
const EvaluacionController = require('../controllers/EvaluacionController');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

// Listado principal
router.get('/', EvaluacionController.getAllEvaluaciones);

// Catálogos
router.get('/estrategias', EvaluacionController.getEstrategias);
router.get('/cortes', EvaluacionController.getCortes);
router.get('/carreras', EvaluacionController.getCarreras);
router.get('/rubricas-activas', EvaluacionController.getRubricasActivas);

// Jerarquía académica
router.get('/carrera/:carreraCodigo/materias', EvaluacionController.getMateriasByCarrera);
router.get('/materia/:materiaCodigo/:carreraCodigo/secciones', EvaluacionController.getSecciones);
router.get('/seccion/:seccionId/estudiantes', EvaluacionController.getEstudiantesBySeccion);
router.get('/seccion/:seccionId/horario', EvaluacionController.getHorarioBySeccion);

// CRUD
router.post('/crear', EvaluacionController.crearEvaluacion);
router.get('/:id', EvaluacionController.getEvaluacionById);
router.put('/:id', EvaluacionController.updateEvaluacion);

module.exports = router;
