const connection = require('./conexion');

class ReportesModel {
    async getAdminStats(periodo) {
        return new Promise((resolve, reject) => {
            const queries = {
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
                // 4. Top Profesores (Rúbricas)
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
                // 5. Top Profesores (Evaluaciones)
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
                // 6. Actividad Mensual (Últimos 6 meses)
                actividadMensual: `
                    SELECT 
                        DATE_FORMAT(fecha_evaluado, '%Y-%m') as mes,
                        COUNT(id) as total_evaluaciones,
                        COUNT(DISTINCT cedula_evaluador) as profesores_activos
                    FROM evaluacion_realizada
                    WHERE fecha_evaluado >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
                    GROUP BY mes
                    ORDER BY mes ASC
                `,
                // 7. Uso de Rúbricas por Materia
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
                            WHEN promedio >= 18 THEN 'Sobresaliente (18-20)'
                            WHEN promedio >= 15 THEN 'Notable (15-17)'
                            WHEN promedio >= 10 THEN 'Aprobado (10-14)'
                            ELSE 'Reprobado (0-9)'
                        END as rango,
                        COUNT(*) as cantidad
                    FROM (
                        SELECT er.id, SUM(de.puntaje_obtenido) / 5 as promedio
                        FROM evaluacion_realizada er
                        INNER JOIN detalle_evaluacion de ON er.id = de.evaluacion_r_id
                        GROUP BY er.id
                    ) as notas
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
                    SELECT c.nombre, AVG(de.puntaje_obtenido / 5) as promedio
                    FROM carrera c
                    INNER JOIN materia_pensum mp ON c.codigo = mp.codigo_carrera
                    INNER JOIN seccion s ON mp.id = s.id_materia_plan
                    INNER JOIN evaluacion e ON s.id = e.id_seccion
                    INNER JOIN evaluacion_realizada er ON e.id = er.id_evaluacion
                    INNER JOIN detalle_evaluacion de ON er.id = de.evaluacion_r_id
                    GROUP BY c.codigo
                    ORDER BY promedio DESC
                `
            };

            const results = {};
            const keys = Object.keys(queries);
            let completed = 0;

            keys.forEach(key => {
                connection.query(queries[key], (err, rows) => {
                    if (err) {
                        console.error(`Error en query ${key}:`, err);
                        // No rechazamos inmediatamente para intentar obtener lo que se pueda
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
