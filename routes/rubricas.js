const express = require('express');
const router = express.Router();
const RubricaController = require('../controllers/RubricaController');
const authMiddleware = require('../middleware/auth.middleware');

// Todas las rutas están protegidas
router.use(authMiddleware);

// Rutas de datos jerárquicos
router.get('/hierarchical-data', RubricaController.getHierarchicalData);
router.get('/semestres/:carrera', RubricaController.getSemestres);
router.get('/materias/:carrera/:semestre', RubricaController.getMaterias);
router.get('/secciones/:materia/:carrera', RubricaController.getSecciones);
router.get('/evaluaciones/:seccionId', RubricaController.getEvaluaciones);

// Ruta de creación
router.post('/guardar', RubricaController.createRubrica);

module.exports = router;
