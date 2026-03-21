const pool = require('./conexion');

class EvaluacionModel {
    static getAllEvaluaciones(periodo) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT
                    evaluacion_id,
                    id_seccion,
                    contenido_evaluacion,
                    semestre,
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
                    fecha_evaluacion,
                    id_horario,
                    tipo_horario,
                    CASE
                        WHEN rubrica_id IS NULL OR completadas=0 THEN 'Pendiente'
                        WHEN rubrica_id IS NOT NULL AND total_evaluaciones = completadas THEN 'Completada'
                        ELSE 'En Progreso'
                    END as estado
                FROM
                (
                    SELECT 
                        e.id AS evaluacion_id,
                        e.contenido AS contenido_evaluacion,
                        r.id AS rubrica_id,
                        mp.num_semestre AS semestre,
                        IFNULL(r.nombre_rubrica, 'Sin rubrica') AS nombre_rubrica,
                        e.ponderacion as valor,
                        u.cedula as docente_cedula,
                        u.nombre as docente_nombre,
                        u.apeliido as docente_apellido,
                        m.nombre as materia_nombre,
                        c.nombre as carrera_nombre,
                        COALESCE(estud_sec.cantidad_en_seccion,0) AS total_evaluaciones, 
                        CONCAT(mp.codigo_carrera, '-', mp.codigo_materia, ' ', s.letra) AS seccion_codigo,
                        (SELECT COALESCE(COUNT(DISTINCT er.id),0) FROM evaluacion_realizada er
                        INNER JOIN evaluacion ON er.id_evaluacion = e.id) AS completadas,
                        e.fecha_evaluacion,
                        IFNULL(he.id_horario, hec.id) AS id_horario, 
                        CASE 
                            WHEN he.id_horario IS NOT NULL THEN 'Sección'
                            WHEN hec.id IS NOT NULL THEN 'Otro'
                            ELSE 'Sin horario'
                        END AS tipo_horario,
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
                            er.id_evaluacion,
                            SUM(de.puntaje_obtenido) AS puntaje_eval
                        FROM evaluacion_realizada er 
                        INNER JOIN detalle_evaluacion de ON er.id = de.evaluacion_r_id
                        GROUP BY er.id, er.id_evaluacion
                    ) AS eval_est ON eval_est.id_evaluacion = e.id
                    LEFT JOIN rubrica_uso ru ON e.id = ru.id_eval
                    LEFT JOIN rubrica r ON ru.id_rubrica = r.id
                    LEFT JOIN horario_eval he ON e.id = he.id_eval
                    LEFT JOIN horario_eval_clandestina hec ON e.id = hec.id_eval
                    WHERE e.codigo_periodo = ?
                    GROUP BY e.id
                ) AS todo
                ORDER BY fecha_evaluacion DESC;
            `;
            pool.query(query, [periodo], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    }
    static getAllSecciones(periodo) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT
                    id_seccion,
                    semestre,
                    docente_cedula,
                    docente_nombre,
                    docente_apellido,
                    materia_nombre,
                    carrera_nombre,
                    seccion_codigo,
                    id_horario,
                    total_evaluaciones
                FROM
                (
                    SELECT 
                        mp.num_semestre AS semestre,
                        u.cedula as docente_cedula,
                        u.nombre as docente_nombre,
                        u.apeliido as docente_apellido,
                        m.nombre as materia_nombre,
                        c.nombre as carrera_nombre,
                        COALESCE(estud_sec.cantidad_en_seccion,0) AS estudiantes_seccion, 
                        CONCAT(mp.codigo_carrera, '-', mp.codigo_materia, ' ', s.letra) AS seccion_codigo,
                        hs.id AS id_horario, 
                        COUNT(e.id) AS total_evaluaciones,
                        s.id AS id_seccion
                    FROM seccion s
                    INNER JOIN materia_pensum mp ON s.id_materia_plan = mp.id
                    INNER JOIN materia m ON mp.codigo_materia = m.codigo
                    INNER JOIN pensum p ON mp.id_pensum = p.id
                    INNER JOIN periodo_academico pa ON p.id = pa.id_pensum
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
                    LEFT JOIN horario_seccion hs ON s.id = hs.id_seccion
                    LEFT JOIN evaluacion e ON s.id = e.id_seccion
                    WHERE e.codigo_periodo = ?
                    GROUP BY s.id
                ) AS todo;
            `;
            pool.query(query, [periodo], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    }
    static getEvaluacionesFromSeccion(periodo, id_seccion) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT
                    evaluacion_id,
                    id_seccion,
                    contenido_evaluacion,
                    semestre,
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
                    fecha_evaluacion,
                    id_horario,
                    tipo_horario,
                    CASE
                        WHEN rubrica_id IS NULL OR completadas=0 THEN 'Pendiente'
                        WHEN rubrica_id IS NOT NULL AND total_evaluaciones = completadas THEN 'Completada'
                        ELSE 'En Progreso'
                    END as estado
                FROM
                (
                    SELECT 
                        e.id AS evaluacion_id,
                        e.contenido AS contenido_evaluacion,
                        r.id AS rubrica_id,
                        mp.num_semestre AS semestre,
                        IFNULL(r.nombre_rubrica, 'Sin rubrica') AS nombre_rubrica,
                        e.ponderacion as valor,
                        u.cedula as docente_cedula,
                        u.nombre as docente_nombre,
                        u.apeliido as docente_apellido,
                        m.nombre as materia_nombre,
                        c.nombre as carrera_nombre,
                        COALESCE(estud_sec.cantidad_en_seccion,0) AS total_evaluaciones, 
                        CONCAT(mp.codigo_carrera, '-', mp.codigo_materia, ' ', s.letra) AS seccion_codigo,
                        (SELECT COALESCE(COUNT(DISTINCT er.id),0) FROM evaluacion_realizada er
                        INNER JOIN evaluacion ON er.id_evaluacion = e.id) AS completadas,
                        e.fecha_evaluacion,
                        IFNULL(he.id_horario, hec.id) AS id_horario, 
                        CASE 
                            WHEN he.id_horario IS NOT NULL THEN 'Sección'
                            WHEN hec.id IS NOT NULL THEN 'Otro'
                            ELSE 'Sin horario'
                        END AS tipo_horario,
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
                            er.id_evaluacion,
                            SUM(de.puntaje_obtenido) AS puntaje_eval
                        FROM evaluacion_realizada er 
                        INNER JOIN detalle_evaluacion de ON er.id = de.evaluacion_r_id
                        GROUP BY er.id, er.id_evaluacion
                    ) AS eval_est ON eval_est.id_evaluacion = e.id
                    LEFT JOIN rubrica_uso ru ON e.id = ru.id_eval
                    LEFT JOIN rubrica r ON ru.id_rubrica = r.id
                    LEFT JOIN horario_eval he ON e.id = he.id_eval
                    LEFT JOIN horario_eval_clandestina hec ON e.id = hec.id_eval
                    WHERE e.codigo_periodo = ?
                    AND s.id = ?
                    GROUP BY e.id
                ) AS todo
                ORDER BY fecha_evaluacion DESC;
            `;
            pool.query(query, [periodo, id_seccion], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    }

    static getEstrategias() {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM estrategia_eval ORDER BY nombre`;
            pool.query(query, (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    }

    static getCarreras() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    c.codigo, 
                    c.nombre, 
                    COUNT(DISTINCT mp.num_semestre) AS duracion_semestres
                FROM carrera c
                INNER JOIN materia_pensum mp ON c.codigo = mp.codigo_carrera
                GROUP BY c.codigo
                ORDER BY nombre
            `;
            pool.query(query, (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    }

    static getMateriasByCarrera(carreraCodigo) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    m.codigo,
                    m.nombre,
                    mp.num_semestre AS semestre,
                    mp.unidades_credito AS creditos
                FROM materia m
                INNER JOIN materia_pensum mp ON m.codigo = mp.codigo_materia
                INNER JOIN carrera c ON mp.codigo_carrera = c.codigo
                WHERE mp.codigo_carrera = ?
                ORDER BY semestre, nombre
            `;
            pool.query(query, [carreraCodigo], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    }

    static getSecciones(materiaCodigo, carreraCodigo) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    s.id, 
                    CONCAT(mp.codigo_carrera, '-', mp.codigo_materia, ' ', s.letra) AS codigo,
                    IFNULL(GROUP_CONCAT(DISTINCT CONCAT(hs.dia, ' (', hs.hora_inicio, '-', hs.hora_cierre, ' (', hs.aula, ')', ')') SEPARATOR ', '), 'No encontrado') AS horario,
                    s.capacidad_maxima,
                    COUNT(ins.cedula_estudiante) AS estudiantes_inscritos
                FROM seccion s
                INNER JOIN materia_pensum mp ON s.id_materia_plan = mp.id
                LEFT JOIN horario_seccion hs ON s.id = hs.id_seccion
                LEFT JOIN inscripcion_seccion ins ON s.id = ins.id_seccion
                WHERE mp.codigo_materia = ? 
                AND mp.codigo_carrera = ? 
                GROUP BY s.id
                ORDER BY codigo;
            `;
            pool.query(query, [materiaCodigo, carreraCodigo], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    }

    static getEstudiantesBySeccion(seccionId) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    u.cedula,
                    u.nombre,
                    u.apeliido AS apellido,
                    u.email
                FROM seccion s
                INNER JOIN inscripcion_seccion ins ON s.id = ins.id_seccion
                INNER JOIN usuario_estudiante ud ON ins.cedula_estudiante = ud.cedula_usuario
                INNER JOIN usuario u ON ud.cedula_usuario = u.cedula
                WHERE ins.id_seccion = ?
                AND u.activo = 1 
                ORDER BY apellido, u.nombre;
            `;
            pool.query(query, [seccionId], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    }

    static getRubricasActivas() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT
                    r.id,
                    r.nombre_rubrica,
                    e.ponderacion AS porcentaje_evaluacion,
                    CASE
                        WHEN e.cantidad_personas=1 THEN 'Individual'
                        WHEN e.cantidad_personas=2 THEN 'En Pareja'
                        ELSE 'Grupal'
                    END AS modalidad,
                    GROUP_CONCAT(DISTINCT eeval.nombre SEPARATOR ', ') AS tipo_evaluacion,
                    e.cantidad_personas,
                    s.id AS seccion_id,
                    m.nombre AS materia_nombre,
                    m.codigo AS materia_codigo,
                    mp.num_semestre AS semestre,
                    c.codigo as carrera_codigo,
                    c.nombre as carrera_nombre,
                    CONCAT(mp.codigo_carrera, '-', mp.codigo_materia, ' ', s.letra) AS seccion_codigo,
                    IFNULL(GROUP_CONCAT(CONCAT(hs.dia, ' (', hs.hora_inicio, '-', hs.hora_cierre, ')') SEPARATOR ', '), 'No encontrado') AS seccion_horario,
                    hs.aula AS seccion_aula,
                    e.codigo_periodo AS seccion_lapso,
                    u.cedula AS docente_cedula,
                    u.nombre as docente_nombre,
                    u.apeliido as docente_apellido
                FROM rubrica r
                INNER JOIN rubrica_uso ru ON r.id = ru.id_rubrica
                INNER JOIN evaluacion e ON ru.id_eval = e.id
                INNER JOIN seccion s ON e.id_seccion = s.id
                INNER JOIN materia_pensum pp ON s.id_materia_plan = mp.id
                INNER JOIN materia m ON mp.codigo_materia = m.codigo
                INNER JOIN carrera c ON mp.codigo_carrera = c.codigo
                INNER JOIN permiso_docente pd ON s.id = pd.id_seccion
                INNER JOIN usuario_docente ud ON pd.docente_cedula = ud.cedula_usuario
                INNER JOIN usuario u ON ud.cedula_usuario = u.cedula
                LEFT JOIN estrategia_empleada eemp ON e.id = eemp.id_eval
                LEFT JOIN estrategia_eval eeval ON eemp.id_estrategia = eeval.id
                LEFT JOIN horario_seccion hs ON s.id = hs.id_seccion
                WHERE r.activo = 1 AND u.activo = 1
                GROUP BY r.id
                ORDER BY nombre_rubrica DESC;
            `;
            pool.query(query, (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    }

    static checkDuplicadosHorario(fecha, idHorario) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT e.id 
                FROM evaluacion e
                INNER JOIN horario_eval he ON e.id = he.id_eval
                WHERE e.fecha_evaluacion = ? AND he.id_horario = ?
            `;
            pool.query(query, [fecha, idHorario], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    }

    static checkDuplicadosFueraHorario(fecha, horaInicio, horaFin) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT e.id 
                FROM evaluacion e
                LEFT JOIN horario_eval he ON e.id = he.id_eval
                LEFT JOIN horario_seccion hs ON he.id_horario = hs.id
                LEFT JOIN horario_eval_clandestina hec ON e.id = hec.id_eval
                WHERE e.fecha_evaluacion = ? 
                AND (
                    (hs.hora_inicio < ? AND hs.hora_cierre > ?) OR
                    (hec.hora_inicio < ? AND hec.hora_cierre > ?)
                )
            `;
            pool.query(query, [fecha, horaFin, horaInicio, horaFin, horaInicio], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    }

    static createWithTransaction(evalData, strategies, horarioData, type) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                if (err) return reject(err);
                conn.beginTransaction(err => {
                    if (err) { conn.release(); return reject(err); }

                    const insertEval = `INSERT INTO evaluacion (ponderacion, cantidad_personas, contenido, competencias, instrumentos, fecha_evaluacion, id_seccion, codigo_periodo, corte_orden) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                    conn.query(insertEval, [
                        evalData.porcentaje, evalData.cant_personas, evalData.contenido, 
                        evalData.competencias, evalData.instrumentos, evalData.fecha_evaluacion, evalData.id_seccion,
                        evalData.periodo, evalData.corte
                    ], (err, result) => {
                        if (err) return conn.rollback(() => { conn.release(); reject(err); });

                        const eval_id = result.insertId;
                        
                        // Insertar horario
                        let insertHorario;
                        let valuesHorario;
                        if (type === 'Sección') {
                            insertHorario = `INSERT INTO horario_eval (id_horario, id_eval) VALUES (?, ?)`;
                            valuesHorario = [horarioData.id_horario, eval_id];
                        } else {
                            insertHorario = `INSERT INTO horario_eval_clandestina (hora_inicio, hora_cierre, id_eval) VALUES (?, ?, ?)`;
                            valuesHorario = [horarioData.hora_inicio, horarioData.hora_cierre, eval_id];
                        }

                        conn.query(insertHorario, valuesHorario, err => {
                            if (err) return conn.rollback(() => { conn.release(); reject(err); });

                            // Insertar estrategias
                            const valuesEstrategias = strategies.map(estId => [estId, eval_id]);
                            const insertEstrategias = `INSERT INTO estrategia_empleada (id_estrategia, id_eval) VALUES ?`;
                            conn.query(insertEstrategias, [valuesEstrategias], err => {
                                if (err) return conn.rollback(() => { conn.release(); reject(err); });

                                conn.commit(err => {
                                    if (err) return conn.rollback(() => { conn.release(); reject(err); });
                                    conn.release();
                                    resolve(eval_id);
                                });
                            });
                        });
                    });
                });
            });
        });
    }

    static getEvaluacionById(id) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    e.id AS evaluacion_id, 
                    e.contenido, 
                    e.ponderacion AS porcentaje, 
                    e.cantidad_personas,
                    e.competencias, 
                    e.cantidad_personas,
                    e.instrumentos, 
                    e.fecha_evaluacion, 
                    e.id_seccion,
                    e.corte_orden AS corte,
                    s.letra AS seccion_letra, 
                    mp.codigo_carrera AS carrera_codigo, 
                    mp.codigo_materia AS materia_codigo,
                    CASE 
                        WHEN he.id_horario IS NOT NULL THEN 'Sección'
                        WHEN hec.id IS NOT NULL THEN 'Otro'
                        ELSE 'Sin horario'
                    END AS tipo_horario,
                    he.id_horario, hs.dia, hs.aula,
                    IFNULL(hs.hora_inicio, hec.hora_inicio) AS hora_inicio,
                    IFNULL(hs.hora_cierre, hec.hora_cierre) AS hora_cierre
                FROM evaluacion e
                INNER JOIN seccion s ON e.id_seccion = s.id
                INNER JOIN materia_pensum mp ON s.id_materia_plan = mp.id
                LEFT JOIN horario_eval he ON e.id = he.id_eval
                LEFT JOIN horario_seccion hs ON hs.id = he.id_horario
                LEFT JOIN horario_eval_clandestina hec ON e.id = hec.id_eval
                WHERE e.id = ?
            `;
            pool.query(query, [id], (error, results) => {
                if (error) return reject(error);
                
                if (results.length === 0) return resolve(null);
                
                const evaluacion = results[0];
                const queryStrategies = `SELECT id_estrategia FROM estrategia_empleada WHERE id_eval = ?`;
                pool.query(queryStrategies, [id], (err, strategies) => {
                    if (err) return reject(err);
                    evaluacion.estrategias = strategies.map(s => s.id_estrategia);
                    resolve(evaluacion);
                });
            });
        });
    }

    static updateWithTransaction(id, evalData, strategies, horarioData, type) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                if (err) return reject(err);
                conn.beginTransaction(err => {
                    if (err) { conn.release(); return reject(err); }

                    const updateEval = `
                        UPDATE evaluacion 
                        SET contenido = ?, ponderacion = ?, cantidad_personas = ?, competencias = ?,
                        instrumentos = ?, fecha_evaluacion = ?, id_seccion = ?, corte_orden = ?
                        WHERE id = ?
                    `;
                    conn.query(updateEval, [
                        evalData.contenido, evalData.porcentaje, evalData.cant_personas, 
                        evalData.competencias, evalData.instrumentos, evalData.fecha_evaluacion, evalData.id_seccion,
                        evalData.corte, id
                    ], err => {
                        if (err) return conn.rollback(() => { conn.release(); reject(err); });

                        conn.query(`DELETE FROM horario_eval WHERE id_eval = ?`, [id], err => {
                            if (err) return conn.rollback(() => { conn.release(); reject(err); });
                            conn.query(`DELETE FROM horario_eval_clandestina WHERE id_eval = ?`, [id], err => {
                                if (err) return conn.rollback(() => { conn.release(); reject(err); });

                                // Insertar nuevo horario
                                let insertHorario;
                                let valuesHorario;
                                if (type === 'Sección') {
                                    insertHorario = `INSERT INTO horario_eval (id_horario, id_eval) VALUES (?, ?)`;
                                    valuesHorario = [horarioData.id_horario, id];
                                } else {
                                    insertHorario = `INSERT INTO horario_eval_clandestina (hora_inicio, hora_cierre, id_eval) VALUES (?, ?, ?)`;
                                    valuesHorario = [horarioData.hora_inicio, horarioData.hora_cierre, id];
                                }

                                conn.query(insertHorario, valuesHorario, err => {
                                    if (err) return conn.rollback(() => { conn.release(); reject(err); });

                                    // Actualizar estrategias
                                    conn.query(`DELETE FROM estrategia_empleada WHERE id_eval = ?`, [id], err => {
                                        if (err) return conn.rollback(() => { conn.release(); reject(err); });

                                        const valuesEstrategias = strategies.map(estId => [estId, id]);
                                        conn.query(`INSERT INTO estrategia_empleada (id_estrategia, id_eval) VALUES ?`, [valuesEstrategias], err => {
                                            if (err) return conn.rollback(() => { conn.release(); reject(err); });

                                            conn.commit(err => {
                                                if (err) return conn.rollback(() => { conn.release(); reject(err); });
                                                conn.release();
                                                resolve();
                                            });
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

    static getHorarioBySeccion(seccionId) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    hs.id, hs.dia, hs.dia_num, hs.aula, hs.hora_inicio, hs.hora_cierre,
                    pa.codigo AS periodo, pa.fecha_inicio, pa.fecha_fin
                FROM seccion s
                INNER JOIN horario_seccion hs ON s.id = hs.id_seccion
                INNER JOIN materia_pensum mp ON s.id_materia_plan = mp.id
                INNER JOIN pensum pen ON mp.id_pensum = pen.id
                INNER JOIN periodo_academico pa ON pen.id = pa.id_pensum
                WHERE s.id = ?
                GROUP BY hs.id;
            `;
            pool.query(query, [seccionId], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    }

    static getEvaluacionesBySeccion(periodo, seccionId) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    e.id, e.contenido, e.ponderacion, e.fecha_evaluacion,
                    CASE WHEN r.id IS NOT NULL THEN 1 ELSE 0 END as tiene_rubrica,
                    r.id as rubrica_id, r.nombre_rubrica
                FROM evaluacion e
                LEFT JOIN rubrica_uso ru ON e.id = ru.id_eval
                LEFT JOIN rubrica r ON ru.id_rubrica = r.id
                WHERE e.id_seccion = ?
                ORDER BY e.fecha_evaluacion DESC
            `;
            pool.query(query, [seccionId], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    }
}

module.exports = EvaluacionModel;
