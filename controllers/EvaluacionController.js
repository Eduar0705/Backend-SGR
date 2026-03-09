const EvaluacionModel = require('../model/EvaluacionModel');

class EvaluacionController {
    async getAllEvaluaciones(req, res) {
        try {
            const periodo = req.query.periodo;
            const evaluaciones = await EvaluacionModel.getAllEvaluaciones(periodo);
            const evaluacionesFormateadas = evaluaciones.map(ev => ({
                ...ev,
                fecha_formateada: ev.fecha_evaluacion ? 
                    new Date(ev.fecha_evaluacion).toLocaleDateString('es-ES', {
                        day: '2-digit', month: '2-digit', year: 'numeric'
                    }) : 'Sin fecha',
                estado_formateado: ev.estado
            }));
            res.json({ success: true, evaluaciones: evaluacionesFormateadas });
        } catch (error) {
            console.error('Error getAllEvaluaciones:', error);
            res.status(500).json({ success: false, message: 'Error al obtener evaluaciones' });
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

    async getCarreras(req, res) {
        try {
            const carreras = await EvaluacionModel.getCarreras();
            res.json({ success: true, carreras });
        } catch (error) {
            console.error('Error getCarreras:', error);
            res.status(500).json({ success: false, message: 'Error al obtener carreras' });
        }
    }

    async getMateriasByCarrera(req, res) {
        try {
            const { carreraCodigo } = req.params;
            const materias = await EvaluacionModel.getMateriasByCarrera(carreraCodigo);
            res.json({ success: true, materias });
        } catch (error) {
            console.error('Error getMateriasByCarrera:', error);
            res.status(500).json({ success: false, message: 'Error al obtener materias' });
        }
    }

    async getSecciones(req, res) {
        try {
            const { materiaCodigo, carreraCodigo } = req.params;
            const secciones = await EvaluacionModel.getSecciones(materiaCodigo, carreraCodigo);
            res.json({ success: true, secciones });
        } catch (error) {
            console.error('Error getSecciones:', error);
            res.status(500).json({ success: false, message: 'Error al obtener secciones' });
        }
    }

    async getEstudiantesBySeccion(req, res) {
        try {
            const { seccionId } = req.params;
            const estudiantes = await EvaluacionModel.getEstudiantesBySeccion(seccionId);
            res.json({ success: true, estudiantes });
        } catch (error) {
            console.error('Error getEstudiantesBySeccion:', error);
            res.status(500).json({ success: false, message: 'Error al obtener estudiantes' });
        }
    }

    async getRubricasActivas(req, res) {
        try {
            const rubricas = await EvaluacionModel.getRubricasActivas();
            res.json({ success: true, rubricas });
        } catch (error) {
            console.error('Error getRubricasActivas:', error);
            res.status(500).json({ success: false, message: 'Error al obtener rúbricas' });
        }
    }

    async crearEvaluacion(req, res) {
        try {
            console.log('--- CREAR EVALUACION BODY ---', JSON.stringify(req.body, null, 2));
            const { 
                fecha_evaluacion, id_horario, id_seccion, cant_personas, 
                contenido, competencias, instrumentos, porcentaje, estrategias_eval,
                tipo_horario, hora_inicio, hora_fin
            } = req.body;

            // Validaciones básicas
            const missingFields = [];
            if (!fecha_evaluacion) missingFields.push('fecha_evaluacion');
            if (!id_seccion) missingFields.push('id_seccion');
            if (!cant_personas) missingFields.push('cant_personas');
            if (!contenido) missingFields.push('contenido');
            if (porcentaje == null) missingFields.push('porcentaje');
            if (!estrategias_eval || estrategias_eval.length === 0) missingFields.push('estrategias_eval');

            if (missingFields.length > 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Datos incompletos: ${missingFields.join(', ')}`,
                    missingFields 
                });
            }

            // Verificar duplicados
            if (tipo_horario === 'Sección') {
                const duplicados = await EvaluacionModel.checkDuplicadosHorario(fecha_evaluacion, id_horario);
                if (duplicados.length > 0) return res.status(400).json({ success: false, message: 'Ya existe una evaluación registrada para esta sección en este horario.' });
                
                const evalData = { porcentaje, cant_personas, contenido, competencias, instrumentos, fecha_evaluacion, id_seccion };
                const horarioData = { id_horario };
                const id = await EvaluacionModel.createWithTransaction(evalData, estrategias_eval, horarioData, 'Sección');
                res.json({ success: true, message: 'Evaluación agregada exitosamente', id });
            } else {
                const duplicados = await EvaluacionModel.checkDuplicadosFueraHorario(fecha_evaluacion, hora_inicio, hora_fin);
                if (duplicados.length > 0) return res.status(400).json({ success: false, message: 'Ya existe una evaluación registrada en este horario (fuera de sección).' });
                
                const evalData = { porcentaje, cant_personas, contenido, competencias, instrumentos, fecha_evaluacion, id_seccion };
                const horarioData = { hora_inicio, hora_cierre: hora_fin };
                const id = await EvaluacionModel.createWithTransaction(evalData, estrategias_eval, horarioData, 'Otro');
                res.json({ success: true, message: 'Evaluación agregada exitosamente', id });
            }
        } catch (error) {
            console.error('Error crearEvaluacion:', error);
            res.status(500).json({ success: false, message: 'Error al crear evaluación' });
        }
    }

    async getEvaluacionById(req, res) {
        try {
            const { id } = req.params;
            const evaluacion = await EvaluacionModel.getEvaluacionById(id);
            if (!evaluacion) return res.status(404).json({ success: false, message: 'Evaluación no encontrada' });
            res.json({ success: true, evaluacion });
        } catch (error) {
            console.error('Error getEvaluacionById:', error);
            res.status(500).json({ success: false, message: 'Error al obtener evaluación' });
        }
    }

    async updateEvaluacion(req, res) {
        try {
            const { id } = req.params;
            const { 
                contenido, estrategias_eval, porcentaje, cant_personas, id_seccion,
                fecha_evaluacion, tipo_horario, id_horario, hora_inicio, hora_fin,
                competencias, instrumentos 
            } = req.body;

            const evalData = { contenido, porcentaje, cant_personas, competencias, instrumentos, fecha_evaluacion, id_seccion };
            const horarioData = tipo_horario === 'Sección' ? { id_horario } : { hora_inicio, hora_cierre: hora_fin };

            await EvaluacionModel.updateWithTransaction(id, evalData, estrategias_eval, horarioData, tipo_horario);
            res.json({ success: true, message: 'Evaluación actualizada correctamente' });
        } catch (error) {
            console.error('Error updateEvaluacion:', error);
            res.status(500).json({ success: false, message: 'Error al actualizar evaluación' });
        }
    }

    async getHorarioBySeccion(req, res) {
        try {
            const { seccionId } = req.params;
            const horarios = await EvaluacionModel.getHorarioBySeccion(seccionId);
            res.json({ success: true, horarios });
        } catch (error) {
            console.error('Error getHorarioBySeccion:', error);
            res.status(500).json({ success: false, message: 'Error al obtener horarios' });
        }
    }
}

module.exports = new EvaluacionController();
