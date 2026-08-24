const connection = require('./conexion');

class DashboardModel {
    async getStats(periodo) {
        return new Promise((resolve, reject) => {
            // 1. Contar los profesores
            const countProf = `SELECT 
                                    COUNT(*) AS total 
                                FROM usuario_docente ud 
                                INNER JOIN usuario u ON ud.cedula_usuario = u.cedula 
                                INNER JOIN permiso_docente pd ON u.cedula = pd.docente_cedula
                                INNER JOIN seccion s ON pd.id_seccion = s.id
                                INNER JOIN materia_pensum mp ON s.id_materia_plan = mp.id
                                INNER JOIN pensum p ON mp.id_pensum = p.id
                                INNER JOIN periodo_academico pa ON p.id = pa.id_pensum
                                WHERE u.activo = 1
                                AND pa.codigo = ?`;
            
            // 2. Contar las Rúbricas
            const countRubricas = ` SELECT 
                                        COUNT(*) AS total 
                                    FROM rubrica r
                                    INNER JOIN rubrica_uso ru ON r.id = ru.id_rubrica
                                    INNER JOIN evaluacion e ON ru.id_eval = e.id
                                    INNER JOIN seccion s ON e.id_seccion = s.id
                                    WHERE s.codigo_periodo = ?`;

            // 3. Contar evaluaciones pendientes
            const countEvaluacionesPendientes = `
                SELECT COUNT(*) AS total
                FROM (
                    SELECT e.id
                    FROM evaluacion e 
                    INNER JOIN seccion s ON e.id_seccion = s.id 
                    INNER JOIN inscripcion_seccion ins ON ins.id_seccion = s.id 
                    LEFT JOIN evaluacion_realizada er 
                        ON e.id = er.id_evaluacion AND ins.cedula_estudiante = er.cedula_evaluado 
                    WHERE s.codigo_periodo = ?
                    GROUP BY e.id
                    HAVING COUNT(er.id) = 0
                ) AS evaluaciones_sin_corregir
            `;

            // 4. Rúbricas recientes
            const recentRubricasQuery = `
                SELECT 
                    r.id, r.nombre_rubrica, r.fecha_creacion, r.fecha_actualizacion,
                    r.instrucciones AS descripcion, m.nombre AS materia_nombre,
                    GROUP_CONCAT(DISTINCT eeval.nombre SEPARATOR ', ') AS tipo_evaluacion
                FROM rubrica r
                INNER JOIN rubrica_uso ru ON r.id = ru.id_rubrica
                INNER JOIN evaluacion e ON e.id = ru.id_eval
                INNER JOIN seccion s ON e.id_seccion = s.id
                INNER JOIN materia_pensum mp ON s.id_materia_plan = mp.id
                INNER JOIN materia m ON mp.codigo_materia = m.codigo
                LEFT JOIN estrategia_empleada eemp ON e.id = eemp.id_eval
                LEFT JOIN estrategia_eval eeval ON eeval.id = eemp.id_estrategia
                WHERE r.activo = 1
                AND s.codigo_periodo = ? 
                GROUP BY r.id
                ORDER BY r.fecha_actualizacion DESC LIMIT 4;
            `;

            // 5. Actividad reciente
            const recentActivityQuery = `
                SELECT
                    er.id, er.fecha_evaluado AS fecha_evaluacion,
                    u.nombre AS estudiante_nombre, u.apeliido AS estudiante_apellido,
                    r.nombre_rubrica, m.nombre AS materia_nombre,
                    uh.nombre AS docente_nombre, uh.apeliido AS docente_apellido,
                    ROUND(AVG(COALESCE(de.puntaje_obtenido,0))/5,2) AS puntaje_total
                FROM rubrica r
                INNER JOIN rubrica_uso ru ON r.id = ru.id_rubrica
                INNER JOIN evaluacion e ON ru.id_eval = e.id
                INNER JOIN seccion s ON e.id_seccion = s.id
                INNER JOIN materia_pensum mp ON s.id_materia_plan = mp.id
                INNER JOIN materia m ON mp.codigo_materia = m.codigo
                INNER JOIN permiso_docente pd ON s.id = pd.id_seccion
                INNER JOIN usuario_docente ud ON ud.cedula_usuario = pd.docente_cedula
                INNER JOIN usuario uh ON uh.cedula = pd.docente_cedula
                INNER JOIN inscripcion_seccion ins ON pd.id_seccion = ins.id_seccion
                INNER JOIN usuario_estudiante ue ON ue.cedula_usuario = ins.cedula_estudiante
                INNER JOIN usuario u ON ue.cedula_usuario = u.cedula
                LEFT JOIN evaluacion_realizada er ON e.id = er.id_evaluacion AND u.cedula = er.cedula_evaluado
                LEFT JOIN detalle_evaluacion de ON er.id = de.evaluacion_r_id
                WHERE r.activo = 1 AND u.activo = 1 AND er.id IS NOT NULL
                AND s.codigo_periodo = ? 
                GROUP BY er.id, er.fecha_evaluado, ins.cedula_estudiante, ins.id_seccion
                ORDER BY fecha_evaluado DESC LIMIT 4;
            `;
            const periodoParam = [periodo];
            connection.query(countProf, periodoParam, (err, resP) => {
                if (err) return reject(err);
                connection.query(countRubricas, periodoParam, (err, resR) => {
                    if (err) return reject(err);
                    connection.query(countEvaluacionesPendientes, periodoParam, (err, resE) => {
                        if (err) return reject(err);
                        connection.query(recentRubricasQuery, periodoParam, (err, resRR) => {
                            if (err) return reject(err);
                            connection.query(recentActivityQuery, periodoParam, (err, resA) => {
                                if (err) return reject(err);

                                const rubricasRecientes = resRR.map(r => ({
                                    id: r.id,
                                    nombre: r.nombre_rubrica,
                                    tipo: r.tipo_evaluacion,
                                    descripcion: r.descripcion,
                                    materia: r.materia_nombre,
                                    fecha: r.fecha_actualizacion || r.fecha_creacion
                                }));

                                const actividadReciente = resA.map(a => ({
                                    id: a.id,
                                    estudiante_nombre: a.estudiante_nombre,
                                    estudiante_apellido: a.estudiante_apellido,
                                    rubrica_nombre: a.nombre_rubrica,
                                    materia_nombre: a.materia_nombre,
                                    docente_nombre: a.docente_nombre,
                                    docente_apellido: a.docente_apellido,
                                    puntaje_total: a.puntaje_total,
                                    fecha: a.fecha_evaluacion
                                }));

                                resolve({
                                    totalProfesores: resP[0].total,
                                    totalRubricas: resR[0].total,
                                    totalEvaluacionesPendientes: resE[0].total || 0,
                                    rubricasRecientes,
                                    actividadReciente
                                });
                            });
                        });
                    });
                });
            });
        });
    }

