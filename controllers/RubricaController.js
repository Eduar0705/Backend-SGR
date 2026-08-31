const RubricaModel = require('../model/RubricaModel');
const connection = require('../model/conexion');

class RubricaController {
    async getHierarchicalData(req, res) {
        try {
            const esAdmin = req.user.id_rol === 1;
            const periodo = req.query.periodo;
            const carreras = await RubricaModel.getCarreras(req.user.cedula, esAdmin, periodo);
            const tiposRubrica = await RubricaModel.getTiposRubrica();
            res.json({ success: true, carreras, tiposRubrica });
        } catch (error) {
            console.error('Error al obtener datos jerárquicos:', error);
            res.status(500).json({ success: false, message: 'Error al obtener datos' });
        }
    }
    async getCarreras(req, res) {
    try {
        const esAdmin = req.user.id_rol === 1;
        const resultado = await RubricaModel.getCarreras(req.user.cedula, esAdmin);
        res.json({ success: true, carreras: resultado });
    } catch (error) {
        console.error('Error:', error);
        res.json({ success: false, message: 'Error al obtener carreras' });
    }
}
    async getCarreraYSemestreBySeccion(req, res) {
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
}

    async getSemestres(req, res) {
        try {
            const { carrera } = req.params;
            const periodo = req.query.periodo;
            const semestres = await RubricaModel.getSemestres(carrera, periodo);
            res.json(semestres);
        } catch (error) {
            console.error('Error al obtener semestres:', error);
            res.status(500).json({ error: 'Error al obtener semestres' });
        }
    }

    async getMaterias(req, res) {
        try {
            const { carrera, semestre } = req.params;
            const periodo = req.query.periodo;
            const materias = await RubricaModel.getMaterias(carrera, semestre, periodo);
            res.json(materias);
        } catch (error) {
            console.error('Error al obtener materias:', error);
            res.status(500).json({ error: 'Error al obtener materias' });
        }
    }

