const connection = require('./conexion');

class ReportesModel {
    async getAdminStats(periodo) {
        return new Promise((resolve, reject) => {
            let queries;
            if(periodo == 'any')
            {
                queries = {
                // 1. Totales Generales
                totales: `
                    SELECT 
                        (SELECT COUNT(*) FROM usuario_docente ud INNER JOIN usuario u ON ud.cedula_usuario = u.cedula WHERE u.activo = 1) as totalDocentes,
                        (SELECT COUNT(*) FROM rubrica WHERE activo = 1) as totalRubricas,
                        (SELECT COUNT(*) FROM evaluacion_realizada) as totalEvaluaciones
                `,
                // 2. Profesores Inactivos (Sin rúbricas)
                profesoresInactivos: `
                    SELECT CONCAT(u.nombre, ' ', u.apeliido) as nombre_completo, ud.especializacion, u.email
                    FROM usuario_docente ud
                    INNER JOIN usuario u ON ud.cedula_usuario = u.cedula
                    LEFT JOIN rubrica r ON ud.cedula_usuario = r.cedula_docente
                    WHERE u.activo = 1 AND r.id IS NULL
                    LIMIT 10
                `,
                // 3. Profesores Baja Actividad (Sin evaluaciones recientes > 30 días)
                profesoresBajaActividad: `
                    SELECT 
                        CONCAT(u.nombre, ' ', u.apeliido) as nombre_completo, 
                        ud.especializacion,
                        DATEDIFF(CURDATE(), MAX(er.fecha_evaluado)) as dias_inactivo
                    FROM usuario_docente ud
                    INNER JOIN usuario u ON ud.cedula_usuario = u.cedula
                    LEFT JOIN evaluacion_realizada er ON ud.cedula_usuario = er.cedula_evaluador
                    WHERE u.activo = 1
                    GROUP BY ud.cedula_usuario
                    HAVING dias_inactivo > 30 OR dias_inactivo IS NULL
                    LIMIT 10
                `,
                // 4. Top Profesores (x Rúbricas)
                topProfesoresPorRubricas: `
                    SELECT CONCAT(u.nombre, ' ', u.apeliido) as nombre_completo, COUNT(r.id) as total_rubricas
                    FROM usuario_docente ud
                    INNER JOIN usuario u ON ud.cedula_usuario = u.cedula
                    LEFT JOIN rubrica r ON ud.cedula_usuario = r.cedula_docente
                    WHERE u.activo = 1 AND r.activo = 1
                    GROUP BY ud.cedula_usuario
                    ORDER BY total_rubricas DESC
                    LIMIT 5
                `,
                // 5. Top Profesores (x Evaluaciones)
                topProfesoresPorEvaluaciones: `
                    SELECT CONCAT(u.nombre, ' ', u.apeliido) as nombre_completo, COUNT(er.id) as total_evaluaciones
                    FROM usuario_docente ud
                    INNER JOIN usuario u ON ud.cedula_usuario = u.cedula
                    LEFT JOIN evaluacion_realizada er ON ud.cedula_usuario = er.cedula_evaluador
                    WHERE u.activo = 1
                    GROUP BY ud.cedula_usuario
                    ORDER BY total_evaluaciones DESC
                    LIMIT 5
                `,
                actividadMensual: `
                    SELECT 
                        DATE_FORMAT(fecha_evaluado, '%Y-%m') as mes,
                        COUNT(id) as total_evaluaciones,
                        COUNT(DISTINCT cedula_evaluador) as profesores_activos
                    FROM evaluacion_realizada
                    GROUP BY mes
                    ORDER BY mes ASC
                `,
                // 7. Uso de Rúbricas x Materia
                usoRubricasPorMateria: `
                    SELECT m.nombre as materia, COUNT(DISTINCT r.id) as total_rubricas
                    FROM materia m
                    INNER JOIN materia_pensum mp ON m.codigo = mp.codigo_materia
                    INNER JOIN seccion s ON mp.id = s.id_materia_plan
                    INNER JOIN evaluacion e ON s.id = e.id_seccion
                    INNER JOIN rubrica_uso ru ON e.id = ru.id_eval
                    INNER JOIN rubrica r ON ru.id_rubrica = r.id
                    WHERE r.activo = 1
                    GROUP BY m.codigo
                    ORDER BY total_rubricas DESC
                    LIMIT 10
                `,
                // 8. Distribución de Calificaciones
                distribucionNotas: `
                    SELECT
                        CASE 
                            WHEN puntaje >= 90 THEN 'Sobresaliente (18-20)'
                            WHEN puntaje >= 75 THEN 'Notable (15-17)'
                            WHEN puntaje >= 50 THEN 'Aprobado (10-14)'
                            ELSE 'Reprobado (0-9)'
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
                            GROUP BY ins.cedula_estudiante, e.id
                        ) AS evaluaciones_x_estudiante
                        GROUP BY evaluaciones_x_estudiante.cedula_estudiante 
                    ) AS promedios_x_estudiante
                    GROUP BY rango
                `,
                // 9. Tasa de Completitud por Profesor
                tasaCompletitudPorProfesor: `
                    SELECT 
                        CONCAT(u.nombre, ' ', u.apeliido) as nombre_completo,
                        COUNT(DISTINCT e.id) as total_asignadas,
                        COUNT(DISTINCT er.id) as completadas,
                        ROUND((COUNT(DISTINCT er.id) / COUNT(DISTINCT e.id)) * 100, 2) as porcentaje_completitud
                    FROM usuario_docente ud
                    INNER JOIN usuario u ON ud.cedula_usuario = u.cedula
                    INNER JOIN permiso_docente pd ON ud.cedula_usuario = pd.docente_cedula
                    INNER JOIN evaluacion e ON pd.id_seccion = e.id_seccion
                    LEFT JOIN evaluacion_realizada er ON e.id = er.id_evaluacion AND ud.cedula_usuario = er.cedula_evaluador
                    WHERE u.activo = 1
                    GROUP BY ud.cedula_usuario
                    LIMIT 10
                `,
                // 10. Rendimiento por Carrera
                rendimientoCarrera: `
                    SELECT 
                        c.nombre,
                        c.codigo,
                        CONCAT(mp.codigo_carrera, '-', mp.codigo_materia, ' ', s.letra) AS seccion_codigo,
                        s.codigo_periodo AS lapso_academico,
                        r.id AS rubrica_id,
                        e.contenido AS nombre_rubrica,
                        r.nombre_rubrica AS nombre_real_rubrica,
                        e.ponderacion AS porcentaje_evaluacion,
                        SUM(de.puntaje_obtenido * nd.puntaje_maximo  * cr.puntaje_maximo * e.ponderacion /1000000) AS puntaje_total,
                        er.observaciones,
                        er.id,
                        er.fecha_evaluado AS fecha_evaluacion,
                        e.ponderacion AS puntaje_maximo_rubrica
                    FROM 
                        evaluacion e 
                        INNER JOIN rubrica_uso ru ON e.id = ru.id_eval
                        INNER JOIN rubrica r ON ru.id_rubrica = r.id
                        INNER JOIN criterio_rubrica cr ON r.id = cr.rubrica_id 
                        INNER JOIN seccion s ON e.id_seccion = s.id
                        INNER JOIN materia_pensum mp ON mp.id = s.id_materia_plan
                        INNER JOIN carrera c ON mp.codigo_carrera = c.codigo 
                        INNER JOIN inscripcion_seccion ins ON s.id = ins.id_seccion
                        LEFT JOIN evaluacion_realizada er ON e.id = er.id_evaluacion AND er.cedula_evaluado = ins.cedula_estudiante
                        LEFT JOIN detalle_evaluacion de ON er.id = de.evaluacion_r_id
                        LEFT JOIN nivel_desempeno nd ON de.id_criterio_detalle = nd.criterio_id  AND de.orden_detalle = nd.orden 
                                AND cr.id = nd.criterio_id 
                    GROUP BY
                        c.codigo
                    ORDER BY 
                        lapso_academico DESC, c.nombre, er.id
                `
            };
        } else {
            queries = {
                    // 1. Totales Generales
                    totales: `
                        SELECT 
                            (   SELECT COUNT(*) 
                                FROM usuario_docente ud 
                                INNER JOIN usuario u ON ud.cedula_usuario = u.cedula
                                INNER JOIN permiso_docente pd ON ud.cedula_usuario = pd.docente_cedula 
                                INNER JOIN seccion s ON pd.id_seccion = s.id
                                WHERE u.activo = 1
                                AND s.codigo_periodo = '${periodo}'
                            ) as totalDocentes,
                            (   SELECT COUNT(*) 
                                FROM rubrica r
                                JOIN 
                                (   SELECT fecha_inicio, fecha_fin
                                    FROM periodo_academico
                                    WHERE codigo = '${periodo}'
                                ) p ON r.fecha_creacion BETWEEN p.fecha_inicio AND p.fecha_fin
                                WHERE r.activo = 1
                            ) as totalRubricas,
                            (   SELECT COUNT(*) 
                                FROM evaluacion_realizada er
                                INNER JOIN evaluacion e ON er.id_evaluacion = e.id
                                INNER JOIN seccion s ON e.id_seccion = s.id
                                WHERE s.codigo_periodo = '${periodo}'
                            ) as totalEvaluaciones
                    `,
                    // 2. Profesores Inactivos (Sin rúbricas)
                    profesoresInactivos: `
                        SELECT 
                            CONCAT(u.nombre, ' ', u.apeliido) as nombre_completo,
                            ud.especializacion,
                            u.email
                        FROM usuario_docente ud
                        INNER JOIN usuario u ON ud.cedula_usuario = u.cedula
                        LEFT JOIN
                        (	SELECT fecha_inicio, fecha_fin, r.cedula_docente, r.id 
                            FROM periodo_academico pa
                            INNER JOIN rubrica r ON r.fecha_creacion BETWEEN pa.fecha_inicio AND pa.fecha_fin 
                            AND pa.codigo = '${periodo}'
                        ) rp ON rp.cedula_docente = u.cedula 
                        WHERE u.activo = 1 AND rp.cedula_docente IS NULL
                        GROUP BY ud.cedula_usuario 
                    `,
                    // 3. Profesores Baja Actividad (Sin evaluaciones recientes > 30 días)
                    profesoresBajaActividad: `
                        SELECT 
                            CONCAT(u.nombre, ' ', u.apeliido) as nombre_completo, 
                            ud.especializacion,
                            DATEDIFF(CURDATE(), MAX(er.fecha_evaluado)) as dias_inactivo
                        FROM usuario_docente ud
                        INNER JOIN permiso_docente pd ON ud.cedula_usuario  = pd.docente_cedula
                        INNER JOIN seccion s ON pd.id_seccion = s.id
                        INNER JOIN periodo_academico pa ON s.codigo_periodo  = pa.codigo 
                        INNER JOIN usuario u ON ud.cedula_usuario = u.cedula
                        LEFT JOIN evaluacion_realizada er ON ud.cedula_usuario = er.cedula_evaluador
                        WHERE u.activo = 1 
                        AND pa.codigo = '${periodo}'
                        GROUP BY ud.cedula_usuario
                        HAVING dias_inactivo > 30 OR dias_inactivo IS NULL
                        LIMIT 10
                    `,
                    // 4. Top Profesores (x Rúbricas)
                    topProfesoresPorRubricas: `
                        SELECT CONCAT(u.nombre, ' ', u.apeliido) as nombre_completo, COUNT(rp.id) as total_rubricas
                        FROM usuario_docente ud
                        INNER JOIN usuario u ON ud.cedula_usuario = u.cedula
                        INNER JOIN
                        (	SELECT fecha_inicio, fecha_fin, r.cedula_docente, r.id 
                            FROM periodo_academico pa
                            INNER JOIN rubrica r ON r.fecha_creacion BETWEEN pa.fecha_inicio AND pa.fecha_fin 
                            AND pa.codigo = '${periodo}'
                        ) rp ON rp.cedula_docente = u.cedula 
                        WHERE u.activo
                        GROUP BY ud.cedula_usuario
                        ORDER BY total_rubricas DESC
                        LIMIT 5
                    `,
                    // 5. Top Profesores (x Evaluaciones)
                    topProfesoresPorEvaluaciones: `
                        SELECT CONCAT(u.nombre, ' ', u.apeliido) as nombre_completo, COUNT(er.id) as total_evaluaciones
                        FROM usuario_docente ud
                        INNER JOIN usuario u ON ud.cedula_usuario = u.cedula
                        LEFT JOIN evaluacion_realizada er ON ud.cedula_usuario = er.cedula_evaluador
                        LEFT JOIN evaluacion e ON er.id_evaluacion = e.id
                        LEFT JOIN seccion s ON e.id_seccion = s.id
                        WHERE u.activo = 1 AND s.codigo_periodo = '${periodo}'
                        GROUP BY ud.cedula_usuario
                        ORDER BY total_evaluaciones DESC
                        LIMIT 5
                    `,
                    // 6. Actividad Mensual (Últimos 6 meses)
                    actividadMensual: `
                        SELECT 
                            DATE_FORMAT(fecha_evaluado, '%Y-%m') as mes,
                            COUNT(er.id) as total_evaluaciones,
                            COUNT(DISTINCT cedula_evaluador) as profesores_activos
                        FROM evaluacion_realizada er
                        INNER JOIN evaluacion e ON er.id_evaluacion = e.id 
                        INNER JOIN seccion s ON e.id_seccion = s.id 
                        INNER JOIN periodo_academico pa ON s.codigo_periodo = pa.codigo 
                        WHERE fecha_evaluado BETWEEN pa.fecha_inicio AND pa.fecha_fin 
                        AND pa.codigo = '${periodo}'
                        GROUP BY mes
                        ORDER BY mes ASC
                    `,
                    // 7. Uso de Rúbricas x Materia
                    usoRubricasPorMateria: `
                        SELECT m.nombre as materia, COUNT(DISTINCT r.id) as total_rubricas
                        FROM materia m
                        INNER JOIN materia_pensum mp ON m.codigo = mp.codigo_materia
                        INNER JOIN seccion s ON mp.id = s.id_materia_plan
                        INNER JOIN evaluacion e ON s.id = e.id_seccion
                        INNER JOIN rubrica_uso ru ON e.id = ru.id_eval
                        INNER JOIN rubrica r ON ru.id_rubrica = r.id
                        WHERE r.activo = 1
                        AND s.codigo_periodo = '${periodo}'
                        GROUP BY m.codigo
                        ORDER BY total_rubricas DESC
                        LIMIT 10
                    `,
                    // 8. Distribución de Calificaciones
                    distribucionNotas: `
                        SELECT
                        CASE 
                            WHEN puntaje >= 90 THEN 'Sobresaliente (18-20)'
                            WHEN puntaje >= 75 THEN 'Notable (15-17)'
                            WHEN puntaje >= 50 THEN 'Aprobado (10-14)'
                            ELSE 'Reprobado (0-9)'
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
                            WHERE s.codigo_periodo = '${periodo}'
                            GROUP BY ins.cedula_estudiante, e.id
                        ) AS evaluaciones_x_estudiante
                        GROUP BY evaluaciones_x_estudiante.cedula_estudiante 
                    ) AS promedios_x_estudiante
                    GROUP BY rango
                `,
                // 9. Tasa de Completitud por Profesor
                tasaCompletitudPorProfesor: `
                    SELECT 
                        CONCAT(u.nombre, ' ', u.apeliido) as nombre_completo,
                        COUNT(DISTINCT e.id) as total_asignadas,
                        COUNT(DISTINCT er.id) as completadas,
                        ROUND((COUNT(DISTINCT er.id) / COUNT(DISTINCT e.id)) * 100, 2) as porcentaje_completitud
                    FROM usuario_docente ud
                    INNER JOIN usuario u ON ud.cedula_usuario = u.cedula
                    INNER JOIN permiso_docente pd ON ud.cedula_usuario = pd.docente_cedula
                    INNER JOIN evaluacion e ON pd.id_seccion = e.id_seccion
                    LEFT JOIN evaluacion_realizada er ON e.id = er.id_evaluacion AND ud.cedula_usuario = er.cedula_evaluador
                    WHERE u.activo = 1
                    GROUP BY ud.cedula_usuario
                    LIMIT 10
                    `,
                    // 9. Tasa de Completitud por Profesor
                    tasaCompletitudPorProfesor: `
                        SELECT 
                            CONCAT(u.nombre, ' ', u.apeliido) as nombre_completo,
                            COUNT(DISTINCT e.id) as total_asignadas,
                            COUNT(DISTINCT er.id) as completadas,
                            ROUND((COUNT(DISTINCT er.id) / COUNT(DISTINCT e.id)) * 100, 2) as porcentaje_completitud
                        FROM usuario_docente ud
                        INNER JOIN usuario u ON ud.cedula_usuario = u.cedula
                        INNER JOIN permiso_docente pd ON ud.cedula_usuario = pd.docente_cedula
                        INNER JOIN seccion s ON pd.id_seccion  = s.id 
                        INNER JOIN evaluacion e ON pd.id_seccion = e.id_seccion
                        LEFT JOIN evaluacion_realizada er ON e.id = er.id_evaluacion AND ud.cedula_usuario = er.cedula_evaluador
                        WHERE u.activo = 1
                        AND s.codigo_periodo = '${periodo}'
                        GROUP BY ud.cedula_usuario
                        LIMIT 10
                    `,
                    // 10. Rendimiento por Carrera
                    rendimientoCarrera: `
                        SELECT 
                        c.nombre,
                        c.codigo,
                        CONCAT(mp.codigo_carrera, '-', mp.codigo_materia, ' ', s.letra) AS seccion_codigo,
                        s.codigo_periodo AS lapso_academico,
                        r.id AS rubrica_id,
                        e.contenido AS nombre_rubrica,
                        r.nombre_rubrica AS nombre_real_rubrica,
                        e.ponderacion AS porcentaje_evaluacion,
                        SUM(de.puntaje_obtenido * nd.puntaje_maximo  * cr.puntaje_maximo * e.ponderacion /1000000) AS puntaje_total,
                        er.observaciones,
                        er.id,
                        er.fecha_evaluado AS fecha_evaluacion,
                        e.ponderacion AS puntaje_maximo_rubrica
                    FROM 
                        evaluacion e 
                        INNER JOIN rubrica_uso ru ON e.id = ru.id_eval
                        INNER JOIN rubrica r ON ru.id_rubrica = r.id
                        INNER JOIN criterio_rubrica cr ON r.id = cr.rubrica_id 
                        INNER JOIN seccion s ON e.id_seccion = s.id
                        INNER JOIN materia_pensum mp ON mp.id = s.id_materia_plan
                        INNER JOIN carrera c ON mp.codigo_carrera = c.codigo 
                        INNER JOIN inscripcion_seccion ins ON s.id = ins.id_seccion
                        LEFT JOIN evaluacion_realizada er ON e.id = er.id_evaluacion AND er.cedula_evaluado = ins.cedula_estudiante
                        LEFT JOIN detalle_evaluacion de ON er.id = de.evaluacion_r_id
                        LEFT JOIN nivel_desempeno nd ON de.id_criterio_detalle = nd.criterio_id  AND de.orden_detalle = nd.orden 
                                AND cr.id = nd.criterio_id 
                        WHERE s.codigo_periodo = '${periodo}'
                    GROUP BY
                        c.codigo
                    ORDER BY 
                        lapso_academico DESC, c.nombre, er.id  `
                };
        }
            const results = {};
            const keys = Object.keys(queries);
            let completed = 0;

            keys.forEach(key => {
                connection.query(queries[key], (err, rows) => {
                    if (err) {
                        console.error(`Error en query ${key}:`, err);
                        results[key] = [];
                    } else {
                        if (key === 'totales') {
                            results.totalDocentes = rows[0].totalDocentes;
                            results.totalRubricas = rows[0].totalRubricas;
                            results.totalEvaluaciones = rows[0].totalEvaluaciones;
                        } else {
                            results[key] = rows;
                        }
                    }

                    completed++;
                    if (completed === keys.length) {
                        resolve(results);
                    }
                });
            });
        });
    }
}

module.exports = new ReportesModel();
