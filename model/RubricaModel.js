const connection = require('./conexion');
const NotificacionModel = require('./NotificacionModel');

class RubricaModel {
    async getAllCarreras() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    codigo, 
                    nombre
                FROM carrera
                ORDER BY nombre
            `;
            connection.query(query, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    async getTiposRubrica() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT id, nombre
                FROM tipo_rubrica
                GROUP BY nombre
                ORDER BY nombre
            `;
            connection.query(query, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    async getSemestres(carrera, periodo) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    DISTINCT mp.num_semestre AS semestre
                FROM materia_pensum mp
                INNER JOIN pensum p ON mp.id_pensum = p.id
                INNER JOIN pensum_periodo pp ON p.id = pp.id_pensum
                WHERE mp.codigo_carrera = ?
                AND pp.codigo_periodo = ?
                ORDER BY semestre;
            `;
            connection.query(query, [carrera, periodo], (err, results) => {
                if (err) return reject(err);
                resolve(results.map(r => r.semestre));
            });
        });
    }

    async getMaterias(carrera, semestre, periodo) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    m.codigo,
                    m.nombre,
                    mp.num_semestre AS semestre,
                    mp.unidades_credito AS creditos
                FROM materia m
                INNER JOIN materia_pensum mp ON m.codigo = mp.codigo_materia
                INNER JOIN pensum pen ON mp.id_pensum = pen.id
                INNER JOIN pensum_periodo pp ON pen.id = pp.id_pensum
                WHERE mp.codigo_carrera = ?
                AND mp.num_semestre = ?
                AND pp.codigo_periodo = ?
                ORDER BY nombre;
            `;
            connection.query(query, [carrera, semestre, periodo], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    async getSecciones(materia, carrera, periodo) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    s.id, 
                    CONCAT(mp.codigo_carrera, '-', mp.codigo_materia, ' ', s.letra) AS codigo,
                    IFNULL(GROUP_CONCAT(DISTINCT CONCAT(hs.dia, ' (', hs.hora_inicio, '-', hs.hora_cierre, ' (', hs.aula, ')', ')') SEPARATOR ', '), 'No encontrado') AS horario,
                    s.capacidad_maxima,
                    COUNT(ins.cedula_estudiante) AS estudiantes_inscritos,
                    pp.codigo_periodo AS lapse_academico
                FROM seccion s
                INNER JOIN materia_pensum mp ON s.id_materia_plan = mp.id
                INNER JOIN pensum pen ON mp.id_pensum = pen.id
                INNER JOIN pensum_periodo pp ON pen.id = pp.id_pensum
                LEFT JOIN horario_seccion hs ON s.id = hs.id_seccion
                LEFT JOIN inscripcion_seccion ins ON s.id = ins.id_seccion
                WHERE mp.codigo_materia = ? 
                AND mp.codigo_carrera = ? 
                AND pp.codigo_periodo = ?
                GROUP BY s.id
                ORDER BY codigo;
            `;
            connection.query(query, [materia, carrera, periodo], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    async getEvaluacionesPendientes(seccionId) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT
                    evaluacion_id,
                    id_seccion,
                    contenido_evaluacion,
                    tipo_evaluacion,
                    rubrica_id,
                    nombre_rubrica,
                    valor,
                    docente_cedula,
                    docente_nombre,
                    docente_apellido,
                    materia_nombre,
                    carrera_nombre,
                    total_evaluaciones,
                    seccion_codigo,
                    completadas,
                    total_evaluaciones - completadas AS pendientes,
                    fecha_evaluacion
                FROM
                (
                    SELECT 
                        e.id AS evaluacion_id,
                        e.contenido AS contenido_evaluacion,
                        GROUP_CONCAT(DISTINCT eeval.nombre SEPARATOR ', ') AS tipo_evaluacion,
                        MAX(r.id) AS rubrica_id,
                        IFNULL(MAX(r.nombre_rubrica), 'Sin rubrica') AS nombre_rubrica,
                        e.ponderacion as valor,
                        u.cedula as docente_cedula,
                        u.nombre as docente_nombre,
                        u.apeliido as docente_apellido,
                        m.nombre as materia_nombre,
                        c.nombre as carrera_nombre,
                        estud_sec.cantidad_en_seccion AS total_evaluaciones, 
                        CONCAT(mp.codigo_carrera, '-', mp.codigo_materia, ' ', s.letra) AS seccion_codigo,
                        COUNT(DISTINCT eval_est.id) AS completadas,
                        e.fecha_evaluacion,
                        s.id AS id_seccion
                    FROM evaluacion e
                    INNER JOIN seccion s ON e.id_seccion = s.id
                    INNER JOIN materia_pensum mp ON s.id_materia_plan = mp.id
                    INNER JOIN materia m ON mp.codigo_materia = m.codigo
                    INNER JOIN carrera c ON mp.codigo_carrera = c.codigo
                    INNER JOIN permiso_docente pd ON s.id = pd.id_seccion
                    INNER JOIN usuario_docente ud ON ud.cedula_usuario = pd.docente_cedula
                    INNER JOIN usuario u ON ud.cedula_usuario = u.cedula
                    LEFT JOIN (
                        SELECT 
                            COUNT(DISTINCT ins.cedula_estudiante) AS cantidad_en_seccion, 
                            ins.id_seccion
                        FROM inscripcion_seccion ins
                        GROUP BY ins.id_seccion
                    ) AS estud_sec ON s.id = estud_sec.id_seccion
                    LEFT JOIN (
                        SELECT 
                            er.id,
                            er.id_evaluacion
                        FROM evaluacion_realizada er 
                        GROUP BY er.id, er.id_evaluacion
                    ) AS eval_est ON eval_est.id_evaluacion = e.id
                    LEFT JOIN rubrica_uso ru ON e.id = ru.id_eval
                    LEFT JOIN rubrica r ON ru.id_rubrica = r.id
                    LEFT JOIN estrategia_empleada eemp ON e.id = eemp.id_eval
                    LEFT JOIN estrategia_eval eeval ON eemp.id_estrategia = eeval.id
                    WHERE r.id IS NULL
                    GROUP BY e.id
                ) AS todo
                WHERE id_seccion = ?
                ORDER BY fecha_evaluacion DESC;
            `;
            connection.query(query, [seccionId], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    async getEstrategias() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT id, nombre FROM estrategia_eval ORDER BY nombre';
            connection.query(query, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    async getEvaluacionDetalle(id) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    e.*, 
                    m.nombre AS materia_nombre,
                    GROUP_CONCAT(ee.id) AS estrategias_ids
                FROM evaluacion e
                INNER JOIN seccion s ON e.id_seccion = s.id
                INNER JOIN materia_pensum mp ON s.id_materia_plan = mp.id
                INNER JOIN materia m ON mp.codigo_materia = m.codigo
                LEFT JOIN estrategia_empleada eemp ON e.id = eemp.id_eval
                LEFT JOIN estrategia_eval ee ON eemp.id_estrategia = ee.id
                WHERE e.id = ?
                GROUP BY e.id
            `;
            connection.query(query, [id], (err, results) => {
                if (err) return reject(err);
                if (results.length === 0) return resolve(null);
                
                const evalData = results[0];
                evalData.estrategias = evalData.estrategias_ids
                    ? evalData.estrategias_ids.split(',').map(id => parseInt(id))
                    : [];
                delete evalData.estrategias_ids;
                resolve(evalData);
            });
        });
    }

    // ─── HELPER: queryAsync para transacciones ──────────────────────────────
    queryAsync(conn, sql, params) {
        return new Promise((resolve, reject) => {
            conn.query(sql, params, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    // ─── HELPER: beginTransaction / commit / rollback como Promises ─────────
    beginTransactionAsync(conn) {
        return new Promise((resolve, reject) => {
            conn.beginTransaction(err => (err ? reject(err) : resolve()));
        });
    }

    commitAsync(conn) {
        return new Promise((resolve, reject) => {
            conn.commit(err => (err ? reject(err) : resolve()));
        });
    }

    rollbackAsync(conn) {
        return new Promise((resolve) => {
            conn.rollback(() => resolve());
        });
    }

    getConnectionAsync() {
        return new Promise((resolve, reject) => {
            connection.getConnection((err, conn) => {
                if (err) return reject(err);
                resolve(conn);
            });
        });
    }

    // ────────────────────────────────────────────────────────────────────────
    // FIX PRINCIPAL: saveRubrica usa async/await correctamente con
    // commit/rollback como Promises para evitar throw dentro de callbacks.
    // ────────────────────────────────────────────────────────────────────────
    async saveRubrica(data) {
        let conn;
        try {
            conn = await this.getConnectionAsync();
            await this.beginTransactionAsync(conn);

            // Verificar que la evaluación no tenga rúbrica ya asignada
            const existing = await this.queryAsync(conn, 'SELECT id_rubrica FROM rubrica_uso WHERE id_eval = ?', [data.id_evaluacion]);
            if (existing.length > 0) {
                throw new Error('Esta evaluación ya tiene una rúbrica asignada.');
            }

            // Insertar rúbrica
            const resRubrica = await this.queryAsync(conn,
                `INSERT INTO rubrica (nombre_rubrica, cedula_docente, instrucciones, id_tipo) VALUES (?, ?, ?, ?)`,
                [data.nombre_rubrica, data.cedula_docente, data.instrucciones, data.tipo_rubrica]
            );
            const rubricaId = resRubrica.insertId;

            // Relacionar rúbrica con evaluación
            await this.queryAsync(conn,
                'INSERT INTO rubrica_uso (id_eval, id_rubrica) VALUES (?, ?)',
                [data.id_evaluacion, rubricaId]
            );

            // Insertar criterios y niveles
            for (const crit of data.criterios) {
                const resCrit = await this.queryAsync(conn,
                    `INSERT INTO criterio_rubrica (rubrica_id, descripcion, puntaje_maximo, orden) VALUES (?, ?, ?, ?)`,
                    [rubricaId, crit.descripcion, crit.puntaje_maximo, crit.orden]
                );
                const criterioId = resCrit.insertId;

                if (crit.niveles && crit.niveles.length > 0) {
                    for (const nivel of crit.niveles) {
                        await this.queryAsync(conn,
                            `INSERT INTO nivel_desempeno (criterio_id, nombre_nivel, descripcion, puntaje_maximo, orden) VALUES (?, ?, ?, ?, ?)`,
                            [criterioId, nivel.nombre_nivel, nivel.descripcion, nivel.puntaje, nivel.orden]
                        );
                    }
                }
            }

            await this.commitAsync(conn);
            conn.release();

            // Notificar al docente (no bloquea la respuesta)
            try {
                await NotificacionModel.create({
                    usuario_destino: data.cedula_docente,
                    mensaje: `La rúbrica "${data.nombre_rubrica}" ha sido habilitada exitosamente para su uso.`,
                    id_rubrica: rubricaId
                });
            } catch (notifErr) {
                console.error('Error al crear notificación de rúbrica:', notifErr);
            }

            return { success: true, rubricaId };

        } catch (error) {
            if (conn) {
                await this.rollbackAsync(conn);
                conn.release();
            }
            throw error;
        }
    }

    // ============================================================
    // GESTIÓN DE RÚBRICAS
    // ============================================================

    async getAllRubricas(periodo) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT
                    r.id,
                    r.nombre_rubrica,
                    e.fecha_evaluacion,
                    r.fecha_creacion,
                    GROUP_CONCAT(DISTINCT eeval.nombre SEPARATOR ', ') AS tipo_evaluacion,
                    e.ponderacion AS porcentaje_evaluacion,
                    r.activo,
                    m.nombre AS materia_nombre,
                    m.codigo AS materia_codigo,
                    CONCAT(mp.codigo_carrera, '-', mp.codigo_materia, ' ', s.letra) AS seccion_codigo,
                    CONCAT(u.nombre, ' ', u.apeliido) AS docente_nombre
                FROM rubrica r
                INNER JOIN rubrica_uso ru ON r.id = ru.id_rubrica
                INNER JOIN evaluacion e ON ru.id_eval = e.id
                INNER JOIN estrategia_empleada eemp ON e.id = eemp.id_eval
                INNER JOIN estrategia_eval eeval ON eemp.id_estrategia = eeval.id
                INNER JOIN seccion s ON e.id_seccion = s.id
                INNER JOIN materia_pensum mp ON s.id_materia_plan = mp.id
                INNER JOIN materia m ON mp.codigo_materia = m.codigo
                INNER JOIN permiso_docente pd ON s.id = pd.id_seccion
                INNER JOIN usuario_docente ud ON pd.docente_cedula = ud.cedula_usuario
                INNER JOIN usuario u ON ud.cedula_usuario = u.cedula
                WHERE r.activo = 1 AND u.activo = 1
                AND e.codigo_periodo = ?
                GROUP BY r.id
                ORDER BY fecha_creacion DESC;
            `;
            connection.query(query, [periodo], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    async getRubricaDetalle(id) {
        return new Promise((resolve, reject) => {
            const queryRubrica = `
                SELECT
                    r.id,
                    r.nombre_rubrica,
                    r.cedula_docente AS docente_cedula,
                    m.codigo AS materia_id,
                    s.letra AS seccion_id,
                    e.codigo_periodo AS lapse_academico,
                    e.fecha_evaluacion,
                    (SELECT SUM(puntaje_maximo) FROM criterio_rubrica cr_sub WHERE cr_sub.rubrica_id = r.id) AS porcentaje_evaluacion,
                    GROUP_CONCAT(DISTINCT eeval.nombre SEPARATOR ', ') AS tipo_evaluacion,
                    e.competencias,
                    r.instrucciones,
                    CASE WHEN cantidad_personas=1 THEN 'Individual' WHEN cantidad_personas=2 THEN 'En Pareja' ELSE 'Grupal' END AS modalidad,
                    e.cantidad_personas,
                    r.activo,
                    r.fecha_creacion AS created_at,
                    r.fecha_actualizacion AS updated_at,
                    m.nombre AS materia_nombre,
                    CONCAT(mp.codigo_carrera, '-', mp.codigo_materia, ' ', s.letra) AS seccion_codigo,
                    c.nombre AS carrera_nombre,
                    IFNULL(CONCAT(u2.nombre, ' ', u2.apeliido), CONCAT(u.nombre, ' ', u.apeliido)) AS docente_nombre
                FROM evaluacion e
                INNER JOIN rubrica_uso ru ON ru.id_eval = e.id
                INNER JOIN rubrica r ON r.id = ru.id_rubrica
                INNER JOIN seccion s ON e.id_seccion = s.id
                INNER JOIN permiso_docente pd ON s.id = pd.id_seccion
                INNER JOIN usuario_docente ud ON pd.docente_cedula = ud.cedula_usuario
                INNER JOIN usuario u ON u.cedula = ud.cedula_usuario
                INNER JOIN materia_pensum mp ON s.id_materia_plan = mp.id
                INNER JOIN pensum pen ON mp.id_pensum = pen.id
                INNER JOIN pensum_periodo pp ON pen.id = pp.id_pensum
                INNER JOIN materia m ON mp.codigo_materia = m.codigo
                INNER JOIN carrera c ON mp.codigo_carrera = c.codigo
                LEFT JOIN usuario_docente ud2 ON ud2.cedula_usuario = r.cedula_docente
                LEFT JOIN usuario u2 ON u2.cedula = ud2.cedula_usuario
                LEFT JOIN estrategia_empleada eemp ON e.id = eemp.id_eval
                LEFT JOIN estrategia_eval eeval ON eeval.id = eemp.id_estrategia
                WHERE r.id = ?
                GROUP BY r.id;
            `;
            const queryCriterios = `SELECT id, descripcion, puntaje_maximo, orden FROM criterio_rubrica WHERE rubrica_id = ? ORDER BY orden`;
            const queryNiveles = `
                SELECT n.criterio_id, n.nombre_nivel, n.descripcion, n.puntaje_maximo AS puntaje, n.orden
                FROM nivel_desempeno n
                INNER JOIN criterio_rubrica cr ON n.criterio_id = cr.id
                WHERE cr.rubrica_id = ?
                ORDER BY cr.orden, n.orden DESC;
            `;

            connection.query(queryRubrica, [id], (err, rubrica) => {
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

    async getRubricaForEdit(id, session) {
        return new Promise((resolve, reject) => {
            const esAdmin = session.id_rol === 1;

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
                    e.codigo_periodo AS lapse_academico, 
                    e.fecha_evaluacion,
                    (   SELECT SUM(puntaje_maximo) 
                        FROM criterio_rubrica cr_sub 
                        WHERE cr_sub.rubrica_id = r.id
                    ) AS porcentaje_evaluacion,
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
                INNER JOIN pensum_periodo pp ON pen.id = pp.id_pensum
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
                WHERE r.id = ? AND r.activo = 1
            `;

            let paramsRubrica = [id];
            if (!esAdmin) {
                queryRubrica += ` AND pd.docente_cedula = ?`;
                paramsRubrica.push(session.cedula);
            }
            queryRubrica += ` GROUP BY r.id ORDER BY fecha_evaluacion DESC;`;

            connection.query(queryRubrica, paramsRubrica, (err, rubricaResult) => {
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
                        const queryNiveles = `SELECT criterio_id, nombre_nivel, descripcion, puntaje_maximo AS puntaje, orden FROM nivel_desempeno WHERE criterio_id IN (?) ORDER BY criterio_id, orden DESC;`;

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

    async getCarreraYSemestreBySeccion(idSecc) {
        return new Promise((resolve, reject) => {
            const query = ` SELECT 
                                mp.codigo_carrera AS carrera_codigo, 
                                num_semestre AS semestre 
                            FROM seccion s 
                            INNER JOIN materia_pensum mp ON s.id_materia_plan = mp.id 
                            INNER JOIN pensum p ON mp.id_pensum = p.id
                            INNER JOIN pensum_periodo pp ON p.id = pp.id_pensum
                            WHERE s.id = ?;`;
            connection.query(query, [idSecc], (err, results) => {
                if (err) return reject(err);
                if (results.length === 0) return resolve(null);
                resolve({ carrera_codigo: results[0].carrera_codigo, semestre: results[0].semestre });
            });
        });
    }

    async getCarreras(cedula, esAdmin, periodo) {
        return new Promise((resolve, reject) => {
            let query, params = [periodo];
            if (esAdmin) {
                query = `   SELECT 
                                c.codigo, 
                                c.nombre, 
                                COUNT(DISTINCT mp.num_semestre) AS duracion_semestres 
                            FROM carrera c 
                            INNER JOIN materia_pensum mp ON c.codigo = mp.codigo_carrera
                            INNER JOIN pensum p ON mp.id_pensum = p.id
                            INNER JOIN pensum_periodo pp ON p.id = pp.id_pensum
                            WHERE pp.codigo_periodo = ?
                            GROUP BY c.codigo ORDER BY nombre;`;
            } else {
                query = `   SELECT 
                                c.codigo, 
                                c.nombre, 
                                COUNT(DISTINCT mp.num_semestre) AS duracion_semestres 
                            FROM carrera c 
                            INNER JOIN materia_pensum mp ON c.codigo = mp.codigo_carrera 
                            INNER JOIN pensum p ON mp.id_pensum = p.id
                            INNER JOIN pensum_periodo pp ON p.id = pp.id_pensum
                            INNER JOIN seccion s ON mp.id = s.id_materia_plan 
                            INNER JOIN permiso_docente pd ON s.id = pd.id_seccion
                            WHERE pd.docente_cedula = ? 
                            AND pp.codigo_periodo = ?
                            GROUP BY c.codigo`;
                params = [cedula, periodo];
            }
            connection.query(query, params, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    async getOpciones(cedula, esAdmin) {
        return new Promise((resolve, reject) => {
            let queryMaterias, paramsMaterias = [];
            if (esAdmin) { //CONDICIONAR POR PERIODO URGENTEMENTE
                queryMaterias = `SELECT codigo, nombre FROM materia ORDER BY nombre;`;
            } else { //CONDICIONAR POR PERIODO URGENTEMENTE
                queryMaterias = `SELECT m.codigo, m.nombre FROM materia m INNER JOIN materia_pensum mp ON m.codigo = mp.codigo_materia INNER JOIN seccion s ON mp.id = s.id_materia_plan INNER JOIN permiso_docente pd ON s.id = pd.id_seccion WHERE pd.docente_cedula = ? GROUP BY m.codigo ORDER BY m.nombre;`;
                paramsMaterias = [cedula];
            }

            connection.query(queryMaterias, paramsMaterias, (err, materias) => {
                if (err) return reject(err);

                let querySecciones, paramsSecciones = [];
                if (esAdmin) { //CONDICIONAR POR PERIODO URGENTEMENTE
                    querySecciones = `SELECT 
                                        s.id_materia_plan AS id, 
                                        s.letra, 
                                        CONCAT(mp.codigo_carrera, '-', mp.codigo_materia, '-', s.letra) AS codigo, 
                                        mp.codigo_materia AS materia_codigo,
                                        pp.codigo_periodo AS lapse_academico 
                                    FROM seccion s 
                                    INNER JOIN materia_pensum mp ON s.id_materia_plan = mp.id 
                                    INNER JOIN pensum pen ON mp.id_pensum = pen.id
                                    INNER JOIN pensum_periodo pp ON pen.id = pp.id_pensum
                                    GROUP BY codigo, lapse_academico 
                                    ORDER BY codigo;`;
                } else { //CONDICIONAR POR PERIODO URGENTEMENTE
                    querySecciones = `SELECT 
                                        s.id_materia_plan AS id, 
                                        s.letra, CONCAT(mp.codigo_carrera, '-', mp.codigo_materia, '-', s.letra) AS codigo, 
                                        mp.codigo_materia AS materia_codigo, 
                                        pp.codigo_periodo AS lapse_academico 
                                    FROM seccion s 
                                    INNER JOIN permiso_docente pd ON pd.id_seccion = s.id 
                                    INNER JOIN materia_pensum mp ON s.id_materia_plan = mp.id 
                                    INNER JOIN pensum pen ON mp.id_pensum = pen.id
                                    INNER JOIN pensum_periodo pp ON pen.id = pp.id_pensum
                                    WHERE pd.docente_cedula = ? 
                                    GROUP BY codigo, lapse_academico 
                                    ORDER BY codigo;`;
                    paramsSecciones = [cedula];
                }

                connection.query(querySecciones, paramsSecciones, (err, secciones) => {
                    if (err) return reject(err);
                    resolve({ materias, secciones });
                });
            });
        });
    }

    async getProfesores() {
        return new Promise((resolve, reject) => {
            const query = `SELECT CONCAT(u.nombre, ' ', u.apeliido) AS docente_nombre FROM usuario_docente ud INNER JOIN usuario u ON ud.cedula_usuario = u.cedula WHERE u.activo = 1 ORDER BY docente_nombre`;
            connection.query(query, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    async getEvaluacionesConRubrica(seccionId) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT
                    evaluacion_id, id_seccion, contenido_evaluacion, tipo_evaluacion,
                    rubrica_id, nombre_rubrica, valor, docente_cedula, docente_nombre,
                    docente_apellido, materia_nombre, carrera_nombre, total_evaluaciones,
                    seccion_codigo, completadas, total_evaluaciones - completadas AS pendientes,
                    fecha_evaluacion,
                    CASE 
                        WHEN rubrica_id IS NULL THEN 'Pendiente' 
                        WHEN rubrica_id IS NOT NULL AND total_evaluaciones = completadas AND total_evaluaciones != 0 THEN 'Completada' 
                        ELSE 'En Progreso' 
                    END as estado
                FROM (
                    SELECT 
                        e.id AS evaluacion_id, 
                        e.contenido AS contenido_evaluacion,
                        GROUP_CONCAT(DISTINCT eeval.nombre SEPARATOR ', ') AS tipo_evaluacion,
                        MAX(r.id) AS rubrica_id, 
                        IFNULL(MAX(r.nombre_rubrica), 'Sin rubrica') AS nombre_rubrica,
                        e.ponderacion as valor, 
                        u.cedula as docente_cedula, 
                        u.nombre as docente_nombre,
                        u.apeliido as docente_apellido, 
                        m.nombre as materia_nombre, 
                        c.nombre as carrera_nombre,
                        estud_sec.cantidad_en_seccion AS total_evaluaciones, 
                        CONCAT(mp.codigo_carrera, '-', mp.codigo_materia, ' ', s.letra) AS seccion_codigo,
                        COUNT(DISTINCT eval_est.id) AS completadas, 
                        e.fecha_evaluacion, 
                        s.id AS id_seccion
                    FROM evaluacion e
                    INNER JOIN seccion s ON e.id_seccion = s.id
                    INNER JOIN materia_pensum mp ON s.id_materia_plan = mp.id
                    INNER JOIN materia m ON mp.codigo_materia = m.codigo
                    INNER JOIN carrera c ON mp.codigo_carrera = c.codigo
                    INNER JOIN permiso_docente pd ON s.id = pd.id_seccion
                    INNER JOIN usuario_docente ud ON ud.cedula_usuario = pd.docente_cedula
                    INNER JOIN usuario u ON ud.cedula_usuario = u.cedula
                    LEFT JOIN rubrica_uso ru ON e.id = ru.id_eval
                    LEFT JOIN rubrica r ON ru.id_rubrica = r.id
                    LEFT JOIN (SELECT COUNT(DISTINCT ins.cedula_estudiante) AS cantidad_en_seccion, ins.id_seccion FROM inscripcion_seccion ins GROUP BY ins.id_seccion) AS estud_sec ON s.id = estud_sec.id_seccion
                    LEFT JOIN (SELECT er.id, er.id_evaluacion, SUM(de.puntaje_obtenido) AS puntaje_eval FROM evaluacion_realizada er INNER JOIN detalle_evaluacion de ON er.id = de.evaluacion_r_id GROUP BY er.id, er.id_evaluacion) AS eval_est ON eval_est.id_evaluacion = e.id
                    LEFT JOIN estrategia_empleada eemp ON e.id = eemp.id_eval
                    LEFT JOIN estrategia_eval eeval ON eemp.id_estrategia = eeval.id
                    GROUP BY e.id
                ) AS todo
                WHERE id_seccion = ?
                ORDER BY fecha_evaluacion DESC;
            `;
            connection.query(query, [seccionId], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    async getSemestresAdmin(carrera, cedula, esAdmin, periodo) {
        return new Promise((resolve, reject) => {
            let query, params = [];
            if (esAdmin) { //CONDICIONAR POR PERIODO URGENTEMENTE
                query = `SELECT 
                            DISTINCT mp.num_semestre AS semestre 
                        FROM materia_pensum mp 
                        INNER JOIN pensum p ON mp.id_pensum = p.id
                        INNER JOIN pensum_periodo pp ON p.id = pp.id_pensum
                        WHERE mp.codigo_carrera = ? 
                        AND pp.codigo_periodo = ?
                        ORDER BY semestre;`;
                params = [carrera, periodo];
            } else { //CONDICIONAR POR PERIODO URGENTEMENTE
                query = `SELECT 
                            DISTINCT mp.num_semestre AS semestre 
                        FROM materia_pensum mp 
                        INNER JOIN pensum p ON mp.id_pensum = p.id
                        INNER JOIN pensum_periodo pp ON p.id = pp.id_pensum
                        INNER JOIN seccion s ON mp.id = s.id_materia_plan 
                        INNER JOIN permiso_docente pd ON s.id = pd.id_seccion 
                        WHERE mp.codigo_carrera = ? 
                        AND pd.docente_cedula = ? 
                        AND pp.codigo_periodo = ?
                        ORDER BY semestre;`;
                params = [carrera, cedula, periodo];
            }
            connection.query(query, params, (err, results) => {
                if (err) return reject(err);
                resolve(results.map(r => r.semestre));
            });
        });
    }

    async getMateriasAdmin(carrera, semestre, cedula, esAdmin) {
        return new Promise((resolve, reject) => {
            let query, params = [];
            if (esAdmin) { //CONDICIONAR POR PERIODO URGENTEMENTE
                query = `SELECT m.codigo, m.nombre, mp.num_semestre AS semestre, mp.unidades_credito AS creditos FROM materia m INNER JOIN materia_pensum mp ON m.codigo = mp.codigo_materia WHERE mp.codigo_carrera = ? AND mp.num_semestre = ? ORDER BY nombre;`;
                params = [carrera, semestre];
            } else {
                query = `SELECT m.codigo, m.nombre, mp.num_semestre AS semestre, mp.unidades_credito AS creditos FROM materia m INNER JOIN materia_pensum mp ON m.codigo = mp.codigo_materia INNER JOIN seccion s ON mp.id = s.id_materia_plan INNER JOIN permiso_docente pd ON s.id = pd.id_seccion WHERE mp.codigo_carrera = ? AND mp.num_semestre = ? AND pd.docente_cedula = ? ORDER BY nombre;`;
                params = [carrera, semestre, cedula];
            }
            connection.query(query, params, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    async getSeccionesAdmin(materia, carreraCodigo, cedula, esAdmin) {
        return new Promise((resolve, reject) => {
            let query, params = [];
            if (esAdmin) { //CONDICIONAR POR PERIODO URGENTEMENTE
                query = `
                    SELECT s.id_materia_plan AS id, CONCAT(mp.codigo_carrera, '-', mp.codigo_materia, '-', s.letra) AS codigo,
                    pp.codigo_periodo AS lapse_academico, s.letra,
                    IFNULL(GROUP_CONCAT(DISTINCT CONCAT(hs.dia, ' (', hs.hora_inicio, '-', hs.hora_cierre, ' (', hs.aula, ')', ')') SEPARATOR ', '), 'No encontrado') AS horario,
                    hs.aula, s.capacidad_maxima, u.nombre AS docente_nombre, u.apeliido AS docente_apellido
                    FROM seccion s
                    INNER JOIN materia_pensum mp ON s.id_materia_plan = mp.id
                    INNER JOIN pensum pen ON mp.id_pensum = pen.id
                    INNER JOIN pensum_periodo pp ON pen.id = pp.id_pensum
                    INNER JOIN permiso_docente pd ON s.id = pd.id_seccion
                    INNER JOIN usuario_docente ud ON pd.docente_cedula = ud.cedula_usuario
                    INNER JOIN usuario u ON u.cedula = ud.cedula_usuario
                    LEFT JOIN horario_seccion hs ON s.id = hs.id_seccion
                    WHERE mp.codigo_materia = ? AND mp.codigo_carrera = ?
                    GROUP BY codigo, lapse_academico ORDER BY codigo;
                `;
                params = [materia, carreraCodigo];
            } else {
                query = `
                    SELECT 
                        s.id_materia_plan AS id, 
                        CONCAT(mp.codigo_carrera, '-', mp.codigo_materia, '-', s.letra) AS codigo,
                        pp.codigo_periodo AS lapse_academico, 
                        s.letra,
                        IFNULL(GROUP_CONCAT(CONCAT(hs.dia, ' (', hs.hora_inicio, '-', hs.hora_cierre, ')') SEPARATOR ', '), 'No encontrado') AS horario,
                        hs.aula, 
                        s.capacidad_maxima, 
                        u.nombre AS docente_nombre, 
                        u.apeliido AS docente_apellido
                    FROM seccion s
                    INNER JOIN materia_pensum mp ON s.id_materia_plan = mp.id
                    INNER JOIN pensum pen ON mp.id_pensum = pen.id
                    INNER JOIN pensum_periodo pp ON pen.id = pp.id_pensum
                    INNER JOIN permiso_docente pd ON s.id = pd.id_seccion
                    INNER JOIN usuario_docente ud ON pd.docente_cedula = ud.cedula_usuario
                    INNER JOIN usuario u ON u.cedula = ud.cedula_usuario
                    LEFT JOIN horario_seccion hs ON s.id = hs.id_seccion
                    WHERE mp.codigo_materia = ? AND mp.codigo_carrera = ? AND pd.docente_cedula = ?
                    GROUP BY codigo, lapse_academico ORDER BY codigo;
                `;
                params = [materia, carreraCodigo, cedula];
            }
            connection.query(query, params, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
}

module.exports = new RubricaModel();