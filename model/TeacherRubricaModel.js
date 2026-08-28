const connection = require('./conexion');

class TeacherRubricaModel {
    // Carreras donde el docente tiene permiso
    async getCarrerasByDocente(cedula, periodo) {
        const query = `
            SELECT DISTINCT c.codigo, c.nombre
            FROM carrera c
            INNER JOIN materia_pensum mp ON c.codigo = mp.codigo_carrera
            INNER JOIN pensum p ON mp.id_pensum = p.id
            INNER JOIN periodo_academico pa ON p.id = pa.id_pensum
            INNER JOIN seccion s ON mp.id = s.id_materia_plan
            INNER JOIN permiso_docente pd ON s.id = pd.id_seccion
            WHERE pd.docente_cedula = ?
            AND s.codigo_periodo = '2025-1'
            ORDER BY c.nombre
        `;
        return new Promise((resolve, reject) => {
            connection.query(query, [cedula, periodo], (err, r) => err ? reject(err) : resolve(r));
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
    async getSemestresByCarrera(carrera, cedula, periodo) {
        const query = `
            SELECT DISTINCT mp.num_semestre as semestre
            FROM materia_pensum mp
            INNER JOIN pensum p ON mp.id_pensum = p.id
            INNER JOIN periodo_academico pa ON p.id = pa.id_pensum
            INNER JOIN seccion s ON mp.id = s.id_materia_plan
            INNER JOIN permiso_docente pd ON s.id = pd.id_seccion
            WHERE mp.codigo_carrera = ? AND pd.docente_cedula = ?
            AND s.codigo_periodo = '2025-1'
            ORDER BY mp.num_semestre
        `;
        return new Promise((resolve, reject) => {
            connection.query(query, [carrera, cedula, periodo], (err, r) => err ? reject(err) : resolve(r.map(x => x.semestre)));
        });
    }

    // Materias por carrera y semestre
    async getMateriasByCarreraSemestre(carrera, semestre, cedula, periodo) {
        const query = `
            SELECT DISTINCT m.codigo, m.nombre
            FROM materia m
            INNER JOIN materia_pensum mp ON m.codigo = mp.codigo_materia AND mp.codigo_carrera = ?
            INNER JOIN pensum p ON mp.id_pensum = p.id
            INNER JOIN periodo_academico pa ON p.id = pa.id_pensum
            INNER JOIN seccion s ON mp.id = s.id_materia_plan
            INNER JOIN permiso_docente pd ON s.id = pd.id_seccion
            WHERE mp.num_semestre = ? AND pd.docente_cedula = ?
            AND s.codigo_periodo = '2025-1'
            ORDER BY m.nombre
        `;
        return new Promise((resolve, reject) => {
            connection.query(query, [carrera, semestre, cedula, periodo], (err, r) => err ? reject(err) : resolve(r));
        });
    }

    // Secciones por materia (del docente en materia_pensum)
    async getSeccionesByMateria(materia, cedula, periodo) {
        const query = `
            SELECT s.id, s.letra, pa.codigo
            FROM seccion s
            INNER JOIN materia_pensum mp ON mp.id = s.id_materia_plan
            INNER JOIN pensum pen ON mp.id_pensum = pen.id
            INNER JOIN periodo_academico pa ON pen.id = pa.id_pensum
            INNER JOIN permiso_docente pd ON s.id = pd.id_seccion
            WHERE mp.codigo_materia = ? AND pd.docente_cedula = ?
            AND pa.codigo = '2025-1'
            ORDER BY s.letra
        `;
        return new Promise((resolve, reject) => {
            connection.query(query, [materia, cedula, periodo], (err, r) => err ? reject(err) : resolve(r));
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

    async crearRubrica(data, cedula) {
        const { nombre_rubrica, tipo_rubrica, evaluacion_id, instrucciones, criterios, porcentaje_evaluacion } = data;

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
                                conn.query(qCriterio, [rubricaId, criterio.descripcion, ((criterio.puntaje_maximo / porcentaje_evaluacion) * 100), criterio.orden || ci + 1], (err, resCrit) => {
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
                                        conn.query(qNivel, [criterioId, nivel.nombre_nivel, nivel.descripcion, ((nivel.puntaje / criterio.puntaje_maximo) * 100), nivel.orden || ni + 1], (err) => {
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
    // MÉTODOS PARA GESTIÓN DE RÚBRICAS (DOCENTE)

    async getRubricas(cedula) {
        const query = `
            SELECT
                r.id,
                e.contenido,
                e.id AS id_evaluacion,
                e.contenido,
                r.nombre_rubrica,
                e.fecha_evaluacion,
                s.codigo_periodo,
                r.fecha_creacion,
                GROUP_CONCAT(DISTINCT eeval.nombre SEPARATOR ', ') AS tipo_evaluacion,
                e.ponderacion AS porcentaje_evaluacion,
                c.nombre AS carrera_nombre,
                m.nombre AS materia_nombre,
                m.codigo AS materia_codigo,
                CONCAT(mp.codigo_carrera, '-', mp.codigo_materia, ' ', s.letra) AS seccion_codigo,
                CASE WHEN r.activo = 1 THEN ru.estado ELSE 'Inactivo' END AS estado,
                r.activo,
                s.letra AS seccion_letra,
                CONCAT(u.nombre, ' ', u.apeliido) AS docente_nombre
            FROM rubrica r
            INNER JOIN rubrica_uso ru ON r.id = ru.id_rubrica
            INNER JOIN evaluacion e ON ru.id_eval = e.id
            LEFT JOIN estrategia_empleada eemp ON e.id = eemp.id_eval
            LEFT JOIN estrategia_eval eeval ON eemp.id_estrategia = eeval.id
            INNER JOIN seccion s ON e.id_seccion = s.id
            INNER JOIN materia_pensum mp ON s.id_materia_plan = mp.id
            INNER JOIN carrera c ON mp.codigo_carrera = c.codigo
            INNER JOIN materia m ON mp.codigo_materia = m.codigo
            INNER JOIN permiso_docente pd ON s.id = pd.id_seccion
            INNER JOIN usuario_docente ud ON pd.docente_cedula = ud.cedula_usuario
            INNER JOIN usuario u ON ud.cedula_usuario = u.cedula
            WHERE pd.docente_cedula = ? AND r.activo = 1 AND u.activo = 1
            GROUP BY e.id
            ORDER BY r.fecha_creacion DESC
        `;
        return new Promise((resolve, reject) => {
            connection.query(query, [cedula], (err, r) => err ? reject(err) : resolve(r));
        });
    }

    async getRubricaDetalle(id, id_eval, cedula) {
        let porcentaje_evaluacion;
        const queryRubrica = `
            SELECT
                r.id, r.nombre_rubrica, r.cedula_docente AS docente_cedula,
                m.codigo AS materia_id, s.letra AS seccion_id, s.codigo_periodo AS lapso_academico,
                e.fecha_evaluacion,
                e.ponderacion AS porcentaje_evaluacion,
                GROUP_CONCAT(DISTINCT eeval.nombre SEPARATOR ', ') AS tipo_evaluacion,
                e.competencias, r.instrucciones,
                CASE WHEN cantidad_personas=1 THEN 'Individual' WHEN cantidad_personas=2 THEN 'En Pareja' ELSE 'Grupal' END AS modalidad,
                e.cantidad_personas, r.activo, r.fecha_creacion AS created_at, r.fecha_actualizacion AS updated_at,
                m.nombre AS materia_nombre, CONCAT(mp.codigo_carrera, '-', mp.codigo_materia, ' ', s.letra) AS seccion_codigo,
                c.nombre AS carrera_nombre, CONCAT(u_p.nombre, ' ', u_p.apeliido) AS docente_nombre
            FROM evaluacion e
            INNER JOIN rubrica_uso ru ON ru.id_eval = e.id
            INNER JOIN rubrica r ON r.id = ru.id_rubrica
            INNER JOIN seccion s ON e.id_seccion = s.id
            INNER JOIN materia_pensum mp ON s.id_materia_plan = mp.id
            INNER JOIN pensum pen ON mp.id_pensum = pen.id
            INNER JOIN materia m ON mp.codigo_materia = m.codigo
            INNER JOIN carrera c ON mp.codigo_carrera = c.codigo
            INNER JOIN permiso_docente pd ON s.id = pd.id_seccion
            INNER JOIN usuario_docente ud_p ON ud_p.cedula_usuario = pd.docente_cedula
            INNER JOIN usuario u_p ON u_p.cedula = ud_p.cedula_usuario
            LEFT JOIN estrategia_empleada eemp ON e.id = eemp.id_eval
            LEFT JOIN estrategia_eval eeval ON eeval.id = eemp.id_estrategia
            WHERE r.id = ? AND e.id = ? AND pd.docente_cedula = ? -- Aseguramos acceso por sección
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
            connection.query(queryRubrica, [id, id_eval, cedula], (err, rubrica) => {
                if (err) return reject(err);
                if (rubrica.length === 0) return resolve(null);
                porcentaje_evaluacion = rubrica[0].porcentaje_evaluacion
                connection.query(queryCriterios, [id], (err, criterios) => {
                    if (err) return reject(err);
                    
                    connection.query(queryNiveles, [id], (err, niveles) => {
                        if (err) return reject(err);
                        
                        const criteriosConNiveles = criterios.map(criterio => ({
                            ...criterio,
                            puntaje_maximo: (criterio.puntaje_maximo * porcentaje_evaluacion / 100).toFixed(3),
                            niveles: niveles.filter(nivel => nivel.criterio_id === criterio.id)
                                            .map(n => (
                                            {
                                                criterio_id: n.criterio_id,
                                                nombre_nivel: n.nombre_nivel, 
                                                descripcion: n.descripcion, 
                                                puntaje: parseFloat(n.puntaje * criterio.puntaje_maximo * porcentaje_evaluacion / 10000).toFixed(3), 
                                                orden: n.orden
                                            }))
                        }));
                        
                        resolve({ rubrica: rubrica[0], criterios: criteriosConNiveles });
                    });
                });
            });
        });
    }

    async getRubricaForEdit(id, id_eval, cedula) {
        let queryRubrica = `
            SELECT 
                r.id, 
                e.id AS evaluacion_id, 
                r.nombre_rubrica AS nombre_rubrica,
                tr.id AS id_tipo, 
                IFNULL(tr.nombre, 'Tipo no asignado') AS tipo_rubrica,
                u.cedula as docente_cedula, 
                m.codigo AS materia_codigo, 
                s.id AS seccion_id,
                pa.codigo AS lapse_academico, 
                e.fecha_evaluacion,
                e.ponderacion AS porcentaje_evaluacion,
                GROUP_CONCAT(DISTINCT eeval.nombre SEPARATOR ', ') AS tipo_evaluacion,
                e.contenido AS contenido_evaluacion, 
                e.competencias, 
                e.instrumentos, 
                r.instrucciones,
                CASE 
                    WHEN cantidad_personas=1 THEN 'Individual' 
                    WHEN cantidad_personas=2 THEN 'En Pareja' 
                    ELSE 'Grupal' 
                END AS modalidad,
                e.cantidad_personas, 
                r.activo, 
                r.fecha_creacion AS created_at, 
                r.fecha_actualizacion AS updated_at,
                m.nombre AS materia_nombre, 
                s.id AS id_seccion,
                CONCAT(mp.codigo_carrera, '-', mp.codigo_materia, ' ', s.letra) AS seccion_codigo,
                CONCAT(u.nombre, ' ', u.apeliido) AS docente_nombre
            FROM evaluacion e
            INNER JOIN seccion s ON e.id_seccion = s.id
            INNER JOIN materia_pensum mp ON s.id_materia_plan = mp.id
            INNER JOIN pensum pen ON mp.id_pensum = pen.id
            INNER JOIN periodo_academico pa ON pen.id = pa.id_pensum
            INNER JOIN materia m ON mp.codigo_materia = m.codigo
            INNER JOIN carrera c ON mp.codigo_carrera = c.codigo
            INNER JOIN permiso_docente pd ON s.id = pd.id_seccion
            INNER JOIN usuario_docente ud ON ud.cedula_usuario = pd.docente_cedula
            INNER JOIN usuario u ON ud.cedula_usuario = u.cedula
            INNER JOIN rubrica_uso ru ON e.id = ru.id_eval
            INNER JOIN rubrica r ON ru.id_rubrica = r.id
            LEFT JOIN tipo_rubrica tr ON r.id_tipo = tr.id
            LEFT JOIN estrategia_empleada eemp ON e.id = eemp.id_eval
            LEFT JOIN estrategia_eval eeval ON eeval.id = eemp.id_estrategia
            WHERE r.id = ? AND e.id = ? AND r.activo = 1 AND pd.docente_cedula = ?
            GROUP BY r.id ORDER BY fecha_evaluacion DESC
        `;

        return new Promise((resolve, reject) => {
            connection.query(queryRubrica, [id, id_eval, cedula], (err, rubricaResult) => {
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
                                puntaje_maximo: criterio.puntaje_maximo * rubrica.porcentaje_evaluacion / 100,
                                niveles: niveles.filter(nivel => nivel.criterio_id === criterio.id)
                                                .map(n => (
                                            {
                                                criterio_id: n.criterio_id,
                                                nombre_nivel: n.nombre_nivel, 
                                                descripcion: n.descripcion, 
                                                puntaje: parseFloat(n.puntaje * criterio.puntaje_maximo * rubrica.porcentaje_evaluacion / 10000).toFixed(3), 
                                                orden: n.orden
                                            }))
                            }));

                            resolve({ rubrica, criterios: criteriosConNiveles });
                        });
                    });
                });
            });
        });
    }

async updateRubrica(id, data) {
    return new Promise((resolve, reject) => {
        connection.getConnection((err, conn) => {
            if (err) return reject(err);

            conn.beginTransaction(async (err) => {
                if (err) { conn.release(); return reject(err); }

                try {
                    // 1. Actualizar datos base de la rúbrica
                    const updateRubricaQ = `
                        UPDATE rubrica 
                        SET nombre_rubrica = ?, instrucciones = ?, id_tipo = ? 
                        WHERE id = ?
                    `;
                    await new Promise((res, rej) =>
                        conn.query(updateRubricaQ, [data.nombre_rubrica, data.instrucciones, data.tipo_rubrica, id], (e, r) => e ? rej(e) : res(r))
                    );

                    // 2. Actualizar relación con evaluación
                    const deleteEvalQ = 'DELETE FROM rubrica_uso WHERE id_rubrica = ?';
                    await new Promise((res, rej) =>
                        conn.query(deleteEvalQ, [id], (e, r) => e ? rej(e) : res(r))
                    );

                    const insertEvalQ = 'INSERT INTO rubrica_uso (id_rubrica, id_eval) VALUES (?, ?)';
                    await new Promise((res, rej) =>
                        conn.query(insertEvalQ, [id, data.id_evaluacion], (e, r) => e ? rej(e) : res(r))
                    );

                    // 3. Upsert de criterios (por id real) y sus niveles (por orden, clave compuesta)
                    const idsCriteriosPayload = [];

                    for (let i = 0; i < data.criterios.length; i++) {
                        const criterio = data.criterios[i];
                        const ordenCriterio = parseInt(criterio.orden) || (i + 1);
                        const puntajeMaximoPorcentaje = parseFloat(
                            ((criterio.puntaje_maximo / data.porcentaje_evaluacion) * 100).toFixed(2)
                        );

                        let criterioId = criterio.id ? parseInt(criterio.id) : null;
                        let esNuevo = !criterioId;

                        if (criterioId) {
                            const resUpdate = await new Promise((res, rej) =>
                                conn.query(
                                    `UPDATE criterio_rubrica 
                                    SET descripcion = ?, puntaje_maximo = ?, orden = ?
                                    WHERE id = ? AND rubrica_id = ?`,
                                    [criterio.descripcion.trim(), puntajeMaximoPorcentaje, ordenCriterio, criterioId, id],
                                    (e, r) => e ? rej(e) : res(r)
                                )
                            );

                            // Si no afectó ninguna fila, el id no existe realmente -> tratar como nuevo
                            if (resUpdate.affectedRows === 0) {
                                esNuevo = true;
                            }
                        }

                        if (esNuevo) {
                            const resCrit = await new Promise((res, rej) =>
                                conn.query(
                                    `INSERT INTO criterio_rubrica (rubrica_id, descripcion, puntaje_maximo, orden)
                                    VALUES (?, ?, ?, ?)`,
                                    [id, criterio.descripcion.trim(), puntajeMaximoPorcentaje, ordenCriterio],
                                    (e, r) => e ? rej(e) : res(r)
                                )
                            );
                            criterioId = resCrit.insertId;
                        }
                        console.log(criterioId)

                        idsCriteriosPayload.push(criterioId);

                        // --- Niveles de este criterio: clave compuesta (criterio_id, orden) ---
                        if (criterio.niveles && criterio.niveles.length > 0) {
                            const ordenesNivelesPayload = [];

                            for (let j = 0; j < criterio.niveles.length; j++) {
                                const nivel = criterio.niveles[j];
                                const ordenNivel = parseInt(nivel.orden) || (j + 1);
                                ordenesNivelesPayload.push(ordenNivel);

                                const puntajeNivelPorcentaje = parseFloat(
                                    ((nivel.puntaje / criterio.puntaje_maximo) * 100).toFixed(2)
                                );

                                const upsertNivelQuery = `
                                    INSERT INTO nivel_desempeno (criterio_id, nombre_nivel, descripcion, puntaje_maximo, orden)
                                    VALUES (?, ?, ?, ?, ?)
                                    ON DUPLICATE KEY UPDATE
                                        nombre_nivel = VALUES(nombre_nivel),
                                        descripcion = VALUES(descripcion),
                                        puntaje_maximo = VALUES(puntaje_maximo)
                                `;
                                console.log('insertando', criterioId)
                                await new Promise((res, rej) =>
                                    conn.query(
                                        upsertNivelQuery,
                                        [criterioId, nivel.nombre_nivel.trim(), nivel.descripcion.trim(), puntajeNivelPorcentaje, ordenNivel],
                                        (e, r) => e ? rej(e) : res(r)
                                    )
                                );
                            }

                            // Borrar niveles de este criterio cuyo orden ya no viene en el payload
                            await new Promise((res, rej) =>
                                conn.query(
                                    'DELETE FROM nivel_desempeno WHERE criterio_id = ? AND orden NOT IN (?)',
                                    [criterioId, ordenesNivelesPayload],
                                    (e, r) => e ? rej(e) : res(r)
                                )
                            );
                        } else {
                            await new Promise((res, rej) =>
                                conn.query('DELETE FROM nivel_desempeno WHERE criterio_id = ?', [criterioId], (e, r) => e ? rej(e) : res(r))
                            );
                        }
                    }

                    // 4. Eliminar criterios (y sus niveles) que ya no vienen en el payload
                    if (idsCriteriosPayload.length > 0) {
                        const criteriosABorrar = await new Promise((res, rej) =>
                            conn.query(
                                'SELECT id FROM criterio_rubrica WHERE rubrica_id = ? AND id NOT IN (?)',
                                [id, idsCriteriosPayload],
                                (e, r) => e ? rej(e) : res(r)
                            )
                        );
                        if (criteriosABorrar.length > 0) {
                            const idsABorrar = criteriosABorrar.map(c => c.id);
                            await new Promise((res, rej) =>
                                conn.query('DELETE FROM nivel_desempeno WHERE criterio_id IN (?)', [idsABorrar], (e, r) => e ? rej(e) : res(r))
                            );
                            await new Promise((res, rej) =>
                                conn.query('DELETE FROM criterio_rubrica WHERE id IN (?)', [idsABorrar], (e, r) => e ? rej(e) : res(r))
                            );
                        }
                    } else {
                        const criteriosExistentes = await new Promise((res, rej) =>
                            conn.query('SELECT id FROM criterio_rubrica WHERE rubrica_id = ?', [id], (e, r) => e ? rej(e) : res(r))
                        );
                        if (criteriosExistentes.length > 0) {
                            const idsExistentes = criteriosExistentes.map(c => c.id);
                            await new Promise((res, rej) =>
                                conn.query('DELETE FROM nivel_desempeno WHERE criterio_id IN (?)', [idsExistentes], (e, r) => e ? rej(e) : res(r))
                            );
                            await new Promise((res, rej) =>
                                conn.query('DELETE FROM criterio_rubrica WHERE rubrica_id = ?', [id], (e, r) => e ? rej(e) : res(r))
                            );
                        }
                    }

                    // 5. Confirmar transacción
                    conn.commit((err) => {
                        if (err) {
                            return conn.rollback(() => {
                                conn.release();
                                reject(err);
                            });
                        }
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
                        const checkOwnerQuery = `
                            SELECT COUNT(*) as count
                            FROM rubrica r
                            INNER JOIN rubrica_uso ru ON r.id = ru.id_rubrica
                            INNER JOIN evaluacion e ON ru.id_eval = e.id
                            INNER JOIN seccion s ON e.id_seccion = s.id
                            INNER JOIN permiso_docente pd ON s.id = pd.id_seccion
                            WHERE r.id = ? AND pd.docente_cedula = ?
                        `;
                        const checkResults = await new Promise((res, rej) => conn.query(checkOwnerQuery, [id, cedula], (e, r) => e ? rej(e) : res(r)));
                        
                        if (checkResults[0].count === 0) {
                            throw new Error('Rúbrica no encontrada o no tiene permisos para eliminarla');
                        }

                        const updateQ = 'UPDATE rubrica SET activo = 0, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = ?';
                        await new Promise((res, rej) => conn.query(updateQ, [id], (e, r) => e ? rej(e) : res(r)));

                        conn.commit((err) => {
                            if (err) {
                                return conn.rollback(() => {
                                    conn.release();
                                    reject(err);
                                });
                            }
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
