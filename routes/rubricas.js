const express = require('express');
const router = express.Router();
const RubricaController = require('../controllers/RubricaController');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

// Listar todas las rúbricas (GET /api/rubricas)
router.get("/", RubricaController.getAllRubricas);

// Rutas de datos jerárquicos
router.get('/hierarchical-data', RubricaController.getHierarchicalData);
router.get('/semestres/:carrera', RubricaController.getSemestres);
router.get('/materias/:carrera/:semestre', RubricaController.getMaterias);
router.get('/secciones/:materia/:carrera', RubricaController.getSecciones);
router.get('/evaluaciones/:seccionId', RubricaController.getEvaluaciones);

// Ruta de creación
router.post('/guardar', RubricaController.createRubrica);


// Listar todas las rúbricas
router.get("/admin/rubricas", RubricaController.getAllRubricas);

// Ver detalle de rúbrica (para imprimir)
router.get("/admin/rubricas/detalle/:id/:id_eval", RubricaController.getRubricaDetalle);

// Actualizar rúbrica
router.post('/rubrica/actualizar/:id', RubricaController.updateRubrica);
router.post('/admin/rubricas/link/:id/:id_eval', RubricaController.vincularRubrica);
router.delete('/admin/rubricas/delete/:id', RubricaController.deleteRubrica);
// Auditar rúbrica (aprobar / rechazar)
router.put('/admin/rubricas/auditar', RubricaController.auditarRubrica);
// Obtener datos para editar rúbrica
router.get('/admin/rubricas/editar/:id/:id_eval', RubricaController.getRubricaForEdit);

// Obtener carrera y semestre de una materia
router.get('/admin/rubricas/carrera-seccion/:seccion_codigo', RubricaController.getCarreraYSemestreBySeccion);

// Obtener carreras
router.get('/admin/carreras', RubricaController.getCarreras);

// Obtener profesores únicos
router.get("/admin/rubricas/profesores", RubricaController.getProfesores);

// Obtener tipos de rúbrica
router.get("/admin/tipos_rubrica/", RubricaController.getTiposRubrica);

// Buscar evaluaciones en la sección con o sin rúbrica
router.get("/admin/evaluaciones_con_rubrica/:seccionId", RubricaController.getEvaluacionesConRubrica);

// Obtener semestres por carrera (admin)
router.get("/api/admin/semestres/:carrera", RubricaController.getSemestresAdmin);

// Obtener materias por carrera y semestre (admin)
router.get("/api/admin/materias/:carrera/:semestre", RubricaController.getMateriasAdmin);

// Obtener secciones por materia (admin)
router.get("/api/admin/secciones/:materia/:carreraCodigo", RubricaController.getSeccionesAdmin);

module.exports = router;
