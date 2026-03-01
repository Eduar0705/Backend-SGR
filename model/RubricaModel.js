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

    async getSemestres(carrera) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT DISTINCT pp.num_semestre AS semestre
                FROM plan_periodo pp
                WHERE pp.codigo_carrera = ? 
                ORDER BY semestre;
            `;
            connection.query(query, [carrera], (err, results) => {
                if (err) return reject(err);
                resolve(results.map(r => r.semestre));
            });
        });
    }

    async getMaterias(carrera, semestre) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    m.codigo,
                    m.nombre,
                    pp.num_semestre AS semestre,
                    pp.unidades_credito AS creditos
                FROM materia m
                INNER JOIN plan_periodo pp ON m.codigo = pp.codigo_materia
                WHERE pp.codigo_carrera = ?
                AND pp.num_semestre = ?
                ORDER BY nombre;
            `;
            connection.query(query, [carrera, semestre], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    async getSecciones(materia, carrera) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    s.id, 
                    CONCAT(pp.codigo_carrera, '-', pp.codigo_materia, ' ', s.letra) AS codigo,
                    IFNULL(GROUP_CONCAT(DISTINCT CONCAT(hs.dia, ' (', hs.hora_inicio, '-', hs.hora_cierre, ' (', hs.aula, ')', ')') SEPARATOR ', '), 'No encontrado') AS horario,
                    s.capacidad_maxima,
                    COUNT(ins.cedula_estudiante) AS estudiantes_inscritos,
                    pp.codigo_periodo AS lapse_academico
                FROM seccion s
                INNER JOIN plan_periodo pp ON s.id_materia_plan = pp.id
                LEFT JOIN horario_seccion hs ON s.id = hs.id_seccion
                LEFT JOIN inscripcion_seccion ins ON s.id = ins.id_seccion
                WHERE pp.codigo_materia = ? 
                AND pp.codigo_carrera = ? 
                GROUP BY s.id
                ORDER BY codigo;
            `;
            connection.query(query, [materia, carrera], (err, results) => {
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
                        CONCAT(pp.codigo_carrera, '-', pp.codigo_materia, ' ', s.letra) AS seccion_codigo,
                        COUNT(DISTINCT eval_est.id) AS completadas,
                        e.fecha_evaluacion,
                        s.id AS id_seccion
                    FROM evaluacion e
                    INNER JOIN seccion s ON e.id_seccion = s.id
                    INNER JOIN plan_periodo pp ON s.id_materia_plan = pp.id
                    INNER JOIN materia m ON pp.codigo_materia = m.codigo
                    INNER JOIN carrera c ON pp.codigo_carrera = c.codigo
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
                INNER JOIN plan_periodo pp ON s.id_materia_plan = pp.id
                INNER JOIN materia m ON pp.codigo_materia = m.codigo
                LEFT JOIN estrategia_empleada eemp ON e.id = eemp.id_eval
                LEFT JOIN estrategia_eval ee ON eemp.id_estrategia = ee.id
                WHERE e.id = ?
                GROUP BY e.id
            `;
            connection.query(query, [id], (err, results) => {
                if (err) return reject(err);
                if (results.length === 0) return resolve(null);
                
                const evalData = results[0];
                evalData.estrategias = evalData.estrategias_ids ? evalData.estrategias_ids.split(',').map(id => parseInt(id)) : [];
                delete evalData.estrategias_ids;
                resolve(evalData);
            });
        });
    }

    async saveRubrica(data) {
        return new Promise((resolve, reject) => {
            connection.getConnection((err, conn) => {
                if (err) return reject(err);

                conn.beginTransaction(async (err) => {
                    if (err) {
                        conn.release();
                        return reject(err);
                    }

                    try {
                        const checkQuery = 'SELECT id_rubrica FROM rubrica_uso WHERE id_eval = ?';
                        const [existing] = await this.queryAsync(conn, checkQuery, [data.id_evaluacion]);
                        if (existing) {
                            throw new Error('Esta evaluación ya tiene una rúbrica asignada.');
                        }

                        const rubricaQuery = `
                            INSERT INTO rubrica (nombre_rubrica, cedula_docente, instrucciones, id_tipo) 
                            VALUES (?, ?, ?, ?)
                        `;
                        const resRubrica = await this.queryAsync(conn, rubricaQuery, [
                            data.nombre_rubrica,
                            data.cedula_docente,
                            data.instrucciones,
                            data.tipo_rubrica
                        ]);
                        const rubricaId = resRubrica.insertId;

                        const rubricaUsoQuery = 'INSERT INTO rubrica_uso (id_eval, id_rubrica) VALUES (?, ?)';
                        await this.queryAsync(conn, rubricaUsoQuery, [data.id_evaluacion, rubricaId]);

                        for (const crit of data.criterios) {
                            const critQuery = `
                                INSERT INTO criterio_rubrica (rubrica_id, descripcion, puntaje_maximo, orden) 
                                VALUES (?, ?, ?, ?)
                            `;
                            const resCrit = await this.queryAsync(conn, critQuery, [
                                rubricaId,
                                crit.descripcion,
                                crit.puntaje_maximo,
                                crit.orden
                            ]);
                            const criterioId = resCrit.insertId;

                            if (crit.niveles && crit.niveles.length > 0) {
                                for (const nivel of crit.niveles) {
                                    const nivelQuery = `
                                        INSERT INTO nivel_desempeno (criterio_id, nombre_nivel, descripcion, puntaje_maximo, orden) 
                                        VALUES (?, ?, ?, ?, ?)
                                    `;
                                    await this.queryAsync(conn, nivelQuery, [
                                        criterioId,
                                        nivel.nombre_nivel,
                                        nivel.descripcion,
                                        nivel.puntaje,
                                        nivel.orden
                                    ]);
                                }
                            }
                        }

                        conn.commit(async (err) => {
                            if (err) throw err;
                            conn.release();
                            
                            // Notificar al docente que la rúbrica ha sido habilitada
                            try {
                                await NotificacionModel.create({
                                    usuario_destino: data.cedula_docente,
                                    mensaje: `La rúbrica "${data.nombre_rubrica}" ha sido habilitada exitosamente para su uso.`,
                                    id_rubrica: rubricaId
                                });
                            } catch (notifErr) {
                                console.error('Error al crear notificación de rúbrica:', notifErr);
                                // No bloqueamos la respuesta principal por un error en notificaciones
                            }

                            resolve({ success: true, rubricaId });
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

    queryAsync(conn, sql, params) {
        return new Promise((resolve, reject) => {
            conn.query(sql, params, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    // ============================================================
    // NUEVOS MÉTODOS PARA GESTIÓN DE RÚBRICAS
    // ============================================================

    async getAllRubricas() {
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
                    CONCAT(pp.codigo_carrera, '-', pp.codigo_materia, ' ', s.letra) AS seccion_codigo,
                    CONCAT(u.nombre, ' ', u.apeliido) AS docente_nombre
                FROM rubrica r
                INNER JOIN rubrica_uso ru ON r.id = ru.id_rubrica
                INNER JOIN evaluacion e ON ru.id_eval = e.id
                INNER JOIN estrategia_empleada eemp ON e.id = eemp.id_eval
                INNER JOIN estrategia_eval eeval ON eemp.id_estrategia = eeval.id
                INNER JOIN seccion s ON e.id_seccion = s.id
                INNER JOIN plan_periodo pp ON s.id_materia_plan = pp.id
                INNER JOIN materia m ON pp.codigo_materia = m.codigo
                INNER JOIN permiso_docente pd ON s.id = pd.id_seccion
                INNER JOIN usuario_docente ud ON pd.docente_cedula = ud.cedula_usuario
                INNER JOIN usuario u ON ud.cedula_usuario = u.cedula
                WHERE r.activo = 1 AND u.activo = 1
                GROUP BY r.id
                ORDER BY fecha_creacion DESC;
            `;
            connection.query(query, (err, results) => {
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
                    pp.codigo_periodo AS lapse_academico,
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
                    CONCAT(pp.codigo_carrera, '-', pp.codigo_materia, ' ', s.letra) AS seccion_codigo,
                    c.nombre AS carrera_nombre,
                    CONCAT(u.nombre, ' ', u.apeliido) AS docente_nombre
                FROM evaluacion e
                INNER JOIN rubrica_uso ru ON ru.id_eval = e.id
                INNER JOIN rubrica r ON r.id = ru.id_rubrica
                INNER JOIN seccion s ON e.id_seccion = s.id
                INNER JOIN permiso_docente pd ON s.id = pd.id_seccion
                INNER JOIN usuario_docente ud ON pd.docente_cedula = ud.cedula_usuario
                INNER JOIN usuario u ON u.cedula = ud.cedula_usuario
                INNER JOIN plan_periodo pp ON s.id_materia_plan = pp.id
                INNER JOIN materia m ON pp.codigo_materia = m.codigo
                INNER JOIN carrera c ON pp.codigo_carrera = c.codigo
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

    async getCarreraYSemestreByMateria(materiaCodigo) {
        return new Promise((resolve, reject) => {
            const query = `SELECT pp.codigo_carrera AS carrera_codigo, num_semestre AS semestre FROM materia m INNER JOIN plan_periodo pp ON m.codigo = pp.codigo_materia WHERE m.codigo = ? LIMIT 1;`;
            connection.query(query, [materiaCodigo], (err, results) => {
                if (err) return reject(err);
                if (results.length === 0) return resolve(null);
                resolve({ carrera_codigo: results[0].carrera_codigo, semestre: results[0].semestre });
            });
        });
    }

    async getCarreras(cedula, esAdmin) {
        return new Promise((resolve, reject) => {
            let query, params = [];
            if (esAdmin) {
                query = `SELECT c.codigo, c.nombre, COUNT(DISTINCT pp.num_semestre) AS duracion_semestres FROM carrera c INNER JOIN plan_periodo pp ON c.codigo = pp.codigo_carrera GROUP BY c.codigo ORDER BY nombre`;
            } else {
                query = `SELECT c.codigo, c.nombre, COUNT(DISTINCT pp.num_semestre) AS duracion_semestres FROM carrera c INNER JOIN plan_periodo pp ON c.codigo = pp.codigo_carrera INNER JOIN seccion s ON pp.id = s.id_materia_plan INNER JOIN permiso_docente pd ON s.id = pd.id_seccion WHERE pd.docente_cedula = ? GROUP BY c.codigo`;
                params = [cedula];
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
            if (esAdmin) {
                queryMaterias = `SELECT codigo, nombre FROM materia ORDER BY nombre;`;
            } else {
                queryMaterias = `SELECT m.codigo, m.nombre FROM materia m INNER JOIN plan_periodo pp ON m.codigo = pp.codigo_materia INNER JOIN seccion s ON pp.id = s.id_materia_plan INNER JOIN permiso_docente pd ON s.id = pd.id_seccion WHERE pd.docente_cedula = ? GROUP BY m.codigo ORDER BY m.nombre;`;
                paramsMaterias = [cedula];
            }

            connection.query(queryMaterias, paramsMaterias, (err, materias) => {
                if (err) return reject(err);

                let querySecciones, paramsSecciones = [];
                if (esAdmin) {
                    querySecciones = `SELECT s.id_materia_plan AS id, s.letra, CONCAT(pp.codigo_carrera, '-', pp.codigo_materia, '-', s.letra) AS codigo, pp.codigo_materia AS materia_codigo, pp.codigo_periodo AS lapse_academico FROM seccion s INNER JOIN plan_periodo pp ON s.id_materia_plan = pp.id GROUP BY codigo, lapse_academico ORDER BY codigo;`;
                } else {
                    querySecciones = `SELECT s.id_materia_plan AS id, s.letra, CONCAT(pp.codigo_carrera, '-', pp.codigo_materia, '-', s.letra) AS codigo, pp.codigo_materia AS materia_codigo, pp.codigo_periodo AS lapse_academico FROM seccion s INNER JOIN permiso_docente pd ON pd.id_seccion = s.id INNER JOIN plan_periodo pp ON s.id_materia_plan = pp.id WHERE pd.docente_cedula = ? GROUP BY codigo, lapse_academico ORDER BY codigo;`;
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
                    CASE WHEN rubrica_id IS NULL THEN 'Pendiente' WHEN rubrica_id IS NOT NULL AND total_evaluaciones = completadas AND total_evaluaciones != 0 THEN 'Completada' ELSE 'En Progreso' END as estado
                FROM (
                    SELECT e.id AS evaluacion_id, e.contenido AS contenido_evaluacion,
                        GROUP_CONCAT(DISTINCT eeval.nombre SEPARATOR ', ') AS tipo_evaluacion,
                        MAX(r.id) AS rubrica_id, IFNULL(MAX(r.nombre_rubrica), 'Sin rubrica') AS nombre_rubrica,
                        e.ponderacion as valor, u.cedula as docente_cedula, u.nombre as docente_nombre,
                        u.apeliido as docente_apellido, m.nombre as materia_nombre, c.nombre as carrera_nombre,
                        estud_sec.cantidad_en_seccion AS total_evaluaciones, 
                        CONCAT(pp.codigo_carrera, '-', pp.codigo_materia, ' ', s.letra) AS seccion_codigo,
                        COUNT(DISTINCT eval_est.id) AS completadas, e.fecha_evaluacion, s.id AS id_seccion
                    FROM evaluacion e
                    INNER JOIN seccion s ON e.id_seccion = s.id
                    INNER JOIN plan_periodo pp ON s.id_materia_plan = pp.id
                    INNER JOIN materia m ON pp.codigo_materia = m.codigo
                    INNER JOIN carrera c ON pp.codigo_carrera = c.codigo
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

    async getSemestresAdmin(carrera, cedula, esAdmin) {
        return new Promise((resolve, reject) => {
            let query, params = [];
            if (esAdmin) {
                query = `SELECT DISTINCT pp.num_semestre AS semestre FROM plan_periodo pp WHERE pp.codigo_carrera = ? ORDER BY semestre;`;
                params = [carrera];
            } else {
                query = `SELECT DISTINCT pp.num_semestre AS semestre FROM plan_periodo pp INNER JOIN seccion s ON pp.id = s.id_materia_plan INNER JOIN permiso_docente pd ON s.id = pd.id_seccion WHERE pp.codigo_carrera = ? AND pd.docente_cedula = ? ORDER BY semestre;`;
                params = [carrera, cedula];
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
            if (esAdmin) {
                query = `SELECT m.codigo, m.nombre, pp.num_semestre AS semestre, pp.unidades_credito AS creditos FROM materia m INNER JOIN plan_periodo pp ON m.codigo = pp.codigo_materia WHERE pp.codigo_carrera = ? AND pp.num_semestre = ? ORDER BY nombre;`;
                params = [carrera, semestre];
            } else {
                query = `SELECT m.codigo, m.nombre, pp.num_semestre AS semestre, pp.unidades_credito AS creditos FROM materia m INNER JOIN plan_periodo pp ON m.codigo = pp.codigo_materia INNER JOIN seccion s ON pp.id = s.id_materia_plan INNER JOIN permiso_docente pd ON s.id = pd.id_seccion WHERE pp.codigo_carrera = ? AND pp.num_semestre = ? AND pd.docente_cedula = ? ORDER BY nombre;`;
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
            if (esAdmin) {
                query = `
                    SELECT s.id_materia_plan AS id, CONCAT(pp.codigo_carrera, '-', pp.codigo_materia, '-', s.letra) AS codigo,
                    pp.codigo_periodo AS lapse_academico, s.letra,
                    IFNULL(GROUP_CONCAT(DISTINCT CONCAT(hs.dia, ' (', hs.hora_inicio, '-', hs.hora_cierre, ' (', hs.aula, ')', ')') SEPARATOR ', '), 'No encontrado') AS horario,
                    hs.aula, s.capacidad_maxima, u.nombre AS docente_nombre, u.apeliido AS docente_apellido
                    FROM seccion s
                    INNER JOIN plan_periodo pp ON s.id_materia_plan = pp.id
                    INNER JOIN permiso_docente pd ON s.id = pd.id_seccion
                    LEFT JOIN horario_seccion hs ON s.id = hs.id_seccion
                    INNER JOIN usuario_docente ud ON pd.docente_cedula = ud.cedula_usuario
                    INNER JOIN usuario u ON u.cedula = ud.cedula_usuario
                    WHERE pp.codigo_materia = ? AND pp.codigo_carrera = ?
                    GROUP BY codigo, lapse_academico ORDER BY codigo;
                `;
                params = [materia, carreraCodigo];
            } else {
                query = `
                    SELECT s.id_materia_plan AS id, CONCAT(pp.codigo_carrera, '-', pp.codigo_materia, '-', s.letra) AS codigo,
                    pp.codigo_periodo AS lapse_academico, s.letra,
                    IFNULL(GROUP_CONCAT(CONCAT(hs.dia, ' (', hs.hora_inicio, '-', hs.hora_cierre, ')') SEPARATOR ', '), 'No encontrado') AS horario,
                    hs.aula, s.capacidad_maxima, u.nombre AS docente_nombre, u.apeliido AS docente_apellido
                    FROM seccion s
                    INNER JOIN plan_periodo pp ON s.id_materia_plan = pp.id
                    INNER JOIN permiso_docente pd ON s.id = pd.id_seccion
                    LEFT JOIN horario_seccion hs ON s.id = hs.id_seccion
                    INNER JOIN usuario_docente ud ON pd.docente_cedula = ud.cedula_usuario
                    INNER JOIN usuario u ON u.cedula = ud.cedula_usuario
                    WHERE pp.codigo_materia = ? AND pp.codigo_carrera = ? AND pd.docente_cedula = ?
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
