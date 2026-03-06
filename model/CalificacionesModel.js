const connection = require('./conexion');

class CalificacionesModel {
    async getCalificacionesByEstudiante(cedula) {
        const query = `
            SELECT 
                m.nombre AS materia_nombre,
                m.codigo AS materia_codigo,
                CONCAT(mp.codigo_carrera, '-', mp.codigo_materia, ' ', s.letra) AS seccion_codigo,
                e.codigo_periodo AS lapso_academico,
                r.id AS rubrica_id,
                r.nombre_rubrica,
                e.ponderacion AS porcentaje_evaluacion,
                SUM(DISTINCT de.puntaje_obtenido) AS puntaje_total,
                er.observaciones,
                er.fecha_evaluado AS fecha_evaluacion,
                (SELECT SUM(cr.puntaje_maximo) FROM criterio_rubrica cr WHERE cr.rubrica_id = r.id) AS puntaje_maximo_rubrica
            FROM 
                evaluacion e 
                INNER JOIN rubrica_uso ru ON e.id = ru.id_eval
                INNER JOIN rubrica r ON ru.id_rubrica = r.id
                INNER JOIN seccion s ON e.id_seccion = s.id
                INNER JOIN materia_pensum mp ON mp.id = s.id_materia_plan
                INNER JOIN materia m ON mp.codigo_materia = m.codigo
                INNER JOIN inscripcion_seccion ins ON s.id = ins.id_seccion
                LEFT JOIN evaluacion_realizada er ON e.id = er.id_evaluacion
                LEFT JOIN detalle_evaluacion de ON er.id = de.evaluacion_r_id
            WHERE ins.cedula_estudiante = ?
            GROUP BY
                m.codigo, r.id, e.codigo_periodo, s.letra, er.id
            ORDER BY 
                lapso_academico DESC, m.nombre, er.id
        `;

        return new Promise((resolve, reject) => {
            connection.query(query, [cedula], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
}

module.exports = new CalificacionesModel();
