const StudentEvaluacionesModel = require('../model/StudentEvaluacionesModel');

class StudentEvaluacionesController {
    async getEvaluaciones(req, res) {
        try {
            const cedula = req.user.cedula;
            const periodo = req.query.periodo;
            console.log(req.query, req.params)
            console.log(cedula, periodo)
            const evaluaciones = await StudentEvaluacionesModel.getEvaluacionesByEstudiante(cedula, periodo);
            res.json({ success: true, data: evaluaciones });
        } catch (error) {
            console.error('Error getEvaluaciones (student):', error);
            res.status(500).json({ success: false, message: 'Error al obtener evaluaciones' });
        }
    }

    async getDetalleEvaluacion(req, res) {
        try {
            const cedula = req.user.cedula;
            const evaluacionId = req.params.id;
            const result = await StudentEvaluacionesModel.getDetalleEvaluacion(evaluacionId, cedula);
            res.json(result);
        } catch (error) {
            console.error('Error getDetalleEvaluacion:', error);
            res.status(500).json({ success: false, message: 'Error al obtener detalles de evaluación' });
        }
    }
}

module.exports = new StudentEvaluacionesController();
