const connection = require('./conexion');
// R E V I S A R
class StudentEvaluacionesModel {
    async getEvaluacionesByEstudiante(cedula) {
        const query = `
            SELECT 
                e.id as evaluacion_id,
                e.contenido,
                IFNULL(r.nombre_rubrica, 'Rubrica por crear...') AS nombre_rubrica,
                m.nombre as materia,
                (SELECT 
                    SUM(COALESCE(de2.puntaje_obtenido * nd2.puntaje_maximo * cr2.puntaje_maximo * e.ponderacion / 1000000, 0))
                FROM evaluacion_realizada er2
                INNER JOIN detalle_evaluacion de2 ON er2.id = de2.evaluacion_r_id
                INNER JOIN nivel_desempeno nd2 ON de2.id_criterio_detalle = nd2.criterio_id AND de2.orden_detalle = nd2.orden
                INNER JOIN criterio_rubrica cr2 ON cr2.id = nd2.criterio_id
                WHERE er2.id_evaluacion = e.id AND er2.cedula_evaluado = ins.cedula_estudiante
                ) AS puntaje_total,
                er.fecha_evaluado as fecha_evaluacion,
                GROUP_CONCAT(DISTINCT eeval.nombre SEPARATOR ', ') AS tipo_evaluacion,
                e.ponderacion as porcentaje_evaluacion,
                er.observaciones,
                (SELECT 
                    CONCAT(u.nombre, ' ', u.apeliido)
                FROM permiso_docente pd2
                INNER JOIN usuario u ON pd2.docente_cedula = u.cedula
                WHERE pd2.id_seccion = s.id
                LIMIT 1
                ) as profesor
            FROM 
                evaluacion e 
                INNER JOIN rubrica_uso ru ON e.id = ru.id_eval
                INNER JOIN rubrica r ON ru.id_rubrica = r.id
                INNER JOIN seccion s ON e.id_seccion = s.id
                INNER JOIN materia_pensum mp ON mp.id = s.id_materia_plan
                INNER JOIN materia m ON mp.codigo_materia = m.codigo
                INNER JOIN inscripcion_seccion ins ON s.id = ins.id_seccion
                LEFT JOIN evaluacion_realizada er ON e.id = er.id_evaluacion AND er.cedula_evaluado = ins.cedula_estudiante
                LEFT JOIN estrategia_empleada eemp ON e.id = eemp.id_eval 
                LEFT JOIN estrategia_eval eeval ON eemp.id_estrategia = eeval.id
                LEFT JOIN usuario ud ON ud.cedula = er.cedula_evaluador
            WHERE ins.cedula_estudiante = ?
            GROUP BY e.id, er.id
            ORDER BY e.fecha_evaluacion, er.fecha_evaluado DESC;
        `;
        return new Promise((resolve, reject) => {
            connection.query(query, [cedula], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    async getDetalleEvaluacion(evaluacionId, estudianteCedula) {
        // 1. Info evaluación
        const queryEvaluacion = `
            SELECT 
                e.id AS evaluacion_id,
                e.contenido,
                IFNULL(r.nombre_rubrica, 'Rubrica por crear...') AS nombre_rubrica,
                m.nombre AS materia,
                COALESCE(puntaje_sub.puntaje, 0) AS puntaje_total,   -- ← valor único por er.id
                er.fecha_evaluado AS fecha_evaluacion,
                GROUP_CONCAT(DISTINCT eeval.nombre SEPARATOR ', ') AS tipo_evaluacion,
                e.ponderacion AS porcentaje_evaluacion,
                er.observaciones,
                IFNULL(CONCAT(ud.nombre, ' ', ud.apeliido), CONCAT(prof_sec.nombre, ' ', prof_sec.apeliido)) AS profesor
            FROM evaluacion e 
            INNER JOIN rubrica_uso ru ON e.id = ru.id_eval
            INNER JOIN rubrica r ON ru.id_rubrica = r.id
            INNER JOIN seccion s ON e.id_seccion = s.id
            INNER JOIN materia_pensum mp ON mp.id = s.id_materia_plan
            INNER JOIN materia m ON mp.codigo_materia = m.codigo
            INNER JOIN inscripcion_seccion ins ON s.id = ins.id_seccion
            INNER JOIN permiso_docente pd ON ins.id_seccion = pd.id_seccion
            INNER JOIN usuario prof_sec ON pd.docente_cedula = prof_sec.cedula
            LEFT JOIN evaluacion_realizada er ON e.id = er.id_evaluacion AND er.cedula_evaluado = ins.cedula_estudiante
            LEFT JOIN usuario ud ON ud.cedula = er.cedula_evaluador
            LEFT JOIN estrategia_empleada eemp ON e.id = eemp.id_eval
            LEFT JOIN estrategia_eval eeval ON eemp.id_estrategia = eeval.id
            LEFT JOIN (
                SELECT 
                    er.id AS er_id,
                    SUM(de.puntaje_obtenido * nd.puntaje_maximo * cr.puntaje_maximo * e2.ponderacion / 1000000) AS puntaje
                FROM evaluacion_realizada er
                INNER JOIN evaluacion e2 ON er.id_evaluacion = e2.id
                INNER JOIN detalle_evaluacion de ON er.id = de.evaluacion_r_id
                INNER JOIN nivel_desempeno nd ON de.id_criterio_detalle = nd.criterio_id AND de.orden_detalle = nd.orden
                INNER JOIN criterio_rubrica cr ON nd.criterio_id = cr.id
                WHERE er.cedula_evaluado = ?
                GROUP BY er.id
            ) puntaje_sub ON puntaje_sub.er_id = er.id
            WHERE ins.cedula_estudiante = ?
            AND e.id = ?
            GROUP BY e.id, er.id
            ORDER BY e.fecha_evaluacion, er.fecha_evaluado DESC;
        `;

        const evaluacionResult = await new Promise((resolve, reject) => {
            connection.query(queryEvaluacion, [estudianteCedula, estudianteCedula,  evaluacionId], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        if (evaluacionResult.length === 0) {
            return { success: false, holdup: true, message: 'Evaluación no encontrada' };
        }

        const evaluacion = evaluacionResult[0];

        // 2. Info estudiante
        const queryEstudiante = `
            SELECT u.cedula, u.nombre, u.apeliido as apellido, u.email, c.nombre AS carrera
            FROM usuario u
            INNER JOIN usuario_estudiante ue ON u.cedula = ue.cedula_usuario
            INNER JOIN carrera c ON ue.codigo_carrera = c.codigo
            WHERE u.cedula = ?
        `;
        const estudianteResult = await new Promise((resolve, reject) => {
            connection.query(queryEstudiante, [estudianteCedula], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        if (estudianteResult.length === 0) {
            return { success: false, message: 'Estudiante no encontrado' };
        }

        const estudiante = estudianteResult[0];

        // 3. Criterios
        const queryCriterios = `
            SELECT id, descripcion, puntaje_maximo, orden
            FROM criterio_rubrica WHERE rubrica_id = ? ORDER BY orden
        `;
        const criteriosResult = await new Promise((resolve, reject) => {
            connection.query(queryCriterios, [evaluacion.rubrica_id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        const criteriosIds = criteriosResult.map(c => c.id);
        if (criteriosIds.length === 0) {
            return { success: false, holdup: true, message: 'No hay criterios de evaluación configurados' };
        }

        // 4. Niveles de desempeño
        const queryNiveles = `
            SELECT criterio_id, nombre_nivel, descripcion, puntaje_maximo AS puntaje, orden
            FROM nivel_desempeno WHERE criterio_id IN (?) ORDER BY criterio_id, orden
        `;
        const nivelesResult = await new Promise((resolve, reject) => {
            connection.query(queryNiveles, [criteriosIds], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        if (nivelesResult.length === 0) {
            return { success: false, holdup: true, message: 'Evaluación no encontrada' };
        }

        // 5. Detalles de evaluación (niveles seleccionados)
        const queryDetalles = `
            SELECT 
                de.id_criterio_detalle, 
                de.orden_detalle AS nivel_seleccionado, 
                (de.puntaje_obtenido * nd.puntaje_maximo * cr.puntaje_maximo * e.ponderacion / 1000000) AS puntaje_obtenido
                        FROM detalle_evaluacion de 
                        INNER JOIN nivel_desempeno nd ON de.id_criterio_detalle = nd.criterio_id AND de.orden_detalle = nd.orden 
                        INNER JOIN criterio_rubrica cr ON nd.criterio_id = cr.id 
                        INNER JOIN evaluacion_realizada er ON de.evaluacion_r_id = er.id
                        INNER JOIN evaluacion e ON er.id_evaluacion = e.id
                        INNER JOIN rubrica_uso ru ON e.id = ru.id_eval 
                        INNER JOIN rubrica r ON ru.id_rubrica  = r.id AND r.id = cr.rubrica_id 
                        WHERE e.id = 42 AND er.cedula_evaluado = ?
                        GROUP BY de.id_criterio_detalle, de.orden_detalle 
        `;
        const detallesResult = await new Promise((resolve, reject) => {
            connection.query(queryDetalles, [evaluacionId, estudianteCedula], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        if (detallesResult.length === 0) {
            return { success: false, no_evaluada: true, message: 'No has sido evaluado aún' };
        }

        // Mapa de detalles por criterio
        const detallesMap = {};
        detallesResult.forEach(d => {
            detallesMap[d.id_criterio_detalle] = { nivel_seleccionado: d.nivel_seleccionado, puntaje_obtenido: d.puntaje_obtenido };
        });

        // Agrupar niveles por criterio
        const criteriosConNiveles = criteriosResult.map(criterio => {
            const niveles = nivelesResult
                .filter(n => n.criterio_id === criterio.id)
                .map(nivel => ({
                    id: nivel.orden,
                    nombre: nivel.nombre_nivel,
                    descripcion: nivel.descripcion,
                    puntaje: detallesMap[criterio.id] && detallesMap[criterio.id].nivel_seleccionado === nivel.orden
                        ? detallesMap[criterio.id].puntaje_obtenido : nivel.puntaje,
                    puntaje_maximo: nivel.puntaje,
                    orden: nivel.orden,
                    seleccionado: detallesMap[criterio.id] ? detallesMap[criterio.id].nivel_seleccionado === nivel.orden : false
                }));

            return {
                id: criterio.id,
                nombre: criterio.descripcion,
                puntaje_maximo: criterio.puntaje_maximo,
                orden: criterio.orden,
                niveles
            };
        });

        return {
            success: true,
            evaluacion: {
                id: evaluacion.id,
                rubrica_id: evaluacion.rubrica_id,
                observaciones: evaluacion.observaciones,
                puntaje_total: evaluacion.puntaje_total,
                fecha_evaluacion: evaluacion.fecha_evaluacion
            },
            estudiante: {
                cedula: estudiante.cedula,
                nombre: estudiante.nombre,
                apellido: estudiante.apellido,
                email: estudiante.email,
                carrera: estudiante.carrera
            },
            rubrica: {
                nombre_rubrica: evaluacion.nombre_rubrica,
                tipo_evaluacion: evaluacion.tipo_evaluacion,
                porcentaje_evaluacion: evaluacion.porcentaje_evaluacion,
                instrucciones: evaluacion.instrucciones,
                competencias: evaluacion.competencias,
                materia: evaluacion.materia_nombre,
                materia_codigo: evaluacion.materia_codigo
            },
            criterios: criteriosConNiveles
        };
    }
}

module.exports = new StudentEvaluacionesModel();
