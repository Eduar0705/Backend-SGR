const express = require('express');
const router = express.Router();
const RubricaController = require('../controllers/RubricaController');
const RubricaModel = require('../model/RubricaModel');
const authMiddleware = require('../middleware/auth.middleware');

// Todas las rutas están protegidas
router.use(authMiddleware);

// Listar todas las rúbricas (GET /api/rubricas)
router.get("/", async function(req, res) {
    try {
        const periodo = req.query.periodo
        const rubricas = await RubricaModel.getAllRubricas(periodo);
        res.json({ success: true, rubricas });
    } catch (error) {
        console.error('Error al obtener rúbricas:', error);
        res.json({ success: false, rubricas: [] });
    }
});

// Rutas de datos jerárquicos
router.get('/hierarchical-data', RubricaController.getHierarchicalData);
router.get('/semestres/:carrera', RubricaController.getSemestres);
router.get('/materias/:carrera/:semestre', RubricaController.getMaterias);
router.get('/secciones/:materia/:carrera', RubricaController.getSecciones);
router.get('/evaluaciones/:seccionId', RubricaController.getEvaluaciones);

// Ruta de creación
router.post('/guardar', RubricaController.createRubrica);

// ============================================================
// RUTAS ADICIONALES PARA GESTIÓN DE RÚBRICAS
// ============================================================

// Listar todas las rúbricas
router.get("/admin/rubricas", async function(req, res) {
    try {
        const periodo = req.query.periodo;
        const rubricas = await RubricaModel.getAllRubricas(periodo);
        res.json({ success: true, rubricas });
    } catch (error) {
        console.error('Error al obtener rúbricas:', error);
        res.json({ success: false, rubricas: [] });
    }
});

// Ver detalle de rúbrica (para imprimir)
router.get("/admin/rubricas/detalle/:id", async function(req, res) {
    try {
        const { id } = req.params;
        const resultado = await RubricaModel.getRubricaDetalle(id);
        if (resultado) {
            res.json({ success: true, rubrica: resultado.rubrica, criterios: resultado.criterios });
        } else {
            res.status(404).json({ success: false, message: 'Rúbrica no encontrada' });
        }
    } catch (error) {
        console.error('Error al obtener detalle de rúbrica:', error);
        res.status(500).json({ success: false, message: 'Error al obtener detalle' });
    }
});

// Actualizar rúbrica
router.post('/rubrica/actualizar/:id', RubricaController.updateRubrica);
router.delete('/admin/rubricas/delete/:id', RubricaController.deleteRubrica);
// Obtener datos para editar rúbrica
router.get('/admin/rubricas/editar/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await RubricaModel.getRubricaForEdit(id, req.user);
        if (resultado) {
            res.json({ success: true, ...resultado });
        } else {
            res.json({ success: false, message: 'Rúbrica no encontrada o sin permisos' });
        }
    } catch (error) {
        console.error('Error al obtener rúbrica para editar:', error);
        res.json({ success: false, message: 'Error al obtener la rúbrica' });
    }
});

// Obtener carrera y semestre de una materia
router.get('/admin/rubricas/carrera-seccion/:seccion_codigo', async (req, res) => {
    try {
        const { seccion_codigo } = req.params;
        const resultado = await RubricaModel.getCarreraYSemestreBySeccion(seccion_codigo);
        if (resultado) {
            res.json({ success: true, ...resultado });
        } else {
            res.json({ success: false, message: 'Materia no encontrada' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.json({ success: false, message: 'Error al obtener información' });
    }
});

// Obtener carreras
router.get('/admin/carreras', async (req, res) => {
    try {
        const esAdmin = req.user.id_rol === 1;
        const resultado = await RubricaModel.getCarreras(req.user.cedula, esAdmin);
        res.json({ success: true, carreras: resultado });
    } catch (error) {
        console.error('Error:', error);
        res.json({ success: false, message: 'Error al obtener carreras' });
    }
});

// Obtener materias y secciones (para el modal)
router.get('/admin/opciones', async (req, res) => {
    try {
        const esAdmin = req.user.id_rol === 1;
        const resultado = await RubricaModel.getOpciones(req.user.cedula, esAdmin);
        res.json({ success: true, ...resultado });
    } catch (error) {
        console.error('Error al obtener opciones:', error);
        res.json({ success: false, message: 'Error al obtener opciones' });
    }
});

// Obtener profesores únicos
router.get("/admin/rubricas/profesores", async function(req, res) {
    try {
        const profesores = await RubricaModel.getProfesores();
        res.json({ success: true, profesores });
    } catch (error) {
        console.error('Error al obtener profesores:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

// Obtener tipos de rúbrica
router.get("/admin/tipos_rubrica/", async (req, res) => {
    try {
        const tipos = await RubricaModel.getTiposRubrica();
        res.json(tipos);
    } catch (error) {
        console.error('Error al obtener tipos de rubrica:', error);
        res.status(500).json({ error: 'Error al obtener tipos de rubrica' });
    }
});

// Buscar evaluaciones en la sección con o sin rúbrica
router.get("/admin/evaluaciones_con_rubrica/:seccionId", async function (req, res) {
    try {
        const { seccionId } = req.params;
        const evaluaciones = await RubricaModel.getEvaluacionesConRubrica(seccionId);
        res.json({ success: true, evaluaciones });
    } catch (error) {
        console.error('Error al obtener evaluaciones:', error);
        res.json({ success: false, message: 'Error al obtener evaluaciones' });
    }
});

// Obtener semestres por carrera (admin)
router.get("/api/admin/semestres/:carrera", async (req, res) => {
    try {
        const { carrera } = req.params;
        const periodo = req.query.periodo;
        const esAdmin = req.user.id_rol === 1;
        const resultado = await RubricaModel.getSemestresAdmin(carrera, req.user.cedula, esAdmin, periodo);
        res.json(resultado);
    } catch (error) {
        console.error('Error al obtener semestres:', error);
        res.status(500).json({ error: 'Error al obtener semestres' });
    }
});

// Obtener materias por carrera y semestre (admin)
router.get("/api/admin/materias/:carrera/:semestre", async (req, res) => {
    try {
        const { carrera, semestre } = req.params;
        const periodo = req.query.periodo;
        const esAdmin = req.user.id_rol === 1;
        const resultado = await RubricaModel.getMateriasAdmin(carrera, semestre, req.user.cedula, esAdmin, periodo);
        res.json(resultado);
    } catch (error) {
        console.error('Error al obtener materias:', error);
        res.status(500).json({ error: 'Error al obtener materias' });
    }
});

// Obtener secciones por materia (admin)
router.get("/api/admin/secciones/:materia/:carreraCodigo", async (req, res) => {
    try {
        const { materia, carreraCodigo } = req.params;
        const periodo = req.query.periodo;
        const esAdmin = req.user.id_rol === 1;
        const resultado = await RubricaModel.getSeccionesAdmin(materia, carreraCodigo, req.user.cedula, esAdmin, periodo);
        res.json(resultado);
    } catch (error) {
        console.error('Error al obtener secciones:', error);
        res.status(500).json({ error: 'Error al obtener secciones' });
    }
});

module.exports = router;
