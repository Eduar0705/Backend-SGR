const TeacherEstudiantesModel = require('../model/TeacherEstudiantesModel');

class TeacherEstudiantesController {
    static async getEstudiantes(req, res) {
        try {
            const docenteCedula = req.user.cedula;
            const esAdmin = req.user.id_rol === 1;
            const periodo = req.user.periodo_usuario;

            const estudiantes = await TeacherEstudiantesModel.getEstudiantes(docenteCedula, esAdmin, periodo);

            res.json({
                success: true,
                estudiantes
            });
        } catch (error) {
            console.error('Error al obtener estudiantes:', error);
            res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
        }
    }

    static async getDetalleEstudiante(req, res) {
        try {
            const { cedula } = req.params;
            const estudiante = await TeacherEstudiantesModel.getEstudianteByCedula(cedula);

            if (!estudiante) {
                return res.status(404).json({ success: false, message: 'Estudiante no encontrado' });
            }

            res.json({
                success: true,
                estudiante
            });
        } catch (error) {
            console.error('Error al obtener detalle de estudiante:', error);
            res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
        }
    }
}

module.exports = TeacherEstudiantesController;
