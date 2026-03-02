const connection = require('./conexion');

class TeacherRubricaModel {
    // Carreras donde el docente tiene permiso
    async getCarrerasByDocente(cedula) {
        const query = `
            SELECT DISTINCT c.codigo, c.nombre
            FROM carrera c
            INNER JOIN plan_periodo pp ON c.codigo = pp.codigo_carrera
            INNER JOIN seccion s ON pp.id = s.id_materia_plan
            INNER JOIN permiso_docente pd ON s.id = pd.id_seccion
            WHERE pd.docente_cedula = ?
            ORDER BY c.nombre
        `;
        return new Promise((resolve, reject) => {
            connection.query(query, [cedula], (err, r) => err ? reject(err) : resolve(r));
        });
    }

    // Tipos de rúbrica
    async getTiposRubrica() {
        const query = 'SELECT id, nombre FROM tipo_rubrica GROUP BY nombre ORDER BY nombre';
        return new Promise((resolve, reject) => {
            connection.query(query, (err, r) => err ? reject(err) : resolve(r));
        });
    }

    // Semestres por carrera (filtrado por permisos del docente)
    async getSemestresByCarrera(carrera, cedula) {
        const query = `
            SELECT DISTINCT pp.num_semestre as semestre
            FROM plan_periodo pp
            INNER JOIN seccion s ON pp.id = s.id_materia_plan
            INNER JOIN permiso_docente pd ON s.id = pd.id_seccion
            WHERE pp.codigo_carrera = ? AND pd.docente_cedula = ?
            ORDER BY pp.num_semestre
        `;
        return new Promise((resolve, reject) => {
            connection.query(query, [carrera, cedula], (err, r) => err ? reject(err) : resolve(r.map(x => x.semestre)));
        });
    }

    // Materias por carrera y semestre
    async getMateriasByCarreraSemestre(carrera, semestre, cedula) {
        const query = `
            SELECT DISTINCT m.codigo, m.nombre
            FROM materia m
            INNER JOIN plan_periodo pp ON m.codigo = pp.codigo_materia AND pp.codigo_carrera = ?
            INNER JOIN seccion s ON pp.id = s.id_materia_plan
            INNER JOIN permiso_docente pd ON s.id = pd.id_seccion
            WHERE pp.num_semestre = ? AND pd.docente_cedula = ?
            ORDER BY m.nombre
        `;
        return new Promise((resolve, reject) => {
            connection.query(query, [carrera, semestre, cedula], (err, r) => err ? reject(err) : resolve(r));
        });
    }

    // Secciones por materia (del docente en plan_periodo)
    async getSeccionesByMateria(materia, cedula) {
        const query = `
            SELECT DISTINCT s.id, s.letra, pp.codigo_periodo
            FROM seccion s
            INNER JOIN plan_periodo pp ON pp.id = s.id_materia_plan
            INNER JOIN permiso_docente pd ON s.id = pd.id_seccion
            WHERE pp.codigo_materia = ? AND pd.docente_cedula = ?
            ORDER BY s.letra
        `;
        return new Promise((resolve, reject) => {
            connection.query(query, [materia, cedula], (err, r) => err ? reject(err) : resolve(r));
        });
    }

    // Evaluaciones de una sección (sin rúbrica asignada aún)
    async getEvaluacionesBySeccion(seccionId) {
        const query = `
            SELECT e.id, e.competencias, e.ponderacion, e.fecha_evaluacion
            FROM evaluacion e
            LEFT JOIN rubrica_uso ru ON e.id = ru.id_eval
            WHERE e.id_seccion = ? AND ru.id_rubrica IS NULL
            ORDER BY e.fecha_evaluacion
        `;
        return new Promise((resolve, reject) => {
            connection.query(query, [seccionId], (err, r) => err ? reject(err) : resolve(r));
        });
    }

