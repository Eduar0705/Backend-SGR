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

            // FIX: Validar que criterios sea un array válido (igual que en updateRubrica)
            let criteriosParsed = criterios;
            if (typeof criterios === 'string') {
                try {
                    criteriosParsed = JSON.parse(criterios);
                } catch (e) {
                    return res.status(400).json({ success: false, message: 'Formato de criterios inválido' });
                }
            }

            if (!Array.isArray(criteriosParsed) || criteriosParsed.length === 0) {
                return res.status(400).json({ success: false, message: 'Debe agregar al menos un criterio de evaluación' });
            }

            const result = await RubricaModel.saveRubrica({
                nombre_rubrica,
                id_evaluacion,
                tipo_rubrica,
                instrucciones,
                criterios: criteriosParsed,
                porcentaje,
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
        let data = { nombre_rubrica, id_evaluacion, tipo_rubrica, instrucciones, criterios, porcentaje }
        console.log(data)
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

        if (!criteriosParsed || !Array.isArray(criteriosParsed) || criteriosParsed.length === 0) {
            return res.status(400).json({ success: false, mensaje: 'Debe agregar al menos un criterio de evaluación' });
        }

        let sumaPuntajes = 0;
        for (let i = 0; i < criteriosParsed.length; i++) {
            const criterio = criteriosParsed[i];
            if (!criterio.descripcion || criterio.descripcion.trim() === '') {
                return res.status(400).json({ success: false, mensaje: `El criterio ${i + 1} necesita una descripción` });
            }

            const puntajeCriterio = parseFloat(criterio.puntaje_maximo);
            if (isNaN(puntajeCriterio) || puntajeCriterio < 1) {
                return res.status(400).json({ success: false, mensaje: `El criterio ${i + 1} debe tener un puntaje mínimo de 1 punto` });
            }
            sumaPuntajes += puntajeCriterio;

            if (!criterio.niveles || !Array.isArray(criterio.niveles) || criterio.niveles.length === 0) {
                return res.status(400).json({ success: false, mensaje: `El criterio ${i + 1} debe tener al menos un nivel de desempeño` });
            }

            for (let j = 0; j < criterio.niveles.length; j++) {
                const nivel = criterio.niveles[j];
                if (!nivel.nombre_nivel || nivel.nombre_nivel.trim() === '') {
                    return res.status(400).json({ success: false, mensaje: `El nivel ${j + 1} del criterio ${i + 1} necesita un nombre` });
                }
                if (!nivel.descripcion || nivel.descripcion.trim() === '') {
                    return res.status(400).json({ success: false, mensaje: `El nivel "${nivel.nombre_nivel}" necesita una descripción` });
                }
                const puntajeNivel = parseFloat(nivel.puntaje);
                if (isNaN(puntajeNivel) || puntajeNivel < 0.025) {
                    return res.status(400).json({ success: false, mensaje: `El nivel "${nivel.nombre_nivel}" debe tener un puntaje mínimo de 0.025 puntos` });
                }
                if (puntajeNivel > puntajeCriterio) {
                    return res.status(400).json({ success: false, mensaje: `El puntaje del nivel "${nivel.nombre_nivel}" excede el puntaje máximo del criterio` });
                }
            }
        }

        if (Math.abs(sumaPuntajes - porcentaje) > 0.01) {
            return res.status(400).json({
                success: false,
                mensaje: `La suma de puntajes (${sumaPuntajes.toFixed(3)}) debe ser IGUAL al porcentaje de evaluación (${porcentaje}%)`
            });
        }
        data = {...data,
                criterios: criteriosParsed
        }
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
}

module.exports = new RubricaController();