    async getSecciones(req, res) {
        try {
            const { materia, carrera } = req.params;
            const periodo = req.query.periodo;
            const secciones = await RubricaModel.getSecciones(materia, carrera, periodo);
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
    async getOpciones(req, res) {
    try {
        const esAdmin = req.user.id_rol === 1;
        const resultado = await RubricaModel.getOpciones(req.user.cedula, esAdmin);
        res.json({ success: true, ...resultado });
    } catch (error) {
        console.error('Error al obtener opciones:', error);
        res.json({ success: false, message: 'Error al obtener opciones' });
    }
}
    async getProfesores(req, res) {
    try {
        const profesores = await RubricaModel.getProfesores();
        res.json({ success: true, profesores });
    } catch (error) {
        console.error('Error al obtener profesores:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
}
    async getTiposRubrica(req, res) {
    try {
        const tipos = await RubricaModel.getTiposRubrica();
        res.json(tipos);
    } catch (error) {
        console.error('Error al obtener tipos de rubrica:', error);
        res.status(500).json({ error: 'Error al obtener tipos de rubrica' });
    }
}
    async getEvaluacionesConRubrica(req, res) {
    try {
        const { seccionId } = req.params;
        const evaluaciones = await RubricaModel.getEvaluacionesConRubrica(seccionId);
        res.json({ success: true, evaluaciones });
    } catch (error) {
        console.error('Error al obtener evaluaciones:', error);
        res.json({ success: false, message: 'Error al obtener evaluaciones' });
    }
}
    async getSemestresAdmin(req, res) {
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
}
    async getAllRubricas(req, res) {
    try {
        const periodo = req.query.periodo
        const rubricas = await RubricaModel.getAllRubricas(periodo);
        res.json({ success: true, rubricas });
    } catch (error) {
        console.error('Error al obtener rúbricas:', error);
        res.json({ success: false, rubricas: [] });
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

            const cedula_docente = req.user.cedula;

            if (!nombre_rubrica || !id_evaluacion || !tipo_rubrica || !instrucciones || !criterios) {
                return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
            }

            let criteriosParsed = criterios;
            if (typeof criterios === 'string') {
                try {
                    criteriosParsed = JSON.parse(criterios);
                } catch (e) {
                    return res.status(400).json({ success: false, message: 'Formato de criterios inválido' });
                }
            }

            const { validarEstructuraRubrica } = require('../utils/evaluacionUtils');
            const validacion = validarEstructuraRubrica({
                criterios: criteriosParsed,
                porcentaje: porcentaje || req.body.porcentaje_evaluacion,
                esCreacion: true
            });

            if (!validacion.valido) {
                return res.status(400).json({ success: false, message: validacion.mensaje });
            }

            const result = await RubricaModel.saveRubrica({
                nombre_rubrica,
                id_evaluacion,
                tipo_rubrica,
                instrucciones,
                criterios: criteriosParsed,
                porcentaje: porcentaje || req.body.porcentaje_evaluacion,
                cedula_docente
            });

            res.json(result);
        } catch (error) {
            console.error('Error al crear rúbrica:', error);
            res.status(500).json({ success: false, message: error.message || 'Error interno del servidor' });
        }
    }
    async deleteRubrica(req, res) {
        try {
            const { id } = req.params;
            await RubricaModel.deleteRubrica(id);
            res.json({success: true, message: "Se ha eliminado la rubrica exitosamente."});
        } catch (error) {
            console.error('Error al eliminar rubrica:', error);
            res.status(500).json({ error: 'Error al eliminar rubrica. Por favor, intente de nuevo mas tarde.' });
        }
    }
    async updateRubrica(req, res) {
        const { id } = req.params;

        if (!req.user || !req.user.cedula) {
            return res.status(401).json({ success: false, mensaje: 'Sesión no válida' });
        }

        const { nombre_rubrica, id_evaluacion, tipo_rubrica, instrucciones, criterios, porcentaje } = req.body;
        let data = { nombre_rubrica, id_evaluacion, tipo_rubrica, instrucciones, criterios, porcentaje };
        
        let criteriosParsed = criterios;
        if (typeof criterios === 'string') {
            try {
                criteriosParsed = JSON.parse(criterios);
            } catch (e) {
                return res.status(400).json({ success: false, mensaje: 'Formato de criterios inválido' });
            }
        }

        if (!nombre_rubrica || !id_evaluacion || !tipo_rubrica || !instrucciones) {
            return res.status(400).json({ success: false, mensaje: 'Todos los campos obligatorios deben estar completos' });
        }

        const { validarEstructuraRubrica } = require('../utils/evaluacionUtils');
        const validacion = validarEstructuraRubrica({
            criterios: criteriosParsed,
            porcentaje: porcentaje || req.body.porcentaje_evaluacion,
            esCreacion: false
        });

        if (!validacion.valido) {
            return res.status(400).json({ success: false, mensaje: validacion.mensaje });
        }

        data = {
            ...data,
            criterios: criteriosParsed
        };

        try {
            const result = await RubricaModel.updateRubrica(req.params.id, data);
            res.json({ success: true, mensaje: '¡Rúbrica actualizada exitosamente!', rubricaId: id });

        } catch (error) {
            console.error('Error al actualizar rúbrica:', error);
            res.status(500).json({ success: false, mensaje: error.message || 'Error interno del servidor' });
        }
    }
    async getRubricaDetalle(req, res) {
    try {
        const { id, id_eval } = req.params;
        const resultado = await RubricaModel.getRubricaDetalle(id, id_eval);
        if (resultado) {
            res.json({ success: true, rubrica: resultado.rubrica, criterios: resultado.criterios });
        } else {
            res.status(404).json({ success: false, message: 'Rúbrica no encontrada' });
        }
    } catch (error) {
        console.error('Error al obtener detalle de rúbrica:', error);
        res.status(500).json({ success: false, message: 'Error al obtener detalle' });
    }
}
    async getRubricaForEdit(req, res) {
    try {
        const { id, id_eval } = req.params;
        const resultado = await RubricaModel.getRubricaForEdit(id, id_eval, req.user);
        if (resultado) {
            res.json({ success: true, ...resultado });
        } else {
            res.json({ success: false, message: 'Rúbrica no encontrada o sin permisos' });
        }
    } catch (error) {
        console.error('Error al obtener rúbrica para editar:', error);
        res.json({ success: false, message: 'Error al obtener la rúbrica' });
    }
}
    async getMateriasAdmin(req, res) {
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
}
    async getSeccionesAdmin(req, res) {
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
    }

    async auditarRubrica(req, res) {
        try {
            const { id_rubrica, id_eval, estado } = req.body;
            if (!id_rubrica || !estado) {
                return res.status(400).json({ success: false, message: 'Faltan parámetros obligatorios (id_rubrica, estado)' });
            }

            let estadoFinal = estado;
            if (estado === 'A' || estado.toLowerCase() === 'aprobada' || estado.toLowerCase() === 'aprobar') {
                estadoFinal = 'Aprobada';
            } else if (estado === 'R' || estado.toLowerCase() === 'rechazada' || estado.toLowerCase() === 'rechazar') {
                estadoFinal = 'Rechazada';
            }

            await RubricaModel.auditarRubrica(id_rubrica, id_eval, estadoFinal);
            res.json({ success: true, message: `Rúbrica ${estadoFinal.toLowerCase()} exitosamente`, estado: estadoFinal });
        } catch (error) {
            console.error('Error al auditar rúbrica:', error);
            res.status(500).json({ success: false, message: error.message || 'Error al auditar rúbrica' });
        }
    }
}

module.exports = new RubricaController();