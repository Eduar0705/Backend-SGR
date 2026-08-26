const conexion = require('./conexion');

function query(sql, params = []) {
    return new Promise((resolve, reject) => {
        conexion.query(sql, params, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
}

class TeacherEstudiantesModel {
    static async getEstudiantes(docenteCedula, esAdmin, periodo) {
        let sqlQuery;
        let queryParams = [];
        periodo = "2025-1"

        if (esAdmin) {
            // Admin puede ver todos los estudiantes
            sqlQuery = `
                   SELECT 
                        cedula,
                        nombre,
                        apellido,
                        email,
                        fecha_nacimiento,
                        activo,
                        carrera_codigo,
                        carrera_nombre,
                        duracion_semestres,
                        seccion,
                        total_evaluaciones,
                        AVG(estudiante.puntaje_x_materia) AS promedio_puntaje,
                        ultima_evaluacion
                FROM
                    (
                    SELECT 
                        cedula,
                        nombre,
                        apellido,
                        email,
                        fecha_nacimiento,
                        activo,
                        carrera_codigo,
                        carrera_nombre,
                        duracion_semestres,
                        seccion,
                        COUNT(estudiante_x_materia.id) AS total_evaluaciones, 
                        IFNULL(MAX(estudiante_x_materia.fecha_evaluado), 'Sin registros.') AS ultima_evaluacion,
                        SUM(COALESCE(puntaje_eval,0)) AS puntaje_x_materia
                    FROM 
                            (		
                                SELECT 
                                u.cedula,
                                u.nombre,
                                u.apeliido AS apellido,
                                u.email,
                                u.fecha_nac AS fecha_nacimiento,
                                u.activo,
                                e.id,
                                ue.codigo_carrera AS carrera_codigo,
                                c.nombre AS carrera_nombre,
                                COUNT(DISTINCT num_semestre) AS duracion_semestres,
                                CONCAT(mp.codigo_materia, ' ', s.letra) AS seccion,
                                e.id as evaluacion_id,
                                e.contenido,
                                IFNULL(r.nombre_rubrica, 'Rubrica por crear...') AS nombre_rubrica,
                                m.nombre as materia,
                                m.codigo,
                                er.fecha_evaluado,
                                (SELECT 
                                    SUM(COALESCE(de2.puntaje_obtenido * nd2.puntaje_maximo * cr2.puntaje_maximo * e.ponderacion / 1000000, 0))
                                FROM evaluacion_realizada er2
                                INNER JOIN detalle_evaluacion de2 ON er2.id = de2.evaluacion_r_id
                                INNER JOIN nivel_desempeno nd2 ON de2.id_criterio_detalle = nd2.criterio_id AND de2.orden_detalle = nd2.orden
                                INNER JOIN criterio_rubrica cr2 ON cr2.id = nd2.criterio_id
                                WHERE er2.id_evaluacion = e.id AND er2.cedula_evaluado = ins.cedula_estudiante
                                ) AS puntaje_eval
                            FROM 
                                evaluacion e 
                                INNER JOIN rubrica_uso ru ON e.id = ru.id_eval
                                INNER JOIN rubrica r ON ru.id_rubrica = r.id
                                INNER JOIN seccion s ON e.id_seccion = s.id
                                INNER JOIN materia_pensum mp ON mp.id = s.id_materia_plan
                                INNER JOIN carrera c ON mp.codigo_carrera = c.codigo 
                                INNER JOIN materia m ON mp.codigo_materia = m.codigo
                                INNER JOIN inscripcion_seccion ins ON s.id = ins.id_seccion
                                INNER JOIN usuario_estudiante ue ON ins.cedula_estudiante = ue.cedula_usuario 
                                INNER JOIN usuario u ON ue.cedula_usuario = u.cedula 
                                LEFT JOIN evaluacion_realizada er ON e.id = er.id_evaluacion AND er.cedula_evaluado = ins.cedula_estudiante
                            WHERE s.codigo_periodo = ?
                            GROUP BY ins.cedula_estudiante, e.id
                            ORDER BY e.fecha_evaluacion, er.fecha_evaluado DESC
                        ) AS estudiante_x_materia
                        GROUP BY estudiante_x_materia.cedula, estudiante_x_materia.codigo 
                    ) AS estudiante
                    GROUP BY estudiante.cedula 
            `;
        } else {
            // Docente solo ve estudiantes de secciones a las que tiene permiso
            sqlQuery = `
        SELECT 
            cedula,
                nombre,
                apellido,
                email,
                fecha_nacimiento,
                activo,
                carrera_codigo,
                carrera_nombre,
                duracion_semestres,
                seccion,
                total_evaluaciones,
                AVG(estudiante.puntaje_x_materia) AS promedio_puntaje,
                ultima_evaluacion
        FROM
            (
            SELECT 
                cedula,
                nombre,
                apellido,
                email,
                fecha_nacimiento,
                activo,
                carrera_codigo,
                carrera_nombre,
                duracion_semestres,
                seccion,
                COUNT(estudiante_x_materia.id) AS total_evaluaciones, 
                IFNULL(MAX(estudiante_x_materia.fecha_evaluado), 'Sin registros.') AS ultima_evaluacion,
                SUM(COALESCE(puntaje_eval,0)) AS puntaje_x_materia
            FROM 
                    (		
                        SELECT 
                        u.cedula,
                        u.nombre,
                        u.apeliido AS apellido,
                        u.email,
                        u.fecha_nac AS fecha_nacimiento,
                        u.activo,
                        e.id,
                        ue.codigo_carrera AS carrera_codigo,
                        c.nombre AS carrera_nombre,
                        COUNT(DISTINCT num_semestre) AS duracion_semestres,
                        CONCAT(mp.codigo_materia, ' ', s.letra) AS seccion,
                        e.id as evaluacion_id,
                        e.contenido,
                        IFNULL(r.nombre_rubrica, 'Rubrica por crear...') AS nombre_rubrica,
                        m.nombre as materia,
                        m.codigo,
                        er.fecha_evaluado,
                        (SELECT 
                            SUM(COALESCE(de2.puntaje_obtenido * nd2.puntaje_maximo * cr2.puntaje_maximo * e.ponderacion / 1000000, 0))
                        FROM evaluacion_realizada er2
                        INNER JOIN detalle_evaluacion de2 ON er2.id = de2.evaluacion_r_id
                        INNER JOIN nivel_desempeno nd2 ON de2.id_criterio_detalle = nd2.criterio_id AND de2.orden_detalle = nd2.orden
                        INNER JOIN criterio_rubrica cr2 ON cr2.id = nd2.criterio_id
                        WHERE er2.id_evaluacion = e.id AND er2.cedula_evaluado = ins.cedula_estudiante
                        ) AS puntaje_eval
                    FROM 
                        evaluacion e 
                        INNER JOIN rubrica_uso ru ON e.id = ru.id_eval
                        INNER JOIN rubrica r ON ru.id_rubrica = r.id
                        INNER JOIN seccion s ON e.id_seccion = s.id
                        INNER JOIN permiso_docente pd ON s.id = pd.id_seccion 
                        INNER JOIN materia_pensum mp ON mp.id = s.id_materia_plan
                        INNER JOIN carrera c ON mp.codigo_carrera = c.codigo 
                        INNER JOIN materia m ON mp.codigo_materia = m.codigo
                        INNER JOIN inscripcion_seccion ins ON s.id = ins.id_seccion
                        INNER JOIN usuario_estudiante ue ON ins.cedula_estudiante = ue.cedula_usuario 
                        INNER JOIN usuario u ON ue.cedula_usuario = u.cedula 
                        LEFT JOIN evaluacion_realizada er ON e.id = er.id_evaluacion AND er.cedula_evaluado = ins.cedula_estudiante
                    WHERE pd.docente_cedula = ?
                    AND s.codigo_periodo = ?
                    GROUP BY ins.cedula_estudiante, e.id
                    ORDER BY e.fecha_evaluacion, er.fecha_evaluado DESC
                ) AS estudiante_x_materia
                GROUP BY estudiante_x_materia.cedula, estudiante_x_materia.codigo 
            ) AS estudiante
            GROUP BY estudiante.cedula 
            `;
            queryParams = esAdmin ? [periodo] : [docenteCedula, periodo] ;
        }

        return query(sqlQuery, queryParams);
    }

    static async getEstudianteByCedula(cedula) {
        const sqlQuery = `
            SELECT 
                cedula,
                    nombre,
                    apellido,
                    email,
                    fecha_nacimiento,
                    activo AS estudiante_activo,
                    carrera_codigo,
                    carrera_nombre,
                    duracion_semestres,
                    seccion,
                    total_evaluaciones,
                    ultima_evaluacion,
                    AVG(estudiante.puntaje_x_materia) AS promedio_puntaje
            FROM
                (
                SELECT 
                    cedula,
                    nombre,
                    apellido,
                    email,
                    fecha_nacimiento,
                    activo,
                    carrera_codigo,
                    carrera_nombre,
                    duracion_semestres,
                    seccion,
                    COUNT(estudiante_x_materia.id) AS total_evaluaciones, 
                    IFNULL(MAX(estudiante_x_materia.fecha_evaluado), 'Sin registros.') AS ultima_evaluacion,
                    SUM(COALESCE(puntaje_eval,0)) AS puntaje_x_materia
                FROM 
                        (		
                            SELECT 
                            u.cedula,
                            u.nombre,
                            u.apeliido AS apellido,
                            u.email,
                            u.fecha_nac AS fecha_nacimiento,
                            u.activo,
                            e.id,
                            ue.codigo_carrera AS carrera_codigo,
                            c.nombre AS carrera_nombre,
                            COUNT(DISTINCT num_semestre) AS duracion_semestres,
                            CONCAT(mp.codigo_materia, ' ', s.letra) AS seccion,
                            e.id as evaluacion_id,
                            e.contenido,
                            IFNULL(r.nombre_rubrica, 'Rubrica por crear...') AS nombre_rubrica,
                            m.nombre as materia,
                            m.codigo,
                            er.fecha_evaluado,
                            (SELECT 
                                SUM(COALESCE(de2.puntaje_obtenido * nd2.puntaje_maximo * cr2.puntaje_maximo * e.ponderacion / 1000000, 0))
                            FROM evaluacion_realizada er2
                            INNER JOIN detalle_evaluacion de2 ON er2.id = de2.evaluacion_r_id
                            INNER JOIN nivel_desempeno nd2 ON de2.id_criterio_detalle = nd2.criterio_id AND de2.orden_detalle = nd2.orden
                            INNER JOIN criterio_rubrica cr2 ON cr2.id = nd2.criterio_id
                            WHERE er2.id_evaluacion = e.id AND er2.cedula_evaluado = ins.cedula_estudiante
                            ) AS puntaje_eval
                        FROM 
                            evaluacion e 
                            INNER JOIN rubrica_uso ru ON e.id = ru.id_eval
                            INNER JOIN rubrica r ON ru.id_rubrica = r.id
                            INNER JOIN seccion s ON e.id_seccion = s.id
                            INNER JOIN permiso_docente pd ON s.id = pd.id_seccion 
                            INNER JOIN materia_pensum mp ON mp.id = s.id_materia_plan
                            INNER JOIN carrera c ON mp.codigo_carrera = c.codigo 
                            INNER JOIN materia m ON mp.codigo_materia = m.codigo
                            INNER JOIN inscripcion_seccion ins ON s.id = ins.id_seccion
                            INNER JOIN usuario_estudiante ue ON ins.cedula_estudiante = ue.cedula_usuario 
                            INNER JOIN usuario u ON ue.cedula_usuario = u.cedula 
                            LEFT JOIN evaluacion_realizada er ON e.id = er.id_evaluacion AND er.cedula_evaluado = ins.cedula_estudiante
                        WHERE ue.cedula_usuario = ?
                        GROUP BY ins.cedula_estudiante, e.id
                        ORDER BY e.fecha_evaluacion, er.fecha_evaluado DESC
                    ) AS estudiante_x_materia
                    GROUP BY estudiante_x_materia.cedula, estudiante_x_materia.codigo 
                ) AS estudiante
                GROUP BY estudiante.cedula 
        `;
        const result = await query(sqlQuery, [cedula]);
        return result.length > 0 ? result[0] : null;
    }
}

module.exports = TeacherEstudiantesModel;
