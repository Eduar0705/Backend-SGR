const express = require('express');
const router = express.Router();
const TeacherEvaluacionesController = require('../controllers/TeacherEvaluacionesController');
const authMiddleware = require('../middleware/auth.middleware');

// Todas las rutas de teacher evaluaciones están protegidas
router.use(authMiddleware);

// Listar evaluaciones del docente (o todas si es admin)
router.get('/', TeacherEvaluacionesController.getEvaluaciones);

// Opciones en cascada y datos
router.get('/carreras', TeacherEvaluacionesController.getCarreras);
router.get('/carrera/:carreraCodigo/materias', TeacherEvaluacionesController.getMaterias);
router.get('/materia/:materiaCodigo/secciones', TeacherEvaluacionesController.getSecciones);
router.get('/seccion/:seccionId/estudiantes', TeacherEvaluacionesController.getEstudiantes);
router.get('/rubricas/activas', TeacherEvaluacionesController.getRubricasActivas);

// Crear nuevas evaluaciones
router.post('/crear', TeacherEvaluacionesController.crearEvaluaciones);

// Detalles de la evaluación para calificar o ver
router.get('/:evaluacionId/:estudianteCedula/detalles', TeacherEvaluacionesController.getDetalles);

// Guardar evaluación (Calificar / Reprobar)
router.post('/:evaluacionId/:estudianteCedula/guardar', TeacherEvaluacionesController.saveEvaluacion);

module.exports = router;