    async getStudentStats(cedula) {
        return new Promise((resolve, reject) => {
            const q1 = `
                SELECT COUNT(DISTINCT e.id) AS total
                FROM evaluacion e 
                INNER JOIN seccion s ON e.id_seccion = s.id
                INNER JOIN inscripcion_seccion ins ON s.id = ins.id_seccion
                INNER JOIN rubrica_uso ru ON e.id = ru.id_eval
                INNER JOIN rubrica r ON ru.id_rubrica = r.id
                WHERE ins.cedula_estudiante = ? AND r.activo = 1;
            `;
            const q2 = `SELECT COUNT(DISTINCT er.id) as total FROM evaluacion_realizada er WHERE er.cedula_evaluado = ?;`;
            const q3 = `
                SELECT COUNT(*) AS total
                FROM (
                    SELECT e.id
                    FROM evaluacion e 
                    INNER JOIN seccion s ON e.id_seccion = s.id 
                    INNER JOIN inscripcion_seccion ins ON ins.id_seccion = s.id 
                    LEFT JOIN evaluacion_realizada er 
                        ON e.id = er.id_evaluacion AND ins.cedula_estudiante = er.cedula_evaluado 
                    WHERE ins.cedula_estudiante = ?
                    GROUP BY e.id
                    HAVING COUNT(er.id) = 0
                ) AS evaluaciones_sin_evaluarse
            `;
            //QUEDA   P E N D I E N T E    IMPLEMENTAR PONDERACION EN EL FRONTEND
            const q4 = `
                SELECT 
                    r.nombre_rubrica, 
                    m.nombre as materia, 
                	SUM(de.puntaje_obtenido * nd.puntaje_maximo  * cr.puntaje_maximo * e.ponderacion /1000000) AS puntaje_total,
                    e.ponderacion,
                    er.fecha_evaluado as fecha_evaluacion, 
                    tr.nombre AS tipo_evaluacion
                FROM evaluacion e
                INNER JOIN evaluacion_realizada er ON e.id = er.id_evaluacion
                INNER JOIN rubrica_uso ru ON ru.id_eval = er.id_evaluacion
                INNER JOIN rubrica r ON ru.id_rubrica = r.id
                INNER JOIN criterio_rubrica cr ON r.id = cr.rubrica_id                 
                INNER JOIN seccion s ON e.id_seccion = s.id
                INNER JOIN materia_pensum mp ON s.id_materia_plan = mp.id
                INNER JOIN materia m ON mp.codigo_materia = m.codigo
                INNER JOIN detalle_evaluacion de ON er.id = de.evaluacion_r_id
                INNER JOIN nivel_desempeno nd ON de.id_criterio_detalle = nd.criterio_id  AND de.orden_detalle = nd.orden 
                AND cr.id = nd.criterio_id 
                INNER JOIN tipo_rubrica tr ON tr.id = r.id_tipo
                WHERE er.cedula_evaluado = ?
                GROUP BY e.id ORDER BY er.fecha_evaluado DESC LIMIT 3
            `;
            const q5 = `
                SELECT 
                    r.nombre_rubrica, 
                    m.nombre as materia, 
                    e.fecha_evaluacion, 
                    tr.nombre as tipo_evaluacion, 
                    SUM(DISTINCT cr.puntaje_maximo) as porcentaje_evaluacion
                FROM evaluacion e
                INNER JOIN seccion s ON s.id = e.id_seccion
                INNER JOIN inscripcion_seccion ins ON s.id = ins.id_seccion
                INNER JOIN rubrica_uso ru ON ru.id_eval = e.id
                INNER JOIN rubrica r ON ru.id_rubrica = r.id
                INNER JOIN criterio_rubrica cr ON r.id = cr.rubrica_id
                INNER JOIN materia_pensum mp ON s.id_materia_plan = mp.id
                INNER JOIN materia m ON mp.codigo_materia = m.codigo
                INNER JOIN tipo_rubrica tr ON tr.id = r.id_tipo
                LEFT JOIN evaluacion_realizada er ON e.id = er.id_evaluacion
                WHERE ins.cedula_estudiante = ? AND e.fecha_evaluacion > CURDATE() AND r.activo = 1 AND er.id IS NULL
                GROUP BY e.id ORDER BY e.fecha_evaluacion ASC LIMIT 5
            `;

            connection.query(q1, [cedula], (err, r1) => {
                if (err) return reject(err);
                connection.query(q2, [cedula], (err, r2) => {
                    if (err) return reject(err);
                    connection.query(q3, [cedula], (err, r3) => {
                        if (err) return reject(err);
                        connection.query(q4, [cedula], (err, r4) => {
                            if (err) return reject(err);
                            connection.query(q5, [cedula], (err, r5) => {
                                if (err) return reject(err);
                                resolve({
                                    stats: {
                                        rubricasActivas: r1[0].total,
                                        evaluacionesCompletadas: r2[0].total,
                                        evaluacionesPendientes: r3[0].total
                                    },
                                    evaluacionesRecientes: r4,
                                    proximasEvaluaciones: r5
                                });
                            });
                        });
                    });
                });
            });
        });
    }