    // Estrategias de evaluación
    async getEstrategias() {
        const query = 'SELECT id, nombre FROM estrategia_eval ORDER BY nombre';
        return new Promise((resolve, reject) => {
            connection.query(query, (err, r) => err ? reject(err) : resolve(r));
        });
    }

    // Crear rúbrica completa (transacción)
    async crearRubrica(data, cedula) {
        const { nombre_rubrica, tipo_rubrica, evaluacion_id, instrucciones, criterios } = data;

        return new Promise((resolve, reject) => {
            connection.getConnection((err, conn) => {
                if (err) return reject(err);

                conn.beginTransaction(err => {
                    if (err) { conn.release(); return reject(err); }

                    // 1. Insertar rúbrica
                    const qRubrica = `INSERT INTO rubrica (nombre_rubrica, id_tipo, instrucciones, cedula_docente) VALUES (?, ?, ?, ?)`;
                    conn.query(qRubrica, [nombre_rubrica, tipo_rubrica, instrucciones || null, cedula], (err, result) => {
                        if (err) return conn.rollback(() => { conn.release(); reject(err); });

                        const rubricaId = result.insertId;

                        // 2. Vincular rúbrica con evaluación
                        const qRubricaUso = `INSERT INTO rubrica_uso (id_rubrica, id_eval) VALUES (?, ?)`;
                        conn.query(qRubricaUso, [rubricaId, evaluacion_id], (err) => {
                            if (err) return conn.rollback(() => { conn.release(); reject(err); });

                            // 3. Insertar criterios y niveles
                            let criteriosCompletados = 0;
                            let hayError = false;

                            if (!criterios || criterios.length === 0) {
                                return conn.commit(err => {
                                    conn.release();
                                    if (err) return reject(err);
                                    resolve({ status: 'ok', mensaje: 'Rúbrica creada exitosamente', rubricaId });
                                });
                            }

                            criterios.forEach((criterio, ci) => {
                                if (hayError) return;

                                const qCriterio = `INSERT INTO criterio_rubrica (rubrica_id, descripcion, puntaje_maximo, orden) VALUES (?, ?, ?, ?)`;
                                conn.query(qCriterio, [rubricaId, criterio.descripcion, criterio.puntaje_maximo, criterio.orden || ci + 1], (err, resCrit) => {
                                    if (hayError) return;
                                    if (err) { hayError = true; return conn.rollback(() => { conn.release(); reject(err); }); }

                                    const criterioId = resCrit.insertId;

                                    if (!criterio.niveles || criterio.niveles.length === 0) {
                                        criteriosCompletados++;
                                        if (criteriosCompletados === criterios.length) {
                                            conn.commit(err => { conn.release(); if (err) return reject(err); resolve({ status: 'ok', mensaje: 'Rúbrica creada exitosamente', rubricaId }); });
                                        }
                                        return;
                                    }

                                    let nivelesCompletados = 0;
                                    criterio.niveles.forEach((nivel, ni) => {
                                        if (hayError) return;
                                        const qNivel = `INSERT INTO nivel_desempeno (criterio_id, nombre_nivel, descripcion, puntaje_maximo, orden) VALUES (?, ?, ?, ?, ?)`;
                                        conn.query(qNivel, [criterioId, nivel.nombre_nivel, nivel.descripcion, nivel.puntaje, nivel.orden || ni + 1], (err) => {
                                            if (hayError) return;
                                            if (err) { hayError = true; return conn.rollback(() => { conn.release(); reject(err); }); }
                                            nivelesCompletados++;
                                            if (nivelesCompletados === criterio.niveles.length) {
                                                criteriosCompletados++;
                                                if (criteriosCompletados === criterios.length) {
                                                    conn.commit(err => { conn.release(); if (err) return reject(err); resolve({ status: 'ok', mensaje: 'Rúbrica creada exitosamente', rubricaId }); });
                                                }
                                            }
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    }
    // ============================================================
    // MÉTODOS PARA GESTIÓN DE RÚBRICAS (DOCENTE)
    // ============================================================

    async getRubricas(cedula) {
        const query = `
            SELECT
                r.id,
                r.nombre_rubrica,
                e.fecha_evaluacion,
                r.fecha_creacion,
                GROUP_CONCAT(DISTINCT eeval.nombre SEPARATOR ', ') AS tipo_evaluacion,
                e.ponderacion AS porcentaje_evaluacion,
                m.nombre AS materia_nombre,
                m.codigo AS materia_codigo,
                CONCAT(pp.codigo_carrera, '-', pp.codigo_materia, ' ', s.letra) AS seccion_codigo,
                CASE WHEN r.activo = 1 THEN ru.estado ELSE 'Inactivo' END AS estado,
                r.activo,
                CONCAT(u.nombre, ' ', u.apeliido) AS docente_nombre
            FROM rubrica r
            INNER JOIN rubrica_uso ru ON r.id = ru.id_rubrica
            INNER JOIN evaluacion e ON ru.id_eval = e.id
            LEFT JOIN estrategia_empleada eemp ON e.id = eemp.id_eval
            LEFT JOIN estrategia_eval eeval ON eemp.id_estrategia = eeval.id
            INNER JOIN seccion s ON e.id_seccion = s.id
            INNER JOIN plan_periodo pp ON s.id_materia_plan = pp.id
            INNER JOIN materia m ON pp.codigo_materia = m.codigo
            INNER JOIN permiso_docente pd ON s.id = pd.id_seccion
            INNER JOIN usuario_docente ud ON pd.docente_cedula = ud.cedula_usuario
            INNER JOIN usuario u ON ud.cedula_usuario = u.cedula
            WHERE pd.docente_cedula = ? AND r.activo = 1 AND u.activo = 1
            GROUP BY r.id
            ORDER BY r.fecha_creacion DESC
        `;
        return new Promise((resolve, reject) => {
            connection.query(query, [cedula], (err, r) => err ? reject(err) : resolve(r));
        });
    }

    async getRubricaDetalle(id, cedula) {
        // Obtenemos detalle principal
        const queryRubrica = `
            SELECT
                r.id, r.nombre_rubrica, r.cedula_docente AS docente_cedula,
                m.codigo AS materia_id, s.letra AS seccion_id, pp.codigo_periodo AS lapso_academico,
                e.fecha_evaluacion,
                (SELECT SUM(puntaje_maximo) FROM criterio_rubrica cr_sub WHERE cr_sub.rubrica_id = r.id) AS porcentaje_evaluacion,
                GROUP_CONCAT(DISTINCT eeval.nombre SEPARATOR ', ') AS tipo_evaluacion,
                e.competencias, r.instrucciones,
                CASE WHEN cantidad_personas=1 THEN 'Individual' WHEN cantidad_personas=2 THEN 'En Pareja' ELSE 'Grupal' END AS modalidad,
                e.cantidad_personas, r.activo, r.fecha_creacion AS created_at, r.fecha_actualizacion AS updated_at,
                m.nombre AS materia_nombre, CONCAT(pp.codigo_carrera, '-', pp.codigo_materia, ' ', s.letra) AS seccion_codigo,
                c.nombre AS carrera_nombre, CONCAT(u.nombre, ' ', u.apeliido) AS docente_nombre
            FROM evaluacion e
            INNER JOIN rubrica_uso ru ON ru.id_eval = e.id
            INNER JOIN rubrica r ON r.id = ru.id_rubrica
            INNER JOIN seccion s ON e.id_seccion = s.id
            INNER JOIN plan_periodo pp ON s.id_materia_plan = pp.id
            INNER JOIN materia m ON pp.codigo_materia = m.codigo
            INNER JOIN carrera c ON pp.codigo_carrera = c.codigo
            INNER JOIN usuario_docente ud ON ud.cedula_usuario = r.cedula_docente
            INNER JOIN usuario u ON u.cedula = ud.cedula_usuario
            LEFT JOIN estrategia_empleada eemp ON e.id = eemp.id_eval
            LEFT JOIN estrategia_eval eeval ON eeval.id = eemp.id_estrategia
            WHERE r.id = ? AND r.cedula_docente = ? -- Aseguramos que es de este docente
            GROUP BY r.id
        `;
        const queryCriterios = `SELECT cr.id, cr.descripcion, cr.puntaje_maximo, cr.orden FROM criterio_rubrica cr WHERE cr.rubrica_id = ? ORDER BY cr.orden`;
        const queryNiveles = `
            SELECT n.criterio_id, n.nombre_nivel, n.descripcion, n.puntaje_maximo AS puntaje, n.orden
            FROM nivel_desempeno n
            INNER JOIN criterio_rubrica cr ON n.criterio_id = cr.id
            WHERE cr.rubrica_id = ?
            ORDER BY cr.orden, n.orden DESC
        `;
        
        return new Promise((resolve, reject) => {
            connection.query(queryRubrica, [id, cedula], (err, rubrica) => {
                if (err) return reject(err);
                if (rubrica.length === 0) return resolve(null);
                
                connection.query(queryCriterios, [id], (err, criterios) => {
                    if (err) return reject(err);
                    
                    connection.query(queryNiveles, [id], (err, niveles) => {
                        if (err) return reject(err);
                        
                        const criteriosConNiveles = criterios.map(criterio => ({
                            ...criterio,
                            niveles: niveles.filter(nivel => nivel.criterio_id === criterio.id)
                        }));
                        
                        resolve({ rubrica: rubrica[0], criterios: criteriosConNiveles });
                    });
                });
            });
        });
    }

    async getRubricaForEdit(id, cedula) {
        let queryRubrica = `
            SELECT 
                r.id, e.id AS evaluacion_id, r.nombre_rubrica AS nombre_rubrica,
                tr.id AS id_tipo, IFNULL(tr.nombre, 'Tipo no asignado') AS tipo_rubrica,
                u.cedula as docente_cedula, m.codigo AS materia_codigo, s.id AS seccion_id,
                pp.codigo_periodo AS lapse_academico, e.fecha_evaluacion,
                (SELECT SUM(puntaje_maximo) FROM criterio_rubrica cr_sub WHERE cr_sub.rubrica_id = r.id) AS porcentaje_evaluacion,
                GROUP_CONCAT(DISTINCT eeval.nombre SEPARATOR ', ') AS tipo_evaluacion,
                e.contenido AS contenido_evaluacion, e.competencias, e.instrumentos, r.instrucciones,
                CASE WHEN cantidad_personas=1 THEN 'Individual' WHEN cantidad_personas=2 THEN 'En Pareja' ELSE 'Grupal' END AS modalidad,
                e.cantidad_personas, r.activo, r.fecha_creacion AS created_at, r.fecha_actualizacion AS updated_at,
                m.nombre AS materia_nombre, s.id AS id_seccion,
                CONCAT(pp.codigo_carrera, '-', pp.codigo_materia, ' ', s.letra) AS seccion_codigo,
                CONCAT(u.nombre, ' ', u.apeliido) AS docente_nombre
            FROM evaluacion e
            INNER JOIN seccion s ON e.id_seccion = s.id
            INNER JOIN plan_periodo pp ON s.id_materia_plan = pp.id
            INNER JOIN materia m ON pp.codigo_materia = m.codigo
            INNER JOIN carrera c ON pp.codigo_carrera = c.codigo
            INNER JOIN permiso_docente pd ON s.id = pd.id_seccion
            INNER JOIN usuario_docente ud ON ud.cedula_usuario = pd.docente_cedula
            INNER JOIN usuario u ON ud.cedula_usuario = u.cedula
            INNER JOIN rubrica_uso ru ON e.id = ru.id_eval
            INNER JOIN rubrica r ON ru.id_rubrica = r.id
            LEFT JOIN tipo_rubrica tr ON r.id_tipo = tr.id
            LEFT JOIN estrategia_empleada eemp ON e.id = eemp.id_eval
            LEFT JOIN estrategia_eval eeval ON eeval.id = eemp.id_estrategia
            WHERE r.id = ? AND r.activo = 1 AND pd.docente_cedula = ?
            GROUP BY r.id ORDER BY fecha_evaluacion DESC
        `;

        return new Promise((resolve, reject) => {
            connection.query(queryRubrica, [id, cedula], (err, rubricaResult) => {
                if (err) return reject(err);
                if (rubricaResult.length === 0) return resolve(null);

                const rubrica = rubricaResult[0];

                const queryEstrategias = `SELECT eeval.* FROM estrategia_eval eeval INNER JOIN estrategia_empleada eemp ON eeval.id = eemp.id_estrategia WHERE eemp.id_eval = ?`;
                connection.query(queryEstrategias, [rubrica.evaluacion_id], (err, estrategias) => {
                    if (err) return reject(err);
                    rubrica.estrategias = estrategias;

                    const queryCriterios = `SELECT id, descripcion, puntaje_maximo, orden FROM criterio_rubrica WHERE rubrica_id = ? ORDER BY orden`;
                    connection.query(queryCriterios, [id], (err, criterios) => {
                        if (err) return reject(err);

                        if (criterios.length === 0) return resolve({ rubrica, criterios: [] });

                        const criteriosIds = criterios.map(c => c.id);
                        const queryNiveles = `SELECT criterio_id, nombre_nivel, descripcion, puntaje_maximo AS puntaje, orden FROM nivel_desempeno WHERE criterio_id IN (?) ORDER BY criterio_id, orden DESC`;

                        connection.query(queryNiveles, [criteriosIds], (err, niveles) => {
                            if (err) return reject(err);

                            const criteriosConNiveles = criterios.map(criterio => ({
                                ...criterio,
                                niveles: niveles.filter(nivel => nivel.criterio_id === criterio.id)
                            }));

                            resolve({ rubrica, criterios: criteriosConNiveles });
                        });
                    });
                });
            });
        });
    }

    async updateRubrica(id, data, cedula) {
        return new Promise((resolve, reject) => {
            connection.getConnection((err, conn) => {
                if (err) return reject(err);

                conn.beginTransaction(async (err) => {
                    if (err) { conn.release(); return reject(err); }

                    try {
                        // 1. Verificar propiedad de la rúbrica
                        const checkOwnerQuery = 'SELECT id FROM rubrica WHERE id = ? AND cedula_docente = ?';
                        const checkResults = await new Promise((res, rej) => conn.query(checkOwnerQuery, [id, cedula], (e, r) => e ? rej(e) : res(r)));
                        if (checkResults.length === 0) {
                            throw new Error('Rúbrica no encontrada o no tiene permisos para editarla');
                        }

                        // 2. Actualizar datos base de la rúbrica
                        const updateRubricaQ = 'UPDATE rubrica SET nombre_rubrica = ?, instrucciones = ?, id_tipo = ? WHERE id = ?';
                        await new Promise((res, rej) => conn.query(updateRubricaQ, [data.nombre_rubrica, data.instrucciones, data.tipo_rubrica, id], (e, r) => e ? rej(e) : res(r)));

                        // 3. Obtener id de la evaluación anterior (por si cambió)
                        const getEvalAnteriorQ = 'SELECT id_eval FROM rubrica_uso WHERE id_rubrica = ? LIMIT 1';
                        const resEvalAnt = await new Promise((res, rej) => conn.query(getEvalAnteriorQ, [id], (e, r) => e ? rej(e) : res(r)));
                        const prevEvalId = resEvalAnt.length > 0 ? resEvalAnt[0].id_eval : null;

                        if (prevEvalId && prevEvalId != data.id_evaluacion) {
                            // Actualizar rubrica_uso
                            const updateUsoQ = 'UPDATE rubrica_uso SET id_eval = ? WHERE id_rubrica = ?';
                            await new Promise((res, rej) => conn.query(updateUsoQ, [data.id_evaluacion, id], (e, r) => e ? rej(e) : res(r)));
                        }

                        // 4. Eliminar niveles de desempeño anteriores
                        const deleteNivelesQ = 'DELETE n FROM nivel_desempeno n INNER JOIN criterio_rubrica c ON n.criterio_id = c.id WHERE c.rubrica_id = ?';
                        await new Promise((res, rej) => conn.query(deleteNivelesQ, [id], (e, r) => e ? rej(e) : res(r)));

                        // 5. Eliminar criterios anteriores
                        const deleteCriteriosQ = 'DELETE FROM criterio_rubrica WHERE rubrica_id = ?';
                        await new Promise((res, rej) => conn.query(deleteCriteriosQ, [id], (e, r) => e ? rej(e) : res(r)));

                        // 6. Insertar nuevos criterios y sus niveles
                        const objCriterios = typeof data.criterios === 'string' ? JSON.parse(data.criterios) : data.criterios;
                        if (objCriterios && objCriterios.length > 0) {
                            for (let i = 0; i < objCriterios.length; i++) {
                                const crit = objCriterios[i];
                                const critQuery = 'INSERT INTO criterio_rubrica (rubrica_id, descripcion, puntaje_maximo, orden) VALUES (?, ?, ?, ?)';
                                
                                const resCrit = await new Promise((res, rej) => conn.query(critQuery, [id, crit.descripcion, crit.puntaje_maximo, crit.orden || (i + 1)], (e, r) => e ? rej(e) : res(r)));
                                const nuevoCriterioId = resCrit.insertId;

                                if (crit.niveles && crit.niveles.length > 0) {
                                    for (let j = 0; j < crit.niveles.length; j++) {
                                        const nivel = crit.niveles[j];
                                        const nivelQuery = 'INSERT INTO nivel_desempeno (criterio_id, nombre_nivel, descripcion, puntaje_maximo, orden) VALUES (?, ?, ?, ?, ?)';
                                        await new Promise((res, rej) => conn.query(nivelQuery, [nuevoCriterioId, nivel.nombre_nivel, nivel.descripcion, nivel.puntaje, nivel.orden || (j + 1)], (e, r) => e ? rej(e) : res(r)));
                                    }
                                }
                            }
                        }

                        conn.commit((err) => {
                            if (err) throw err;
                            conn.release();
                            resolve({ success: true, message: 'Rúbrica actualizada correctamente' });
                        });

                    } catch (error) {
                        conn.rollback(() => {
                            conn.release();
                            reject(error);
                        });
                    }
                });
            });
        });
    }

    async deleteRubrica(id, cedula) {
        return new Promise((resolve, reject) => {
            connection.getConnection((err, conn) => {
                if (err) return reject(err);

                conn.beginTransaction(async (err) => {
                    if (err) { conn.release(); return reject(err); }

                    try {
                        const checkOwnerQuery = 'SELECT id FROM rubrica WHERE id = ? AND cedula_docente = ?';
                        const checkResults = await new Promise((res, rej) => conn.query(checkOwnerQuery, [id, cedula], (e, r) => e ? rej(e) : res(r)));
                        if (checkResults.length === 0) {
                            throw new Error('Rúbrica no encontrada o no tiene permisos para eliminarla');
                        }

                        const updateQ = 'UPDATE rubrica SET activo = 0 WHERE id = ?';
                        await new Promise((res, rej) => conn.query(updateQ, [id], (e, r) => e ? rej(e) : res(r)));

                        conn.commit((err) => {
                            if (err) throw err;
                            conn.release();
                            resolve({ success: true, message: 'Rúbrica eliminada correctamente' });
                        });
                    } catch (error) {
                        conn.rollback(() => {
                            conn.release();
                            reject(error);
                        });
                    }
                });
            });
        });
    }
}

module.exports = new TeacherRubricaModel();
