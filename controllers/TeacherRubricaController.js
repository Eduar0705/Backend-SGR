const TeacherRubricaModel = require('../model/TeacherRubricaModel');

class TeacherRubricaController {
    async getFormData(req, res) {
        try {
            const cedula = req.user.cedula;
            const [carreras, tipos, estrategias] = await Promise.all([
                TeacherRubricaModel.getCarrerasByDocente(cedula),
                TeacherRubricaModel.getTiposRubrica(),
                TeacherRubricaModel.getEstrategias()
            ]);
            res.json({ success: true, data: { carreras, tipos, estrategias } });
        } catch (error) {
            console.error('Error getFormData:', error);
            res.status(500).json({ success: false, message: 'Error al cargar datos del formulario' });
        }
    }

    async getSemestres(req, res) {
        try {
            const semestres = await TeacherRubricaModel.getSemestresByCarrera(req.params.carrera, req.user.cedula);
            res.json({ success: true, data: semestres });
        } catch (error) {
            console.error('Error getSemestres:', error);
            res.status(500).json({ success: false, message: 'Error al obtener semestres' });
        }
    }

    async getMaterias(req, res) {
        try {
            const materias = await TeacherRubricaModel.getMateriasByCarreraSemestre(req.params.carrera, req.params.semestre, req.user.cedula);
            res.json({ success: true, data: materias });
        } catch (error) {
            console.error('Error getMaterias:', error);
            res.status(500).json({ success: false, message: 'Error al obtener materias' });
        }
    }

    async getSecciones(req, res) {
        try {
            const secciones = await TeacherRubricaModel.getSeccionesByMateria(req.params.materia, req.user.cedula);
            res.json({ success: true, data: secciones });
        } catch (error) {
            console.error('Error getSecciones:', error);
            res.status(500).json({ success: false, message: 'Error al obtener secciones' });
        }
    }

    async getEvaluaciones(req, res) {
        try {
            const evaluaciones = await TeacherRubricaModel.getEvaluacionesBySeccion(req.params.seccionId);
            res.json({ success: true, evaluaciones });
        } catch (error) {
            console.error('Error getEvaluaciones:', error);
            res.status(500).json({ success: false, message: 'Error al obtener evaluaciones' });
        }
    }

    async crearRubrica(req, res) {
        try {
            const cedula = req.user.cedula;
            const result = await TeacherRubricaModel.crearRubrica(req.body, cedula);
            res.json(result);
        } catch (error) {
            console.error('Error crearRubrica:', error);
            res.status(500).json({ status: 'error', mensaje: 'Error al crear la rúbrica: ' + error.message });
        }
    }

    async getRubricas(req, res) {
        try {
            const cedula = req.user.cedula;
            const rubricas = await TeacherRubricaModel.getRubricas(cedula);
            res.json({ success: true, rubricas });
        } catch (error) {
            console.error('Error getRubricas:', error);
            res.status(500).json({ success: false, message: 'Error al cargar rúbricas' });
        }
    }

    async getRubricaDetalle(req, res) {
        try {
            const result = await TeacherRubricaModel.getRubricaDetalle(req.params.id, req.user.cedula);
            if (!result) return res.status(404).json({ success: false, message: 'Rúbrica no encontrada' });
            res.json({ success: true, rubrica: result.rubrica, criterios: result.criterios });
        } catch (error) {
            console.error('Error getRubricaDetalle:', error);
            res.status(500).json({ success: false, message: 'Error al obtener detalle de rúbrica' });
        }
    }

    async getRubricaForEdit(req, res) {
        try {
            const result = await TeacherRubricaModel.getRubricaForEdit(req.params.id, req.user.cedula);
            if (!result) return res.status(404).json({ success: false, message: 'Rúbrica no encontrada o sin permisos' });
            res.json({ success: true, rubrica: result.rubrica, criterios: result.criterios });
        } catch (error) {
            console.error('Error getRubricaForEdit:', error);
            res.status(500).json({ success: false, message: 'Error al obtener rúbrica para editar' });
        }
    }

    async updateRubrica(req, res) {
        try {
            const result = await TeacherRubricaModel.updateRubrica(req.params.id, req.body, req.user.cedula);
            res.json({ success: true, mensaje: result.message, datos: result });
        } catch (error) {
            console.error('Error updateRubrica:', error);
            res.status(500).json({ success: false, mensaje: 'Error al actualizar rúbrica: ' + error.message });
        }
    }

    async deleteRubrica(req, res) {
        try {
            const result = await TeacherRubricaModel.deleteRubrica(req.params.id, req.user.cedula);
            res.json({ success: true, message: result.message });
        } catch (error) {
            console.error('Error deleteRubrica:', error);
            res.status(500).json({ success: false, message: 'Error al eliminar rúbrica: ' + error.message });
        }
    }
}

module.exports = new TeacherRubricaController();
