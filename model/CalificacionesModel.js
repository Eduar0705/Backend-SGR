const connection = require('./conexion');

class CalificacionesModel {
    async getCalificacionesByEstudiante(cedula) {
        const query = `
            SELECT 
                m.nombre AS materia_nombre,
                m.codigo AS materia_codigo,
                s.letra AS seccion_codigo,
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
                INNER JOIN materia m ON mp.codigo_materia = m.codigo
                INNER JOIN inscripcion_seccion ins ON s.id = ins.id_seccion
                LEFT JOIN evaluacion_realizada er ON e.id = er.id_evaluacion AND er.cedula_evaluado = ins.cedula_estudiante
                LEFT JOIN detalle_evaluacion de ON er.id = de.evaluacion_r_id
                LEFT JOIN nivel_desempeno nd ON de.id_criterio_detalle = nd.criterio_id  AND de.orden_detalle = nd.orden 
                		AND cr.id = nd.criterio_id 
            WHERE ins.cedula_estudiante = ?
            GROUP BY
                m.codigo, r.id, s.codigo_periodo, s.letra, er.id
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
