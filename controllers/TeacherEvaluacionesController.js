const TeacherEvaluacionesModel = require('../model/TeacherEvaluacionesModel');

class TeacherEvaluacionesController {
    static async getAllTeacherEvaluaciones(req, res) {
        try {
            const docenteCedula = req.user.cedula;
            const esAdmin = req.user.id_rol === 1;
            const periodo = req.user.periodo_usuario;
            const evaluaciones = await TeacherEvaluacionesModel.getAllTeacherEvaluaciones(docenteCedula, esAdmin, periodo);
            res.json({ success: true, evaluaciones });
        } catch (error) {
            console.error('getAllTeacherEvaluaciones: Error al obtener evaluaciones (docente):', error);
            res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
        }
    }
    static async getTeacherEvaluaciones(req, res) {
        try {
            const docenteCedula = req.user.cedula;
            const esAdmin = req.user.id_rol === 1;
            const periodo = req.user.periodo_usuario;
            const evaluaciones = await TeacherEvaluacionesModel.getTeacherEvaluaciones(docenteCedula, esAdmin, periodo);
            res.json({ success: true, evaluaciones });
        } catch (error) {
            console.error('getTeacherEvaluaciones: Error al obtener evaluaciones (docente):', error);
            res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
        }
    }
    static async getEvaluadasByEval(req, res) {
        try {
            const {id_eval} = req.params
            const evaluaciones = await TeacherEvaluacionesModel.getEvaluadasByEval(id_eval);
            res.json({ success: true, evaluaciones });
        } catch (error) {
            console.error('getEvaluadasByEval: Error al obtener evaluaciones (docente):', error);
            res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
        }
    }

    static async getCarreras(req, res) {
        try {
            const docenteCedula = req.user.cedula;
            const periodo = req.user.periodo_usuario;
            const carreras = await TeacherEvaluacionesModel.getCarreras(docenteCedula, periodo);
            res.json({ success: true, carreras });
        } catch (error) {
            console.error('Error:', error);
            res.json({ success: false, message: 'Error al obtener carreras' });
        }
    }

    static async getMaterias(req, res) {
        try {
            const { carreraCodigo } = req.params;
            const periodo = req.user.periodo_usuario;
            const materias = await TeacherEvaluacionesModel.getMaterias(carreraCodigo, req.user.cedula, periodo);
            res.json({ success: true, materias });
        } catch (error) {
            console.error('Error:', error);
            res.json({ success: false, message: 'Error al obtener materias' });
        }
    }

    static async getSecciones(req, res) {
        try {
            const { materiaCodigo } = req.params;
            const periodo = req.user.periodo_usuario;
            const secciones = await TeacherEvaluacionesModel.getSecciones(materiaCodigo, req.user.cedula, periodo);
            res.json({ success: true, secciones });
        } catch (error) {
            console.error('Error:', error);
            res.json({ success: false, message: 'Error al obtener secciones' });
        }
    }

    static async getEstudiantes(req, res) {
        try {
            const { seccionId } = req.params;
            const periodo = req.user.periodo_usuario;
            const estudiantes = await TeacherEvaluacionesModel.getEstudiantes(seccionId, req.user.cedula, periodo);
            res.json({ success: true, estudiantes });
        } catch (error) {
            console.error('Error:', error);
            res.json({ success: false, message: 'Error al obtener estudiantes' });
        }
    }

    static async getRubricasActivas(req, res) {
        try {
            const rubricas = await TeacherEvaluacionesModel.getRubricasActivas(req.user.cedula);
            res.json({ success: true, rubricas });
        } catch (error) {
            console.error('Error:', error);
            res.json({ success: false, message: 'Error al obtener rúbricas' });
        }
    }

    static async crearEvaluaciones(req, res) {
        try {
            const { rubrica_id, estudiantes, observaciones } = req.body;
            if (!rubrica_id || !estudiantes || estudiantes.length === 0) {
                return res.json({ success: false, message: 'Datos incompletos' });
            }
            const result = await TeacherEvaluacionesModel.createEvaluaciones(rubrica_id, estudiantes, observaciones, req.user.cedula);
            res.json({ success: true, message: 'Evaluaciones creadas exitosamente', cantidad: (result && result.affectedRows) || estudiantes.length });
        } catch (error) {
            console.error('Error al crear:', error);
            res.json({ success: false, message: error.message || 'Error al crear las evaluaciones' });
        }
    }

    static async getDetalles(req, res) {
        try {
            const { evaluacionId, estudianteCedula } = req.params;
            const detalles = await TeacherEvaluacionesModel.getEvaluacionDetalles(evaluacionId, estudianteCedula);
            res.json({ success: true, ...detalles });
        } catch (error) {
            console.error('Error al obtener detalles:', error);
            res.json({ success: false, message: error.message || 'Error al obtener los detalles de la evaluación' });
        }
    }

    static async saveEvaluacion(req, res) {
        try {
            const { evaluacionId, estudianteCedula } = req.params;
            const payload = req.body;
            const cedula_evaluador = req.user.cedula
            await TeacherEvaluacionesModel.saveEvaluacion(evaluacionId, estudianteCedula, cedula_evaluador, payload);
            res.json({ success: true, message: 'Evaluación guardada con éxito' });
        } catch (error) {
            console.error('Error al guardar:', error);
            res.status(500).json({ success: false, message: error.message || 'Error al guardar la evaluación' });
        }
    }
}

module.exports = TeacherEvaluacionesController;
