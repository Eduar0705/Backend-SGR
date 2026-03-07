const RubricaModel = require('../model/RubricaModel');
const EvaluacionModel = require('../model/EvaluacionModel');

class AcademicoController {
    async getCarreras(req, res) {
        try {
            const carreras = await RubricaModel.getAllCarreras();
            res.json({ success: true, data: carreras });
        } catch (error) {
            console.error('Error getCarreras:', error);
            res.status(500).json({ success: false, message: 'Error al obtener carreras' });
        }
    }

    async getSemestres(req, res) {
        try {
            const { carreraCodigo } = req.params;
            const periodo = req.query.periodo
            const semestres = await RubricaModel.getSemestres(carreraCodigo, periodo);
            res.json(semestres);
        } catch (error) {
            console.error('Error getSemestres:', error);
            res.status(500).json({ error: 'Error al obtener semestres' });
        }
    }

    async getMaterias(req, res) {
        try {
            const { carreraCodigo, semestreId } = req.params;
            const materias = await RubricaModel.getMaterias(carreraCodigo, semestreId);
            res.json(materias);
        } catch (error) {
            console.error('Error getMaterias:', error);
            res.status(500).json({ error: 'Error al obtener materias' });
        }
    }

    async getSecciones(req, res) {
        try {
            const { materiaCodigo, carreraCodigo } = req.params;
            const secciones = await RubricaModel.getSecciones(materiaCodigo, carreraCodigo);
            res.json(secciones);
        } catch (error) {
            console.error('Error getSecciones:', error);
            res.status(500).json({ error: 'Error al obtener secciones' });
        }
    }

    async getEstrategias(req, res) {
        try {
            const estrategias = await EvaluacionModel.getEstrategias();
            res.json({ success: true, estrategias_eval: estrategias });
        } catch (error) {
            console.error('Error getEstrategias:', error);
            res.status(500).json({ success: false, message: 'Error al obtener estrategias' });
        }
    }

    async getTiposRubrica(req, res) {
        try {
            const tipos = await RubricaModel.getTiposRubrica();
            res.json({ success: true, data: tipos });
        } catch (error) {
            console.error('Error getTiposRubrica:', error);
            res.status(500).json({ success: false, message: 'Error al obtener tipos de rúbrica' });
        }
    }

    async getEvaluaciones(req, res) {
        try {
            const { seccionId } = req.params;
            const evaluaciones = await RubricaModel.getEvaluacionesPendientes(seccionId);
            res.json({ success: true, evaluaciones });
        } catch (error) {
            console.error('Error getEvaluaciones:', error);
            res.status(500).json({ success: false, message: 'Error al obtener evaluaciones' });
        }
    }

    async getEvaluacionDetalle(req, res) {
        try {
            const { evalId } = req.params;
            const evaluacion = await RubricaModel.getEvaluacionDetalle(evalId);
            res.json({ success: true, evaluacion });
        } catch (error) {
            console.error('Error getEvaluacionDetalle:', error);
            res.status(500).json({ success: false, message: 'Error al obtener detalle de evaluación' });
        }
    }
}

module.exports = new AcademicoController();
