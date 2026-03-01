const connection = require('./conexion');

class RubricaModel {
    async getCarreras() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    c.codigo, 
                    c.nombre, 
                    COUNT(DISTINCT pp.num_semestre) AS duracion_semestres
                FROM carrera c
                INNER JOIN plan_periodo pp ON c.codigo = pp.codigo_carrera
                WHERE c.activo = 1
                GROUP BY c.codigo
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
                    pp.codigo_periodo AS lapso_academico
                FROM seccion s
                INNER JOIN plan_periodo pp ON s.id_materia_plan = pp.id
                LEFT JOIN horario_seccion hs ON s.id = hs.id_seccion
                LEFT JOIN inscripcion_seccion ins ON s.id = ins.id_seccion
                WHERE pp.codigo_materia = ? 
                AND pp.codigo_carrera = ? 
                AND s.activo = 1
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
            const query = 'SELECT id, nombre FROM estrategia_eval WHERE activo = 1 ORDER BY nombre';
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
                        // 1. Verificar si ya tiene rúbrica
                        const checkQuery = 'SELECT id_rubrica FROM rubrica_uso WHERE id_eval = ?';
                        const [existing] = await this.queryAsync(conn, checkQuery, [data.id_evaluacion]);
                        if (existing) {
                            throw new Error('Esta evaluación ya tiene una rúbrica asignada.');
                        }

                        // 2. Insertar rúbrica
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

                        // 3. Relacionar con evaluación
                        const rubricaUsoQuery = 'INSERT INTO rubrica_uso (id_eval, id_rubrica) VALUES (?, ?)';
                        await this.queryAsync(conn, rubricaUsoQuery, [data.id_evaluacion, rubricaId]);

                        // 4. Insertar criterios y niveles
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

                        conn.commit((err) => {
                            if (err) throw err;
                            conn.release();
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

    // Helper para usar promesas con connection.query
    queryAsync(conn, sql, params) {
        return new Promise((resolve, reject) => {
            conn.query(sql, params, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
}

module.exports = new RubricaModel();