    async getTeacherStats(cedula, periodo) {
        console.log(periodo)
        return new Promise((resolve, reject) => {
            const q1 = `SELECT COUNT(*) as total FROM rubrica WHERE cedula_docente = ? AND activo = 1;`;
            const q2 = `
                SELECT 
                    COUNT(u.cedula) as total
                FROM usuario u
                INNER JOIN inscripcion_seccion ins ON u.cedula = ins.cedula_estudiante
                INNER JOIN seccion s ON ins.id_seccion = s.id
                INNER JOIN periodo_academico pa ON s.codigo_periodo = pa.codigo
                INNER JOIN permiso_docente pd ON s.id = pd.id_seccion
                WHERE pd.docente_cedula = ? AND u.activo = 1
                AND pa.codigo = ?;
            `;
            const q3 = `
                SELECT 
                    COUNT(*) as total
                FROM
                evaluacion_realizada er
                INNER JOIN evaluacion e ON er.id_evaluacion = e.id
                INNER JOIN seccion s ON e.id_seccion = s.id
                WHERE er.cedula_evaluador = ? 
                AND s.codigo_periodo = ?
            `;
            const q4 = `
                SELECT r.id, r.nombre_rubrica, e.fecha_evaluacion
                FROM rubrica r
                INNER JOIN rubrica_uso ru ON r.id = ru.id_rubrica
                INNER JOIN evaluacion e ON e.id = ru.id_eval
                INNER JOIN seccion s ON e.id_seccion = s.id
                WHERE r.cedula_docente = ? AND r.activo = 1 
                AND s.codigo_periodo = ?
                GROUP BY r.id
                ORDER BY r.fecha_actualizacion DESC LIMIT 3;
            `;
            const q5 = `
                SELECT
                    er.id, er.fecha_evaluado AS fecha_evaluacion,
                    u.nombre AS estudiante_nombre, u.apeliido AS estudiante_apellido,
                    r.nombre_rubrica, m.nombre AS materia_nombre,
                    ROUND(SUM(de.puntaje_obtenido * nd.puntaje_maximo  * cr.puntaje_maximo * e.ponderacion /1000000), 2) AS puntaje_total
                FROM rubrica r
                INNER JOIN rubrica_uso ru ON r.id = ru.id_rubrica
                INNER JOIN criterio_rubrica cr ON r.id = cr.rubrica_id 
                INNER JOIN evaluacion e ON ru.id_eval = e.id
                INNER JOIN seccion s ON e.id_seccion = s.id
                INNER JOIN materia_pensum mp ON s.id_materia_plan = mp.id
                INNER JOIN materia m ON mp.codigo_materia = m.codigo
                INNER JOIN permiso_docente pd ON s.id = pd.id_seccion
                INNER JOIN inscripcion_seccion ins ON pd.id_seccion = ins.id_seccion
                INNER JOIN usuario_estudiante ue ON ue.cedula_usuario = ins.cedula_estudiante
                INNER JOIN usuario u ON ue.cedula_usuario = u.cedula
                INNER JOIN evaluacion_realizada er ON e.id = er.id_evaluacion AND u.cedula = er.cedula_evaluado
                LEFT JOIN detalle_evaluacion de ON er.id = de.evaluacion_r_id
                LEFT JOIN nivel_desempeno nd ON de.id_criterio_detalle = nd.criterio_id  AND de.orden_detalle = nd.orden 
                	AND cr.id = nd.criterio_id 
                WHERE pd.docente_cedula = ? AND r.activo = 1 AND u.activo = 1 
                AND s.codigo_periodo = '2025-1'
                GROUP BY er.id, er.fecha_evaluado, ins.cedula_estudiante, ins.id_seccion
                ORDER BY fecha_evaluado DESC LIMIT 4;
            `;

            connection.query(q1, [cedula], (err, r1) => {
                if (err) return reject(err);
                connection.query(q2, [cedula, periodo], (err, r2) => {
                    if (err) return reject(err);
                    connection.query(q3, [cedula, periodo], (err, r3) => {
                        if (err) return reject(err);
                        connection.query(q4, [cedula, periodo], (err, r4) => {
                            if (err) return reject(err);
                            connection.query(q5, [cedula, periodo], (err, r5) => {
                                if (err) return reject(err);
                                resolve({
                                    totalRubricas: r1[0].total,
                                    totalEstudiantes: r2[0].total,
                                    totalEvaluaciones: r3[0].total,
                                    rubricasRecientes: r4,
                                    actividadReciente: r5
                                });
                            });
                        });
                    });
                });
            });
        });
    }
}

