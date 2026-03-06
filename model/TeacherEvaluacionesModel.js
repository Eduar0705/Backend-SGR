const conexion = require('./conexion');
const NotificacionModel = require('./NotificacionModel');

function query(sql, params = []) {
    return new Promise((resolve, reject) => {
        conexion.query(sql, params, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
}

class TeacherEvaluacionesModel {
    static async getTeacherEvaluaciones(docenteCedula, esAdmin) {
        let sqlQuery;
        let queryParams = [];

        if (esAdmin) {
            sqlQuery = `
                SELECT
                    er.id,
                    er.id_evaluacion,
                    (SELECT COALESCE(SUM(de2.puntaje_obtenido), 0)
                    FROM detalle_evaluacion de2
                    WHERE de2.evaluacion_r_id = er.id) as puntaje_total,
                    er.fecha_evaluado as fecha_evaluacion,
                    er.observaciones,
                    er.cedula_evaluado as estudiante_cedula,
                    u.nombre AS estudiante_nombre,
                    u.apeliido AS estudiante_apellido,
                    IFNULL(r.nombre_rubrica, 'Sin rúbrica') as nombre_rubrica,
                    IFNULL(tr.nombre, 'Pendiente') as tipo_evaluacion,
                    (SELECT SUM(cr2.puntaje_maximo)
                    FROM  criterio_rubrica cr2
                    WHERE cr2.rubrica_id = r.id) as porcentaje_evaluacion,
                    r.instrucciones,
                    e.competencias,
                    m.nombre as materia_nombre,
                    m.codigo as materia_codigo,
                    c.nombre AS carrera_nombre,
                    pp.codigo_periodo AS materia_semestre,
                    CONCAT(mp.codigo_carrera, '-', mp.codigo_materia, ' ', s.letra) AS seccion_codigo,
                    (SELECT GROUP_CONCAT(DISTINCT CONCAT(hs2.dia, ' (', hs2.hora_inicio, '-', hs2.hora_cierre, ')') SEPARATOR ', ')
                    FROM horario_seccion hs2
                    WHERE hs2.id_seccion = s.id) AS seccion_horario,
                    hs.aula AS seccion_aula,
                    CASE
                        WHEN er.id IS NOT NULL AND EXISTS (
                            SELECT 1 FROM detalle_evaluacion de3 
                            WHERE de3.evaluacion_r_id = er.id LIMIT 1
                        ) THEN 'Completada'
                        ELSE 'Pendiente'
                    END as estado
                FROM evaluacion e 
                LEFT JOIN rubrica_uso ru ON ru.id_eval = e.id
                LEFT JOIN rubrica r ON r.id = ru.id_rubrica
                LEFT JOIN tipo_rubrica tr ON r.id_tipo = tr.id
                INNER JOIN seccion s ON e.id_seccion = s.id
                INNER JOIN permiso_docente pd ON s.id = pd.id_seccion
                INNER JOIN materia_pensum mp ON s.id_materia_plan = mp.id
                INNER JOIN pensum pen ON mp.id_pensum = pen.id
                INNER JOIN pensum_periodo pp ON pen.id = pp.id_pensum
                INNER JOIN materia m ON mp.codigo_materia = m.codigo
                INNER JOIN carrera c ON mp.codigo_carrera = c.codigo
                LEFT JOIN evaluacion_realizada er ON e.id = er.id_evaluacion
                LEFT JOIN horario_seccion hs ON s.id = hs.id_seccion
                LEFT JOIN usuario_estudiante ue ON er.cedula_evaluado = ue.cedula_usuario
                LEFT JOIN usuario u ON ue.cedula_usuario = u.cedula
                WHERE er.id IS NOT NULL
                GROUP BY er.id
                ORDER BY er.fecha_evaluado DESC;
            `;
        } else {
            sqlQuery = `
                SELECT
                    er.id,
                    s.id AS id_seccion,
                    er.id_evaluacion,
                    (SELECT COALESCE(SUM(de2.puntaje_obtenido), 0)
                    FROM detalle_evaluacion de2
                    WHERE de2.evaluacion_r_id = er.id) as puntaje_total,
                    er.fecha_evaluado as fecha_evaluacion,
                    er.observaciones,
                    er.cedula_evaluado as estudiante_cedula,
                    u.nombre AS estudiante_nombre,
                    u.apeliido AS estudiante_apellido,
                    IFNULL(r.nombre_rubrica, 'Sin rúbrica') as nombre_rubrica,
                    IFNULL(tr.nombre, 'Pendiente') as tipo_evaluacion,
                    (SELECT SUM(cr2.puntaje_maximo)
                    FROM criterio_rubrica cr2
                    WHERE cr2.rubrica_id = r.id) as porcentaje_evaluacion,
                    r.instrucciones,
                    e.competencias,
                    m.nombre as materia_nombre,
                    m.codigo as materia_codigo,
                    c.nombre AS carrera_nombre,
                    pp.codigo_periodo AS materia_semestre,
                    CONCAT(mp.codigo_carrera, '-', mp.codigo_materia, ' ', s.letra) AS seccion_codigo,
                    (SELECT GROUP_CONCAT(DISTINCT CONCAT(hs2.dia, ' (', hs2.hora_inicio, '-', hs2.hora_cierre, ')') SEPARATOR ', ')
                    FROM horario_seccion hs2
                    WHERE hs2.id_seccion = s.id) AS seccion_horario,
                    hs.aula AS seccion_aula,
                    CASE
                        WHEN er.id IS NOT NULL AND EXISTS (
                            SELECT 1 FROM detalle_evaluacion de3 
                            WHERE de3.evaluacion_r_id = er.id LIMIT 1
                        ) THEN 'Completada'
                        ELSE 'Pendiente'
                    END as estado
                FROM evaluacion e 
                LEFT JOIN rubrica_uso ru ON ru.id_eval = e.id
                LEFT JOIN rubrica r ON r.id = ru.id_rubrica
                LEFT JOIN tipo_rubrica tr ON r.id_tipo = tr.id
                INNER JOIN seccion s ON e.id_seccion = s.id
                INNER JOIN permiso_docente pd ON s.id = pd.id_seccion
                INNER JOIN materia_pensum mp ON s.id_materia_plan = mp.id
                INNER JOIN pensum pen ON mp.id_pensum = pen.id
                INNER JOIN pensum_periodo pp ON pen.id = pp.id_pensum
                INNER JOIN materia m ON mp.codigo_materia = m.codigo
                INNER JOIN carrera c ON mp.codigo_carrera = c.codigo
                LEFT JOIN evaluacion_realizada er ON e.id = er.id_evaluacion
                LEFT JOIN horario_seccion hs ON s.id = hs.id_seccion
                LEFT JOIN usuario_estudiante ue ON er.cedula_evaluado = ue.cedula_usuario
                LEFT JOIN usuario u ON ue.cedula_usuario = u.cedula
                WHERE pd.docente_cedula = ?
                AND er.id IS NOT NULL
                GROUP BY er.id
                ORDER BY er.fecha_evaluado DESC;
            `;
            queryParams = [docenteCedula];
        }

        const evaluaciones = await query(sqlQuery, queryParams);
        return evaluaciones.map(ev => {
            const iniciales = (ev.estudiante_nombre.charAt(0) + ev.estudiante_apellido.charAt(0)).toUpperCase();
            const fecha = ev.fecha_evaluacion ?
                new Date(ev.fecha_evaluacion).toISOString() : null;

            return {
                ...ev,
                iniciales,
                fecha_formateada: fecha ? new Date(fecha).toLocaleDateString('es-ES') : 'Pendiente',
                calificacion: ev.puntaje_total ?
                    `${parseFloat(ev.puntaje_total).toFixed(1)}/${ev.porcentaje_evaluacion} (${(parseFloat(ev.puntaje_total) / 5).toFixed(1)}/${ev.porcentaje_evaluacion/5})` :
                    '-/-'
            };
        });
    }

    static async getCarreras(docenteCedula) {
        // En el código original usa permisos. Como tenemos permiso_docente, ajustaremos la query a nuestro esquema
        const sqlQuery = `
            SELECT DISTINCT
                c.codigo,
                c.nombre,
                c.descripcion
            FROM permiso_docente pd
            INNER JOIN seccion s ON pd.id_seccion = s.id
            INNER JOIN materia_pensum mp ON s.id_materia_plan = mp.id 
            INNER JOIN materia m ON mp.codigo_materia = m.codigo
            INNER JOIN carrera c ON mp.codigo_carrera = c.codigo
            WHERE pd.docente_cedula = ?
            ORDER BY c.nombre
        `;
        return query(sqlQuery, [docenteCedula]);
    }

    static async getMaterias(carreraCodigo, docenteCedula) {
        const sqlQuery = `
            SELECT DISTINCT
                m.codigo,
                m.nombre,
                mp.num_semestre as semestre,
                mp.unidades_credito as creditos
            FROM permiso_docente pd
            INNER JOIN seccion s ON pd.id_seccion = s.id
            INNER JOIN materia_pensum mp ON s.id_materia_plan = mp.id 
            INNER JOIN materia m ON mp.codigo_materia = m.codigo
            INNER JOIN carrera c ON mp.codigo_carrera = c.codigo
            WHERE c.codigo = ?
              AND pd.docente_cedula = ?
            ORDER BY semestre, m.nombre
        `;
        return query(sqlQuery, [carreraCodigo, docenteCedula]);
    }

    static async getSecciones(materiaCodigo, docenteCedula) {
        const sqlQuery = `
            SELECT DISTINCT
                s.id,
                CONCAT(mp.codigo_carrera, '-', mp.codigo_materia, ' ', s.letra) AS codigo,
                (SELECT GROUP_CONCAT(DISTINCT CONCAT(hs2.dia, ' (', hs2.hora_inicio, '-', hs2.hora_cierre, ')') SEPARATOR ', ')
                 FROM horario_seccion hs2 WHERE hs2.id_seccion = s.id) AS horario,
                 (SELECT hs2.aula FROM horario_seccion hs2 WHERE hs2.id_seccion = s.id LIMIT 1) AS aula,
                s.capacidad_maxima
            FROM permiso_docente pd
            INNER JOIN seccion s ON pd.id_seccion = s.id
            INNER JOIN materia_pensum mp ON s.id_materia_plan = mp.id 
            INNER JOIN materia m ON mp.codigo_materia = m.codigo
            WHERE m.codigo = ?
              AND pd.docente_cedula = ?
            ORDER BY codigo
        `;
        return query(sqlQuery, [materiaCodigo, docenteCedula]);
    }

    static async getEstudiantes(seccionId, docenteCedula) {
        const sqlQuery = `
            SELECT 
                u.cedula,
                u.nombre,
                u.apeliido as apellido,
                u.email
            FROM inscripcion_seccion ins
            INNER JOIN seccion s ON ins.id_seccion = s.id
            INNER JOIN permiso_docente pd ON pd.id_seccion = s.id 
            INNER JOIN usuario_estudiante ue ON ins.cedula_estudiante = ue.cedula_usuario
            INNER JOIN usuario u ON ue.cedula_usuario = u.cedula
            WHERE ins.id_seccion = ? 
              AND u.activo = 1 
              AND ins.estado = 'Cursando'
              AND pd.docente_cedula = ?
            ORDER BY u.apeliido, u.nombre
        `;
        return query(sqlQuery, [seccionId, docenteCedula]);
    }

    static async getRubricasActivas(docenteCedula) {
        const sqlQuery = `
            SELECT DISTINCT
                r.id,
                r.nombre_rubrica,
                tr.nombre as tipo_evaluacion,
                (SELECT SUM(cr.puntaje_maximo) FROM criterio_rubrica cr WHERE cr.rubrica_id = r.id) as porcentaje_evaluacion,
                CASE WHEN e.cantidad_personas = 1 THEN 'Individual' ELSE 'Grupal' END as modalidad,
                e.cantidad_personas,
                s.id as seccion_id,
                m.nombre as materia_nombre,
                m.codigo as materia_codigo,
                CONCAT(mp.codigo_carrera, '-', mp.codigo_materia, ' ', s.letra) as seccion_codigo
            FROM rubrica r
            INNER JOIN tipo_rubrica tr ON r.id_tipo = tr.id
            INNER JOIN rubrica_uso ru ON r.id = ru.id_rubrica
            INNER JOIN evaluacion e ON ru.id_eval = e.id
            INNER JOIN seccion s ON e.id_seccion = s.id
            INNER JOIN materia_pensum mp ON s.id_materia_plan = mp.id
            INNER JOIN materia m ON mp.codigo_materia = m.codigo
            INNER JOIN permiso_docente pd ON pd.id_seccion = s.id 
            WHERE r.activo = 1
              AND pd.docente_cedula = ?
            ORDER BY r.nombre_rubrica
        `;
        return query(sqlQuery, [docenteCedula]);
    }

    static async createEvaluaciones(rubrica_id, estudiantes, observaciones, docenteCedula) {
        // Verificar si la rubrica pertenece a un seccion vinculada al docente
        const verifyQ = `
            SELECT ru.id_eval
            FROM rubrica r
            INNER JOIN rubrica_uso ru ON r.id = ru.id_rubrica
            INNER JOIN evaluacion e ON ru.id_eval = e.id
            INNER JOIN permiso_docente pd ON pd.id_seccion = e.id_seccion
            WHERE r.id = ? 
              AND r.activo = 1
              AND pd.docente_cedula = ?
        `;
        const resVerify = await query(verifyQ, [rubrica_id, docenteCedula]);
        if (resVerify.length === 0) {
            throw new Error('La rúbrica no existe o no tienes permisos para usarla');
        }

        const id_evaluacion = resVerify[0].id_eval;

        // Verificar evaluados duplicados
        const checkDupe = `
            SELECT cedula_evaluado 
            FROM evaluacion_realizada 
            WHERE id_evaluacion = ? AND cedula_evaluado IN (?)
        `;
        const dupes = await query(checkDupe, [id_evaluacion, estudiantes]);
        if (dupes.length > 0) {
            throw new Error('Ya existen evaluaciones para algunas cédulas: ' + dupes.map(d => d.cedula_evaluado).join(', '));
        }

        // Insertar evaluaciones
        const values = estudiantes.map(cedula => [
            id_evaluacion,
            cedula,
            docenteCedula, // cedula_evaluador
            observaciones || null
        ]);

        const insertQ = `
            INSERT INTO evaluacion_realizada (id_evaluacion, cedula_evaluado, cedula_evaluador, observaciones)
            VALUES ?
        `;
        return query(insertQ, [values]);
    }

    static async getEvaluacionDetalles(evaluacionId, estudianteCedula) {
        // Evaluacion details directly
        const evalSQL = `
            SELECT
                er.id,
                er.id_evaluacion,
                r.id as rubrica_id,
                er.cedula_evaluado as estudiante_cedula,
                er.observaciones,
                (SELECT COALESCE(SUM(de2.puntaje_obtenido), 0)
                FROM detalle_evaluacion de2
                WHERE de2.evaluacion_r_id = er.id) as puntaje_total,
                er.fecha_evaluado as fecha_evaluacion,
                r.nombre_rubrica,
                GROUP_CONCAT(DISTINCT eeval.nombre SEPARATOR ', ') AS tipo_evaluacion,
                tr.nombre as tipo_rubrica,
                (SELECT SUM(cr.puntaje_maximo) FROM criterio_rubrica cr WHERE cr.rubrica_id = r.id) as porcentaje_evaluacion,
                r.instrucciones,
                e.competencias,
                m.nombre as materia_nombre,
                m.codigo as materia_codigo,
                CONCAT(ud.nombre, ' ', ud.apeliido) as profesor
            FROM evaluacion e
            INNER JOIN rubrica_uso ru ON ru.id_eval = e.id
            INNER JOIN rubrica r ON r.id = ru.id_rubrica
            INNER JOIN tipo_rubrica tr ON r.id_tipo = tr.id
            INNER JOIN seccion s ON e.id_seccion = s.id
            INNER JOIN materia_pensum mp ON s.id_materia_plan = mp.id
            INNER JOIN materia m ON mp.codigo_materia = m.codigo
            LEFT JOIN evaluacion_realizada er ON e.id = er.id_evaluacion
            LEFT JOIN usuario ud ON ud.cedula = er.cedula_evaluador
            LEFT JOIN estrategia_empleada eemp ON er.id_evaluacion = eemp.id_eval
            LEFT JOIN estrategia_eval eeval ON eemp.id_estrategia = eeval.id
            WHERE er.cedula_evaluado = ? AND er.id_evaluacion = ?
            GROUP BY e.id
            ORDER BY er.fecha_evaluado DESC;
        `;
        const evalData = await query(evalSQL, [estudianteCedula, evaluacionId]);
        if (evalData.length === 0) throw new Error('Evaluación no encontrada');
        const evaluacion = evalData[0];

        const estSQL = `
            SELECT 
                u.cedula,
                u.nombre,
                u.apeliido as apellido,
                u.email,
                c.nombre AS carrera
            FROM usuario u
            INNER JOIN usuario_estudiante ue ON u.cedula = ue.cedula_usuario
            INNER JOIN carrera c ON ue.codigo_carrera = c.codigo
            WHERE u.cedula = ?
        `;
        const estData = await query(estSQL, [estudianteCedula]);
        const estudiante = estData[0];

        // Criterios 
        const criteriosSQL = `
            SELECT id, descripcion as nombre, descripcion, puntaje_maximo, orden
            FROM criterio_rubrica
            WHERE rubrica_id = ?
            ORDER BY orden
        `;
        const criterios = await query(criteriosSQL, [evaluacion.rubrica_id]);
        const criteriosIds = criterios.map(c => c.id);

        let niveles = [];
        if (criteriosIds.length > 0) {
            const nivelesSQL = `
                SELECT
                    criterio_id, nombre_nivel as nombre,
                    descripcion, puntaje_maximo AS puntaje, orden as id
                FROM nivel_desempeno
                WHERE criterio_id IN (?)
                ORDER BY criterio_id, orden
            `;
            niveles = await query(nivelesSQL, [criteriosIds]);
        }

        const detallesSQL = `
            SELECT de.id_criterio_detalle, de.orden_detalle AS nivel_seleccionado, de.puntaje_obtenido
            FROM detalle_evaluacion de 
            INNER JOIN evaluacion_realizada er ON de.evaluacion_r_id = er.id
            WHERE er.id = ? 
        `;
        const detallesData = await query(detallesSQL, [evaluacion.id]);
        const detallesMap = {};
        detallesData.forEach(d => {
            detallesMap[d.id_criterio_detalle] = {
                nivel_seleccionado: d.nivel_seleccionado,
                puntaje_obtenido: d.puntaje_obtenido
            };
        });

        const criteriosFinal = criterios.map(c => {
            const nivelesCriterio = niveles
                .filter(n => n.criterio_id === c.id)
                .map(n => ({
                    id: n.id,
                    nombre: n.nombre,
                    descripcion: n.descripcion,
                    puntaje: detallesMap[c.id]?.nivel_seleccionado === n.id ? detallesMap[c.id]?.puntaje_obtenido : n.puntaje,
                    puntaje_maximo: n.puntaje,
                    seleccionado: detallesMap[c.id]?.nivel_seleccionado === n.id
                }));
            return {
                id: c.id,
                nombre: c.nombre,
                descripcion: c.descripcion,
                puntaje_maximo: c.puntaje_maximo,
                niveles: nivelesCriterio
            };
        });

        return {
            evaluacion,
            estudiante,
            rubrica: {
                nombre_rubrica: evaluacion.nombre_rubrica,
                tipo_evaluacion: evaluacion.tipo_evaluacion,
                porcentaje_evaluacion: evaluacion.porcentaje_evaluacion,
                instrucciones: evaluacion.instrucciones,
                competencias: evaluacion.competencias,
                materia: evaluacion.materia_nombre,
                materia_codigo: evaluacion.materia_codigo
            },
            criterios: criteriosFinal
        };
    }

    static async saveEvaluacion(evaluacionId, estudianteCedula, payload) {
        // En este paso de guardar validamos la evaluacion_realizada, la actualizamos y añadimos detalles
        const q_er = `SELECT id FROM evaluacion_realizada WHERE id_evaluacion = ? AND cedula_evaluado = ?`;
        const rows = await query(q_er, [evaluacionId, estudianteCedula]);
        if(rows.length === 0) throw new Error("No se encontró el registro de evaluación para calificar.");
        const er_id = rows[0].id;
        
        // delete exist details 
        await query(`DELETE FROM detalle_evaluacion WHERE evaluacion_r_id = ?`, [er_id]);

        // insert detail
        if (payload.detalles && payload.detalles.length > 0) {
            const values = payload.detalles.map(d => [er_id, d.criterio_id, d.nivel_id, d.puntaje_obtenido, null /* observaciones */]);
            await query(`INSERT INTO detalle_evaluacion (evaluacion_r_id, id_criterio_detalle, orden_detalle, puntaje_obtenido, observaciones) VALUES ?`, [values]);
        }

        // update evaluacion_realizada fecha and observ
        await query(`UPDATE evaluacion_realizada SET fecha_evaluado = NOW(), observaciones = ? WHERE id = ?`, [payload.observaciones || '', er_id]);

        // Notificar al estudiante que ha sido evaluado
        try {
            const [evalInfo] = await query(`
                SELECT r.nombre_rubrica, m.nombre as materia_nombre
                FROM evaluacion_realizada er
                INNER JOIN evaluacion e ON er.id_evaluacion = e.id
                INNER JOIN seccion s ON e.id_seccion = s.id
                INNER JOIN materia_pensum mp ON s.id_materia_plan = mp.id
                INNER JOIN materia m ON mp.codigo_materia = m.codigo
                INNER JOIN rubrica_uso ru ON e.id = ru.id_eval
                INNER JOIN rubrica r ON ru.id_rubrica = r.id
                WHERE er.id = ?
            `, [er_id]);

            if (evalInfo) {
                await NotificacionModel.create({
                    usuario_destino: estudianteCedula,
                    mensaje: `Tu evaluación en la materia "${evalInfo.materia_nombre}" ha sido corregida (Rúbrica: ${evalInfo.nombre_rubrica}).`,
                    id_rubrica: null // Opcional: podrías pasar el ID de la rúbrica si quieres linkear
                });
            }
        } catch (notifErr) {
            console.error('Error al crear notificación de evaluación:', notifErr);
        }

        return { er_id };
    }
}

module.exports = TeacherEvaluacionesModel;
