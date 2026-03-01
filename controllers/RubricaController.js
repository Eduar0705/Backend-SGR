const RubricaModel = require('../model/RubricaModel');

class RubricaController {
    async getHierarchicalData(req, res) {
        try {
            const carreras = await RubricaModel.getCarreras();
            const tiposRubrica = await RubricaModel.getTiposRubrica();
            res.json({ success: true, carreras, tiposRubrica });
        } catch (error) {
            console.error('Error al obtener datos jerárquicos:', error);
            res.status(500).json({ success: false, message: 'Error al obtener datos' });
        }
    }

    async getSemestres(req, res) {
        try {
            const { carrera } = req.params;
            const semestres = await RubricaModel.getSemestres(carrera);
            res.json(semestres);
        } catch (error) {
            console.error('Error al obtener semestres:', error);
            res.status(500).json({ error: 'Error al obtener semestres' });
        }
    }

    async getMaterias(req, res) {
        try {
            const { carrera, semestre } = req.params;
            const materias = await RubricaModel.getMaterias(carrera, semestre);
            res.json(materias);
        } catch (error) {
            console.error('Error al obtener materias:', error);
            res.status(500).json({ error: 'Error al obtener materias' });
        }
    }

    async getSecciones(req, res) {
        try {
            const { materia, carrera } = req.params;
            const secciones = await RubricaModel.getSecciones(materia, carrera);
            res.json(secciones);
        } catch (error) {
            console.error('Error al obtener secciones:', error);
            res.status(500).json({ error: 'Error al obtener secciones' });
        }
    }

    async getEvaluaciones(req, res) {
        try {
            const { seccionId } = req.params;
            const evaluaciones = await RubricaModel.getEvaluacionesPendientes(seccionId);
            res.json({ success: true, evaluaciones });
        } catch (error) {
            console.error('Error al obtener evaluaciones:', error);
            res.status(500).json({ success: false, message: 'Error al obtener evaluaciones' });
        }
    }

    async createRubrica(req, res) {
        try {
            const {
                nombre_rubrica,
                id_evaluacion,
                tipo_rubrica,
                instrucciones,
                criterios,
                porcentaje
            } = req.body;

            const cedula_docente = req.user.cedula; // Obtenido del token

            // Validaciones básicas
            if (!nombre_rubrica || !id_evaluacion || !tipo_rubrica || !instrucciones || !criterios) {
                return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
            }

            const result = await RubricaModel.saveRubrica({
                nombre_rubrica,
                id_evaluacion,
                tipo_rubrica,
                instrucciones,
                criterios,
                porcentaje,
                cedula_docente
            });

            res.json(result);
        } catch (error) {
            console.error('Error al crear rúbrica:', error);
            res.status(500).json({ success: false, message: error.message || 'Error interno del servidor' });
        }
    }
}

module.exports = new RubricaController();