function calcularTiempoTranscurrido(fecha) {
    if (!fecha) return 'desconocido';
    const ahora = new Date();
    const fechaPasada = new Date(fecha);
    const diferencia = ahora - fechaPasada;

    const segundos = Math.floor(diferencia / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);
    const semanas = Math.floor(dias / 7);
    const meses = Math.floor(dias / 30);

    if (meses > 0) return meses === 1 ? 'hace 1 mes' : `hace ${meses} meses`;
    if (semanas > 0) return semanas === 1 ? 'hace 1 semana' : `hace ${semanas} semanas`;
    if (dias > 0) return dias === 1 ? 'hace 1 día' : `hace ${dias} días`;
    if (horas > 0) return horas === 1 ? 'hace 1 hora' : `hace ${horas} horas`;
    if (minutos > 0) return minutos === 1 ? 'hace 1 minuto' : `hace ${minutos} minutos`;
    return 'hace unos segundos';
}

class DashboardModelExtended extends DashboardModel {
    //P E N D I E N T E   distribucionNotas
    async getAdvancedStats(cedula, roleId, periodo) {
        
        const params = [cedula, periodo]
        
        return new Promise((resolve, reject) => {
            const queries = {
                distribucionNotas: `
                    SELECT
                        CASE 
                            WHEN puntaje >= 90 THEN 'Sobresaliente'
                            WHEN puntaje >= 75 THEN 'Notable'
                            WHEN puntaje >= 50 THEN 'Aprobado'
                            ELSE 'Reprobado'
                        END as rango,
                        puntaje,
                        COUNT(*) as cantidad
                    FROM
                    (
                        SELECT 
                            codigo,
                            nombre,
                            avg(promedio_eval) AS puntaje
                        FROM 
                        (
                            SELECT
                                ins.cedula_estudiante,
                                m.codigo,
                                m.nombre,
                                SUM(COALESCE(de.puntaje_obtenido * nd.puntaje_maximo  * cr.puntaje_maximo * e.ponderacion,0) /1000000) AS promedio_eval
                            FROM
                            evaluacion e 
                            INNER JOIN rubrica_uso ru ON e.id =ru.id_eval 
                            INNER JOIN rubrica r ON ru.id_rubrica = r.id 
                            INNER JOIN criterio_rubrica cr ON cr.rubrica_id = r.id 
                            INNER JOIN seccion s ON e.id_seccion = s.id 
                            INNER JOIN permiso_docente pd ON s.id = pd.id_seccion 
                            INNER JOIN materia_pensum mp  ON s.id_materia_plan = mp.id 
                            INNER JOIN materia m ON mp.codigo_materia = m.codigo
                            INNER JOIN inscripcion_seccion ins ON s.id = ins.id_seccion 
                            LEFT JOIN evaluacion_realizada er ON e.id = er.id_evaluacion AND er.cedula_evaluado = ins.cedula_estudiante 
                            LEFT JOIN detalle_evaluacion de ON er.id  = de.evaluacion_r_id 
                            LEFT JOIN nivel_desempeno nd ON de.id_criterio_detalle = nd.criterio_id AND nd.orden = de.orden_detalle 
                                AND nd.criterio_id = cr.id
                            WHERE pd.docente_cedula = ?
                            AND s.codigo_periodo = ?
                            GROUP BY ins.cedula_estudiante, e.id
                        ) AS evaluaciones_x_estudiante
                        GROUP BY evaluaciones_x_estudiante.cedula_estudiante 
                    ) AS promedios_x_estudiante
                    GROUP BY rango
                `,
                rendimientoMateria: `
                    SELECT
                        codigo,
                        nombre,
                        AVG(promedio) AS promedio
                    FROM
                    (
                        SELECT 
                            codigo,
                            nombre,
                            avg(promedio_eval) AS promedio
                        FROM 
                        (
                            SELECT
                                ins.cedula_estudiante,
                                m.codigo,
                                m.nombre,
                                SUM(COALESCE(de.puntaje_obtenido * nd.puntaje_maximo  * cr.puntaje_maximo * e.ponderacion,0) /1000000) AS promedio_eval
                            FROM
                            evaluacion e 
                            INNER JOIN rubrica_uso ru ON e.id =ru.id_eval 
                            INNER JOIN rubrica r ON ru.id_rubrica = r.id 
                            INNER JOIN criterio_rubrica cr ON cr.rubrica_id = r.id 
                            INNER JOIN seccion s ON e.id_seccion = s.id 
                            INNER JOIN permiso_docente pd ON s.id = pd.id_seccion 
                            INNER JOIN materia_pensum mp  ON s.id_materia_plan = mp.id 
                            INNER JOIN materia m ON mp.codigo_materia = m.codigo
                            INNER JOIN inscripcion_seccion ins ON s.id = ins.id_seccion 
                            LEFT JOIN evaluacion_realizada er ON e.id = er.id_evaluacion AND er.cedula_evaluado = ins.cedula_estudiante 
                            LEFT JOIN detalle_evaluacion de ON er.id  = de.evaluacion_r_id 
                            LEFT JOIN nivel_desempeno nd ON de.id_criterio_detalle = nd.criterio_id AND nd.orden = de.orden_detalle 
                                AND nd.criterio_id = cr.id
                            WHERE pd.docente_cedula = ?
                            AND s.codigo_periodo = ?
                            GROUP BY ins.cedula_estudiante, e.id
                        ) AS evaluaciones_x_estudiante
                        GROUP BY evaluaciones_x_estudiante.cedula_estudiante 
                    ) AS promedios_x_estudiante
                    GROUP BY codigo
                `
            };

            const promises = Object.entries(queries).map(([key, query]) => {
                return new Promise((res, rej) => {
                    connection.query(query, params, (err, results) => {
                        if (err) return rej(err);
                        res({ key, results });
                    });
                });
            });

            Promise.all(promises)
                .then(results => {
                    resolve(results.reduce((acc, item) => {
                        acc[item.key] = item.results;
                        return acc;
                    }, {}));
                })
                .catch(reject);
        });
    }
}

module.exports = {
    model: new DashboardModelExtended(),
    utils: { calcularTiempoTranscurrido }
};
