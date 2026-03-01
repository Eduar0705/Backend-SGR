const connection = require('./conexion');

class StudentEvaluacionesModel {
    async getEvaluacionesByEstudiante(cedula) {
        const query = `
            SELECT
                e.id as evaluacion_id,
                IFNULL(r.nombre_rubrica, 'Rubrica por crear...') AS nombre_rubrica,
                m.nombre as materia,
                COALESCE(SUM(DISTINCT de.puntaje_obtenido), 0) as puntaje_total,
                er.fecha_evaluado as fecha_evaluacion,
                GROUP_CONCAT(DISTINCT eeval.nombre SEPARATOR ', ') AS tipo_evaluacion,
                e.ponderacion as porcentaje_evaluacion,
                er.observaciones,
                IFNULL(CONCAT(ud.nombre, ' ', ud.apeliido), CONCAT(prof_sec.nombre, ' ', prof_sec.apeliido)) as profesor
            FROM evaluacion e
            INNER JOIN seccion s ON e.id_seccion = s.id
            INNER JOIN inscripcion_seccion ins ON ins.id_seccion = s.id
            INNER JOIN permiso_docente pd ON ins.id_seccion = pd.id_seccion
            INNER JOIN usuario prof_sec ON pd.docente_cedula = prof_sec.cedula
            INNER JOIN plan_periodo pp ON s.id_materia_plan = pp.id
            INNER JOIN materia m ON pp.codigo_materia = m.codigo
            LEFT JOIN evaluacion_realizada er ON er.id_evaluacion = e.id
            LEFT JOIN detalle_evaluacion de ON de.evaluacion_r_id = er.id  
            LEFT JOIN estrategia_empleada eemp ON e.id = eemp.id_eval
            LEFT JOIN estrategia_eval eeval ON eemp.id_eval = eeval.id
            LEFT JOIN usuario ud ON ud.cedula = er.cedula_evaluador
            LEFT JOIN rubrica_uso ru ON ru.id_eval = e.id
            LEFT JOIN rubrica r ON r.id = ru.id_rubrica
            LEFT JOIN tipo_rubrica tr ON r.id_tipo = tr.id
            LEFT JOIN criterio_rubrica cr ON cr.rubrica_id = r.id
            WHERE er.cedula_evaluado = ?
            GROUP BY e.id
            ORDER BY e.fecha_evaluacion, er.fecha_evaluado DESC
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
                er.id,
                r.id as rubrica_id,
                er.cedula_evaluado,
                er.observaciones,
                SUM(DISTINCT de.puntaje_obtenido) as puntaje_total,
                er.fecha_evaluado as fecha_evaluacion,
                r.nombre_rubrica,
                GROUP_CONCAT(DISTINCT eeval.nombre SEPARATOR ', ') AS tipo_evaluacion,
                e.ponderacion as porcentaje_evaluacion,
                r.instrucciones,
                e.competencias,
                m.nombre as materia_nombre,
                m.codigo as materia_codigo,
                CONCAT(ud.nombre, ' ', ud.apeliido) as profesor
            FROM evaluacion e
            INNER JOIN seccion s ON e.id_seccion = s.id
            INNER JOIN inscripcion_seccion ins ON ins.id_seccion = s.id
            INNER JOIN permiso_docente pd ON ins.id_seccion = pd.id_seccion
            INNER JOIN usuario prof_sec ON pd.docente_cedula = prof_sec.cedula
            INNER JOIN plan_periodo pp ON s.id_materia_plan = pp.id
            INNER JOIN materia m ON pp.codigo_materia = m.codigo
            LEFT JOIN evaluacion_realizada er ON er.id_evaluacion = e.id
            LEFT JOIN detalle_evaluacion de ON de.evaluacion_r_id = er.id  
            LEFT JOIN estrategia_empleada eemp ON e.id = eemp.id_eval
            LEFT JOIN estrategia_eval eeval ON eemp.id_eval = eeval.id
            LEFT JOIN usuario ud ON ud.cedula = er.cedula_evaluador
            LEFT JOIN rubrica_uso ru ON ru.id_eval = e.id
            LEFT JOIN rubrica r ON r.id = ru.id_rubrica
            LEFT JOIN tipo_rubrica tr ON r.id_tipo = tr.id
            LEFT JOIN criterio_rubrica cr ON cr.rubrica_id = r.id
            WHERE ins.cedula_estudiante = ? AND e.id = ?
            GROUP BY e.id
            ORDER BY er.fecha_evaluado DESC
        `;

        const evaluacionResult = await new Promise((resolve, reject) => {
            connection.query(queryEvaluacion, [estudianteCedula, evaluacionId], (err, results) => {
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
            SELECT de.id_criterio_detalle, de.orden_detalle AS nivel_seleccionado, de.puntaje_obtenido
            FROM detalle_evaluacion de 
            INNER JOIN evaluacion_realizada er ON de.evaluacion_r_id = er.id
            INNER JOIN evaluacion e ON er.id_evaluacion = e.id
            WHERE e.id = ? AND er.cedula_evaluado = ?
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
