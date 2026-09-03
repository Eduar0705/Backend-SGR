const express = require('express');
const router = express.Router();
const TeacherRubricaController = require('../controllers/TeacherRubricaController');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

// GET /api/teacher/rubricas/form-data → Datos iniciales del formulario
router.get('/form-data', TeacherRubricaController.getFormData);

// Cascade API
router.get('/semestres/:carrera', TeacherRubricaController.getSemestres);
router.get('/materias/:carrera/:semestre', TeacherRubricaController.getMaterias);
router.get('/secciones/:materia', TeacherRubricaController.getSecciones);
router.get('/evaluaciones/:seccionId', TeacherRubricaController.getEvaluaciones);

// POST /api/teacher/rubricas → Crear rúbrica
router.post('/', TeacherRubricaController.crearRubrica);

// GET /api/teacher/rubricas → Listar rúbricas
router.get('/', TeacherRubricaController.getRubricas);

// GET /api/teacher/rubricas/detalle/:id/:id_eval → Ver rúbrica
router.get('/detalle/:id/:id_eval', TeacherRubricaController.getRubricaDetalle);

// GET /api/teacher/rubricas/editar/:id/:id_eval → Obtener rúbrica para editar
router.get('/editar/:id/:id_eval', TeacherRubricaController.getRubricaForEdit);

// GET /api/teacher/rubricas/duplicar/:id/:id_eval → Obtener rúbrica para editar
router.get('/duplicar/:id/:id_eval', TeacherRubricaController.getRubricaForDuplica);

// PUT /api/teacher/rubricas/:id → Editar rúbrica
router.put('/:id', TeacherRubricaController.updateRubrica);

// DELETE /api/teacher/rubricas/unlink/:id/:id_eval → desvincular rúbrica de evaluacion
router.delete('/unlink/:id/:id_eval', TeacherRubricaController.desvincularRubrica);

module.exports = router;
