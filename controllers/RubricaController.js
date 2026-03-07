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

    // ─────────────────────────────────────────────────────────────────────────
    // FIX PRINCIPAL: updateRubrica reescrito usando async/await con Promises
    // para evitar el bug de callbacks concurrentes con contadores manuales
    // que causaba que commit se ejecutara múltiples veces o nunca.
    // ─────────────────────────────────────────────────────────────────────────
    async updateRubrica(req, res) {
        const { id } = req.params;

        if (!req.user || !req.user.cedula) {
            return res.status(401).json({ success: false, mensaje: 'Sesión no válida' });
        }

        const { nombre_rubrica, id_evaluacion, tipo_rubrica, instrucciones, criterios, porcentaje } = req.body;

        // ── Parsear criterios ─────────────────────────────────────────────────
        let criteriosParsed = criterios;
        if (typeof criterios === 'string') {
            try {
                criteriosParsed = JSON.parse(criterios);
            } catch (e) {
                return res.status(400).json({ success: false, mensaje: 'Formato de criterios inválido' });
            }
        }

        // ── Validaciones ──────────────────────────────────────────────────────
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
            return res.status(400).json({
                success: false,
                mensaje: `La suma de puntajes (${sumaPuntajes.toFixed(2)}) debe ser EXACTAMENTE IGUAL al porcentaje de evaluación (${porcentaje}%)`
            });
        }

        // ── Transacción con async/await ───────────────────────────────────────
        let conn;
        try {
            conn = await RubricaModel.getConnectionAsync();
            await RubricaModel.beginTransactionAsync(conn);

            // 1. Actualizar datos base de la rúbrica
            await RubricaModel.queryAsync(conn,
                `UPDATE rubrica SET nombre_rubrica = ?, instrucciones = ?, id_tipo = ? WHERE id = ?`,
                [nombre_rubrica, instrucciones, tipo_rubrica, id]
            );

            // 2. Actualizar relación con evaluación
            await RubricaModel.queryAsync(conn, 'DELETE FROM rubrica_uso WHERE id_rubrica = ?', [id]);
            await RubricaModel.queryAsync(conn, 'INSERT INTO rubrica_uso (id_eval, id_rubrica) VALUES (?, ?)', [id_evaluacion, id]);

            // 3. Eliminar criterios y niveles existentes
            const criteriosExistentes = await RubricaModel.queryAsync(conn, 'SELECT id FROM criterio_rubrica WHERE rubrica_id = ?', [id]);
            if (criteriosExistentes.length > 0) {
                const criteriosIds = criteriosExistentes.map(c => c.id);
                await RubricaModel.queryAsync(conn, `DELETE FROM nivel_desempeno WHERE criterio_id IN (?)`, [criteriosIds]);
                await RubricaModel.queryAsync(conn, `DELETE FROM criterio_rubrica WHERE rubrica_id = ?`, [id]);
            }

            // 4. Insertar nuevos criterios y niveles (secuencialmente con for...of)
            for (let i = 0; i < criteriosParsed.length; i++) {
                const criterio = criteriosParsed[i];
                const resCriterio = await RubricaModel.queryAsync(conn,
                    `INSERT INTO criterio_rubrica (rubrica_id, descripcion, puntaje_maximo, orden) VALUES (?, ?, ?, ?)`,
                    [id, criterio.descripcion.trim(), parseFloat(criterio.puntaje_maximo), parseInt(criterio.orden) || (i + 1)]
                );
                const criterioId = resCriterio.insertId;

                if (criterio.niveles && criterio.niveles.length > 0) {
                    for (let j = 0; j < criterio.niveles.length; j++) {
                        const nivel = criterio.niveles[j];
                        await RubricaModel.queryAsync(conn,
                            `INSERT INTO nivel_desempeno (criterio_id, nombre_nivel, descripcion, puntaje_maximo, orden) VALUES (?, ?, ?, ?, ?)`,
                            [criterioId, nivel.nombre_nivel.trim(), nivel.descripcion.trim(), parseFloat(nivel.puntaje), parseInt(nivel.orden) || (j + 1)]
                        );
                    }
                }
            }

            await RubricaModel.commitAsync(conn);
            conn.release();

            res.json({ success: true, mensaje: '¡Rúbrica actualizada exitosamente!', rubricaId: id });

        } catch (error) {
            if (conn) {
                await RubricaModel.rollbackAsync(conn);
                conn.release();
            }
            console.error('Error al actualizar rúbrica:', error);
            res.status(500).json({ success: false, mensaje: error.message || 'Error interno del servidor' });
        }
    }
}

module.exports = new RubricaController();