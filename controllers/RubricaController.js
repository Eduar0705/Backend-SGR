const RubricaModel = require('../model/RubricaModel');
const connection = require('../model/conexion');

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

            const cedula_docente = req.user.cedula;

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

    async updateRubrica(req, res) {
        const { id } = req.params;
        
        if (!req.session || !req.session.cedula) {
            return res.status(401).json({ success: false, mensaje: 'Sesión no válida' });
        }

        const {
            nombre_rubrica,
            id_evaluacion,
            tipo_rubrica,
            instrucciones,
            criterios,
            porcentaje
        } = req.body;

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
                if (isNaN(puntajeNivel) || puntajeNivel < 0.25) {
                    return res.status(400).json({ success: false, mensaje: `El nivel "${nivel.nombre_nivel}" debe tener un puntaje mínimo de 0.25 puntos` });
                }
                if (puntajeNivel > puntajeCriterio) {
                    return res.status(400).json({ success: false, mensaje: `El puntaje del nivel "${nivel.nombre_nivel}" excede el puntaje máximo del criterio` });
                }
            }
        }

        if (Math.abs(sumaPuntajes - porcentaje) > 0.01) {
            return res.status(400).json({ success: false, mensaje: `La suma de puntajes (${sumaPuntajes.toFixed(2)}) debe ser EXACTAMENTE IGUAL al porcentaje de evaluación (${porcentaje}%)` });
        }

        connection.getConnection((err, conn) => {
            if (err) return res.status(500).json({ success: false, mensaje: 'Error del servidor al conectar con la base de datos' });

            conn.beginTransaction((err) => {
                if (err) { conn.release(); return res.status(500).json({ success: false, mensaje: 'Error del servidor al iniciar la transacción' }); }

                const queryUpdateRubrica = `UPDATE rubrica SET nombre_rubrica = ?, instrucciones = ?, id_tipo = ? WHERE id = ?`;
                conn.query(queryUpdateRubrica, [nombre_rubrica, instrucciones, tipo_rubrica, id], (error) => {
                    if (error) return conn.rollback(() => { conn.release(); res.status(500).json({ success: false, mensaje: 'Error al actualizar la rúbrica' }); });

                    const queryDeleteRubricaUso = 'DELETE FROM rubrica_uso WHERE id_rubrica = ?';
                    conn.query(queryDeleteRubricaUso, [id], (error) => {
                        if (error) return conn.rollback(() => { conn.release(); res.status(500).json({ success: false, mensaje: 'Error al actualizar la relación con la evaluación' }); });

                        const queryInsertRubricaUso = 'INSERT INTO rubrica_uso (id_eval, id_rubrica) VALUES (?, ?)';
                        conn.query(queryInsertRubricaUso, [id_evaluacion, id], (error) => {
                            if (error) return conn.rollback(() => { conn.release(); res.status(500).json({ success: false, mensaje: 'Error al asociar la rúbrica con la nueva evaluación' }); });

                            const querySelectCriterios = 'SELECT id FROM criterio_rubrica WHERE rubrica_id = ?';
                            conn.query(querySelectCriterios, [id], (error, criteriosExistentes) => {
                                if (error) return conn.rollback(() => { conn.release(); res.status(500).json({ success: false, mensaje: 'Error al preparar actualización de criterios' }); });

                                const eliminarCriterios = () => {
                                    let criteriosCompletados = 0;
                                    const totalCriterios = criteriosParsed.length;
                                    let hayError = false;

                                    criteriosParsed.forEach((criterio, indexCriterio) => {
                                        if (hayError) return;

                                        const queryInsertCriterio = `INSERT INTO criterio_rubrica (rubrica_id, descripcion, puntaje_maximo, orden) VALUES (?, ?, ?, ?)`;
                                        const valuesCriterio = [id, criterio.descripcion.trim(), parseFloat(criterio.puntaje_maximo), parseInt(criterio.orden) || (indexCriterio + 1)];

                                        conn.query(queryInsertCriterio, valuesCriterio, (error, resultCriterio) => {
                                            if (error) {
                                                hayError = true;
                                                return conn.rollback(() => { conn.release(); res.status(500).json({ success: false, mensaje: `Error al guardar el criterio: ${criterio.descripcion}` }); });
                                            }

                                            const criterioId = resultCriterio.insertId;

                                            if (criterio.niveles && criterio.niveles.length > 0) {
                                                let nivelesCompletados = 0;
                                                const totalNiveles = criterio.niveles.length;

                                                criterio.niveles.forEach((nivel, indexNivel) => {
                                                    if (hayError) return;

                                                    const queryInsertNivel = `INSERT INTO nivel_desempeno (criterio_id, nombre_nivel, descripcion, puntaje_maximo, orden) VALUES (?, ?, ?, ?, ?)`;
                                                    const valuesNivel = [criterioId, nivel.nombre_nivel.trim(), nivel.descripcion.trim(), parseFloat(nivel.puntaje), parseInt(nivel.orden) || (indexNivel + 1)];

                                                    conn.query(queryInsertNivel, valuesNivel, (error) => {
                                                        if (error) {
                                                            hayError = true;
                                                            return conn.rollback(() => { conn.release(); res.status(500).json({ success: false, mensaje: `Error al guardar el nivel: ${nivel.nombre_nivel}` }); });
                                                        }

                                                        nivelesCompletados++;
                                                        if (nivelesCompletados === totalNiveles) {
                                                            criteriosCompletados++;
                                                            if (criteriosCompletados === totalCriterios && !hayError) {
                                                                conn.commit((err) => {
                                                                    if (err) return conn.rollback(() => { conn.release(); res.status(500).json({ success: false, mensaje: 'Error al confirmar la transacción' }); });
                                                                    conn.release();
                                                                    res.json({ success: true, mensaje: '¡Rúbrica actualizada exitosamente!', rubricaId: id });
                                                                });
                                                            }
                                                        }
                                                    });
                                                });
                                            } else {
                                                criteriosCompletados++;
                                                if (criteriosCompletados === totalCriterios && !hayError) {
                                                    conn.commit((err) => {
                                                        if (err) return conn.rollback(() => { conn.release(); res.status(500).json({ success: false, mensaje: 'Error al confirmar la transacción' }); });
                                                        conn.release();
                                                        res.json({ success: true, mensaje: '¡Rúbrica actualizada exitosamente!', rubricaId: id });
                                                    });
                                                }
                                            }
                                        });
                                    });
                                };

                                if (criteriosExistentes.length > 0) {
                                    const criteriosIds = criteriosExistentes.map(c => c.id);
                                    const queryDeleteNiveles = `DELETE FROM nivel_desempeno WHERE criterio_id IN (?)`;
                                    conn.query(queryDeleteNiveles, [criteriosIds], (error) => {
                                        if (error) return conn.rollback(() => { conn.release(); res.status(500).json({ success: false, mensaje: 'Error al eliminar niveles existentes' }); });

                                        const queryDeleteCriterios = `DELETE FROM criterio_rubrica WHERE rubrica_id = ?`;
                                        conn.query(queryDeleteCriterios, [id], (error) => {
                                            if (error) return conn.rollback(() => { conn.release(); res.status(500).json({ success: false, mensaje: 'Error al eliminar criterios existentes' }); });
                                            eliminarCriterios();
                                        });
                                    });
                                } else {
                                    eliminarCriterios();
                                }
                            });
                        });
                    });
                });
            });
        });
    }
}

module.exports = new RubricaController();
