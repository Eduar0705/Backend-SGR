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
    static async getEstudiantes(docenteCedula, esAdmin) {
        let sqlQuery;
        let queryParams = [];

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
            promedio_puntaje,
            ultima_evaluacion
    FROM
    (           SELECT
                    ins.cedula_estudiante AS cedula,
                    u.nombre AS nombre,
                    u.apeliido AS apellido,
                    u.email,
                    u.fecha_creacion AS fecha_nacimiento,
                    u.activo,
                    ue.codigo_carrera AS carrera_codigo,
                    c.nombre AS carrera_nombre,
                    COUNT(DISTINCT num_semestre) AS duracion_semestres,
                    CONCAT(mp.codigo_carrera, '-', mp.codigo_materia, ' ', s.letra) AS seccion,
                    COUNT(e.id) AS total_evaluaciones, 
                    ROUND(AVG(COALESCE(de.puntaje_obtenido,0))/5,2) AS promedio_puntaje,
                    IFNULL(MAX(er.fecha_evaluado), 'Sin registros.') AS ultima_evaluacion
                FROM evaluacion e
                INNER JOIN seccion s ON e.id_seccion = s.id
                INNER JOIN materia_pensum mp ON s.id_materia_plan = mp.id
                INNER JOIN materia m ON mp.codigo_materia = m.codigo
                INNER JOIN inscripcion_seccion ins ON s.id = ins.id_seccion
                INNER JOIN usuario_estudiante ue ON ue.cedula_usuario = ins.cedula_estudiante
                INNER JOIN carrera c ON ue.codigo_carrera = c.codigo
                INNER JOIN usuario u ON ue.cedula_usuario = u.cedula AND u.activo = 1
                LEFT JOIN evaluacion_realizada er ON e.id = er.id_evaluacion AND u.cedula = er.cedula_evaluado
                LEFT JOIN detalle_evaluacion de ON er.id = de.evaluacion_r_id
                GROUP BY ins.cedula_estudiante, ins.id_seccion
                ORDER BY promedio_puntaje DESC
    ) AS subquery;
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
            promedio_puntaje,
            ultima_evaluacion
    FROM
    (           SELECT
                    ins.cedula_estudiante AS cedula,
                    u.nombre AS nombre,
                    u.apeliido AS apellido,
                    u.email,
                    u.fecha_creacion AS fecha_nacimiento,
                    u.activo,
                    ue.codigo_carrera AS carrera_codigo,
                    c.nombre AS carrera_nombre,
                    COUNT(DISTINCT num_semestre) AS duracion_semestres,
                    CONCAT(mp.codigo_carrera, '-', mp.codigo_materia, ' ', s.letra) AS seccion,
                    COUNT(e.id) AS total_evaluaciones, 
                    ROUND(AVG(COALESCE(de.puntaje_obtenido,0))/5,2) AS promedio_puntaje,
                    IFNULL(MAX(er.fecha_evaluado), 'Sin registros.') AS ultima_evaluacion
                FROM evaluacion e
                INNER JOIN seccion s ON e.id_seccion = s.id
                INNER JOIN materia_pensum mp ON s.id_materia_plan = mp.id
                INNER JOIN materia m ON mp.codigo_materia = m.codigo
                INNER JOIN permiso_docente pd ON s.id = pd.id_seccion
                INNER JOIN inscripcion_seccion ins ON pd.id_seccion = ins.id_seccion
                INNER JOIN usuario_estudiante ue ON ue.cedula_usuario = ins.cedula_estudiante
                INNER JOIN carrera c ON ue.codigo_carrera = c.codigo
                INNER JOIN usuario u ON ue.cedula_usuario = u.cedula AND u.activo = 1
                LEFT JOIN evaluacion_realizada er ON e.id = er.id_evaluacion AND u.cedula = er.cedula_evaluado
                LEFT JOIN detalle_evaluacion de ON er.id = de.evaluacion_r_id
                WHERE pd.docente_cedula = ?
                GROUP BY ins.cedula_estudiante, ins.id_seccion
                ORDER BY promedio_puntaje DESC
     ) AS subquery;
            `;
            queryParams = [docenteCedula];
        }

        return query(sqlQuery, queryParams);
    }

    static async getEstudianteByCedula(cedula) {
        const sqlQuery = `
            SELECT
                    ins.cedula_estudiante AS cedula,
                    u.nombre AS nombre,
                    u.apeliido AS apellido,
                    u.email,
                    u.fecha_creacion AS fecha_nacimiento,
                    u.activo AS estudiante_activo,
                    ue.codigo_carrera AS carrera_codigo,
                    c.nombre AS carrera_nombre,
                    COUNT(DISTINCT num_semestre) AS duracion_semestres,
                    CONCAT(mp.codigo_carrera, '-', mp.codigo_materia, ' ', s.letra) AS seccion,
                    COUNT(e.id) AS total_evaluaciones, 
                    ROUND(AVG(COALESCE(de.puntaje_obtenido,0))/5,2) AS promedio_puntaje,
                    IFNULL(MAX(er.fecha_evaluado), 'Sin registros.') AS ultima_evaluacion
           FROM evaluacion e
                INNER JOIN seccion s ON e.id_seccion = s.id
                INNER JOIN materia_pensum mp ON s.id_materia_plan = mp.id
                INNER JOIN inscripcion_seccion ins ON s.id = ins.id_seccion
                INNER JOIN usuario_estudiante ue ON ue.cedula_usuario = ins.cedula_estudiante
                INNER JOIN carrera c ON ue.codigo_carrera = c.codigo
                INNER JOIN usuario u ON ue.cedula_usuario = u.cedula AND u.activo = 1
                LEFT JOIN evaluacion_realizada er ON e.id = er.id_evaluacion
                LEFT JOIN detalle_evaluacion de ON er.id = de.evaluacion_r_id AND u.cedula = er.cedula_evaluado
            WHERE u.cedula = ?
            GROUP BY
                cedula, nombre, apellido, carrera_codigo;
        `;
        const result = await query(sqlQuery, [cedula]);
        return result.length > 0 ? result[0] : null;
    }
}

module.exports = TeacherEstudiantesModel;
