const express = require('express');
const router = express.Router();
const EvaluacionController = require('../controllers/EvaluacionController');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

// Listado principal
router.get('/secciones', EvaluacionController.getAllSecciones);
router.post('/crear', EvaluacionController.crearEvaluacion);

// Catálogos
router.get('/estrategias', EvaluacionController.getEstrategias);
router.get('/carreras', EvaluacionController.getCarreras);
router.get('/rubricas-activas', EvaluacionController.getRubricasActivas);

// Jerarquía académica
router.get('/:id_seccion', EvaluacionController.getEvaluacionesFromSeccion);
router.get('/carrera/:carreraCodigo/materias', EvaluacionController.getMateriasByCarrera);
router.get('/materia/:materiaCodigo/:carreraCodigo/secciones', EvaluacionController.getSecciones);
router.get('/seccion/:seccionId/estudiantes', EvaluacionController.getEstudiantesBySeccion);
router.get('/seccion/:seccionId/horario', EvaluacionController.getHorarioBySeccion);

// CRUD

router.get('/detalle/:id', EvaluacionController.getEvaluacionById);
router.put('/update/:id', EvaluacionController.updateEvaluacion);

module.exports = router;
