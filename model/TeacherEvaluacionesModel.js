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
    static async getAllTeacherEvaluaciones(docenteCedula, esAdmin, periodo) {
        let sqlQuery;
        console.log(periodo); periodo = "2025-1"
        let queryParams = [];

        if (esAdmin) {
            sqlQuery = `
                SELECT
                    er.id,
                    s.id AS id_seccion,
                    e.id AS id_evaluacion,
                    e.contenido,
                    (SELECT COALESCE(SUM(de2.puntaje_obtenido), 0)
                    FROM detalle_evaluacion de2
                    WHERE de2.evaluacion_r_id = er.id) as puntaje_total,
                    e.fecha_evaluacion AS fecha_fija,
                    er.fecha_evaluado as fecha_evaluacion,
                    er.observaciones,
                    ins.cedula_estudiante as estudiante_cedula,
                    u.nombre AS estudiante_nombre,
                    u.apeliido AS estudiante_apellido,
                    r.nombre_rubrica as nombre_rubrica,
                    tr.nombre as tipo_evaluacion,
                    IFNULL((SELECT SUM(cr2.puntaje_maximo)
                    FROM criterio_rubrica cr2
                    WHERE cr2.rubrica_id = r.id), e.ponderacion) as porcentaje_evaluacion,
                    r.instrucciones,
                    e.competencias,
                    m.nombre as materia_nombre,
                    m.codigo as materia_codigo,
                    c.nombre AS carrera_nombre,
                    mp.num_semestre AS materia_semestre,
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
                INNER JOIN rubrica_uso ru ON ru.id_eval = e.id
                INNER JOIN rubrica r ON r.id = ru.id_rubrica
                INNER JOIN seccion s ON e.id_seccion = s.id
                INNER JOIN materia_pensum mp ON s.id_materia_plan = mp.id
                INNER JOIN materia m ON mp.codigo_materia = m.codigo
                INNER JOIN carrera c ON mp.codigo_carrera = c.codigo
                INNER JOIN inscripcion_seccion ins ON s.id = ins.id_seccion
                INNER JOIN usuario_estudiante ue ON ins.cedula_estudiante = ue.cedula_usuario
                INNER JOIN usuario u ON ue.cedula_usuario = u.cedula
                LEFT JOIN evaluacion_realizada er ON e.id = er.id_evaluacion AND er.cedula_evaluado = ue.cedula_usuario
                LEFT JOIN horario_seccion hs ON s.id = hs.id_seccion
                LEFT JOIN tipo_rubrica tr ON r.id_tipo = tr.id
                AND e.codigo_periodo = ?
                GROUP BY e.id, ins.cedula_estudiante
                ORDER BY er.fecha_evaluado DESC;
            `;
            queryParams = [periodo];
        } else {
            sqlQuery = `
                SELECT
                    er.id,
                    s.id AS id_seccion,
                    e.id AS id_evaluacion,
                    e.contenido,
                    (SELECT COALESCE(SUM(de2.puntaje_obtenido), 0)
                    FROM detalle_evaluacion de2
                    WHERE de2.evaluacion_r_id = er.id) as puntaje_total,
                    e.fecha_evaluacion AS fecha_fija,
                    er.fecha_evaluado as fecha_evaluacion,
                    er.observaciones,
                    ins.cedula_estudiante as estudiante_cedula,
                    u.nombre AS estudiante_nombre,
                    u.apeliido AS estudiante_apellido,
                    r.nombre_rubrica as nombre_rubrica,
                    tr.nombre as tipo_evaluacion,
                    IFNULL((SELECT SUM(cr2.puntaje_maximo)
                    FROM criterio_rubrica cr2
                    WHERE cr2.rubrica_id = r.id), e.ponderacion) as porcentaje_evaluacion,
                    r.instrucciones,
                    e.competencias,
                    m.nombre as materia_nombre,
                    m.codigo as materia_codigo,
                    c.nombre AS carrera_nombre,
                    mp.num_semestre AS materia_semestre,
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
                INNER JOIN rubrica_uso ru ON ru.id_eval = e.id
                INNER JOIN rubrica r ON r.id = ru.id_rubrica
                INNER JOIN seccion s ON e.id_seccion = s.id
                INNER JOIN permiso_docente pd ON s.id = pd.id_seccion
                INNER JOIN materia_pensum mp ON s.id_materia_plan = mp.id
                INNER JOIN materia m ON mp.codigo_materia = m.codigo
                INNER JOIN carrera c ON mp.codigo_carrera = c.codigo
                INNER JOIN inscripcion_seccion ins ON s.id = ins.id_seccion
                INNER JOIN usuario_estudiante ue ON ins.cedula_estudiante = ue.cedula_usuario
                INNER JOIN usuario u ON ue.cedula_usuario = u.cedula
                LEFT JOIN evaluacion_realizada er ON e.id = er.id_evaluacion AND er.cedula_evaluado = ue.cedula_usuario
                LEFT JOIN horario_seccion hs ON s.id = hs.id_seccion
                LEFT JOIN tipo_rubrica tr ON r.id_tipo = tr.id
                WHERE pd.docente_cedula = ?
                AND e.codigo_periodo = ?
                GROUP BY e.id, ins.cedula_estudiante
                ORDER BY er.fecha_evaluado DESC;
            `;
            queryParams = [docenteCedula, periodo];
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
                    `${parseFloat(ev.puntaje_total).toFixed(1)}/${ev.porcentaje_evaluacion} (${(parseFloat(ev.puntaje_total) / 5).toFixed(1)}/${ev.porcentaje_evaluacion / 5})` :
                    '-/-'
            };
        });
    }
    static async getTeacherEvaluaciones(docenteCedula, esAdmin, periodo) {
        let sqlQuery;
        console.log(periodo); periodo = "2025-1"
        let queryParams = [];

        if (esAdmin) {
            sqlQuery = `
                SELECT
                    s.id AS id_seccion,
                    e.id AS id_evaluacion,
                    e.contenido,
                    e.fecha_evaluacion AS fecha_fija,
                    IFNULL(r.nombre_rubrica, 'Sin Rúbrica') as nombre_rubrica,
                    tr.nombre AS tipo_evaluacion,
                    e.ponderacion AS porcentaje_evaluacion,
                    e.corte_orden AS corte,
                    r.instrucciones,
                    r.id AS rubrica_id,
                    e.competencias,
                    EXISTS(SELECT 1 FROM evaluacion_realizada er 
                    WHERE er.id_evaluacion = e.id) AS existe_evaluado,
                    m.nombre as materia_nombre,
                    m.codigo as materia_codigo,
                    c.nombre AS carrera_nombre,
                    c.codigo AS carrera_codigo,
                    mp.num_semestre AS materia_semestre,
                    CONCAT(mp.codigo_carrera, '-', mp.codigo_materia, ' ', s.letra) AS seccion_codigo,
                    (SELECT GROUP_CONCAT(DISTINCT CONCAT(hs2.dia, ' (', hs2.hora_inicio, '-', hs2.hora_cierre, ')') SEPARATOR ', ')
                    FROM horario_seccion hs2
                    WHERE hs2.id_seccion = s.id) AS seccion_horario,
                    hs.aula AS seccion_aula
                FROM evaluacion e 
                INNER JOIN seccion s ON e.id_seccion = s.id
                INNER JOIN materia_pensum mp ON s.id_materia_plan = mp.id
                INNER JOIN materia m ON mp.codigo_materia = m.codigo
                INNER JOIN carrera c ON mp.codigo_carrera = c.codigo
                LEFT JOIN horario_seccion hs ON s.id = hs.id_seccion
                LEFT JOIN rubrica_uso ru ON ru.id_eval = e.id
                LEFT JOIN rubrica r ON r.id = ru.id_rubrica
                LEFT JOIN tipo_rubrica tr ON r.id_tipo = tr.id
                WHERE e.codigo_periodo = ?
                GROUP BY e.id
                ORDER BY fecha_fija DESC;
            `;
            queryParams = [periodo];
        } else {
            sqlQuery = `
                SELECT
                    s.id AS id_seccion,
                    e.id AS id_evaluacion,
                    e.contenido,
                    e.fecha_evaluacion AS fecha_fija,
                    IFNULL(r.nombre_rubrica, 'Sin Rúbrica') as nombre_rubrica,
                    tr.nombre AS tipo_evaluacion,
                    e.ponderacion AS porcentaje_evaluacion,
                    r.instrucciones,
                    e.corte_orden AS corte,
                    EXISTS(SELECT 1 FROM evaluacion_realizada er 
                    WHERE er.id_evaluacion = e.id) AS existe_evaluado,
                    r.id AS rubrica_id,
                    e.competencias,
                    m.nombre as materia_nombre,
                    m.codigo as materia_codigo,
                    c.nombre AS carrera_nombre,
                    c.codigo AS carrera_codigo,
                    mp.num_semestre AS materia_semestre,
                    CONCAT(mp.codigo_carrera, '-', mp.codigo_materia, ' ', s.letra) AS seccion_codigo,
                    (SELECT GROUP_CONCAT(DISTINCT CONCAT(hs2.dia, ' (', hs2.hora_inicio, '-', hs2.hora_cierre, ')') SEPARATOR ', ')
                    FROM horario_seccion hs2
                    WHERE hs2.id_seccion = s.id) AS seccion_horario,
                    hs.aula AS seccion_aula
                FROM seccion s 
                INNER JOIN permiso_docente pd ON s.id = pd.id_seccion
                INNER JOIN materia_pensum mp ON s.id_materia_plan = mp.id
                INNER JOIN pensum p ON mp.id_pensum = p.id
                INNER JOIN periodo_academico pa ON p.id = pa.id_pensum
                INNER JOIN materia m ON mp.codigo_materia = m.codigo
                INNER JOIN carrera c ON mp.codigo_carrera = c.codigo
                LEFT JOIN evaluacion e ON s.id = e.id_seccion
                LEFT JOIN horario_seccion hs ON s.id = hs.id_seccion
                LEFT JOIN rubrica_uso ru ON ru.id_eval = e.id
                LEFT JOIN rubrica r ON r.id = ru.id_rubrica
                LEFT JOIN tipo_rubrica tr ON r.id_tipo = tr.id
                WHERE pd.docente_cedula = ?
                AND pa.codigo = ?
                GROUP BY e.id
                ORDER BY fecha_fija DESC;
            `;
            queryParams = [docenteCedula, periodo];
        }

        const evaluaciones = await query(sqlQuery, queryParams);
        return evaluaciones.map(ev => {
            const fecha = ev.fecha_fija ?
                new Date(ev.fecha_fija).toISOString() : null;
            return {
                ...ev,
                fecha_formateada: fecha ? new Date(fecha).toLocaleDateString('es-ES') : 'Pendiente',
            };
        });
    }
    static async getEvaluadasByEval(idEval) {
        let sqlQuery = `
                SELECT
                    er.id,
                    e.id AS id_evaluacion,
                    (SELECT COALESCE(SUM(de2.puntaje_obtenido), 0)
                    FROM detalle_evaluacion de2
                    WHERE de2.evaluacion_r_id = er.id) as puntaje_total,
                    e.fecha_evaluacion AS fecha_fija,
                    er.fecha_evaluado as fecha_evaluacion,
                    er.observaciones,
                    ins.cedula_estudiante as estudiante_cedula,
                    u.nombre AS estudiante_nombre,
                    u.apeliido AS estudiante_apellido,
                    r.nombre_rubrica as nombre_rubrica,
                    tr.nombre as tipo_evaluacion,
                    IFNULL((SELECT SUM(cr2.puntaje_maximo)
                    FROM criterio_rubrica cr2
                    WHERE cr2.rubrica_id = r.id), e.ponderacion) as porcentaje_evaluacion,
                    r.instrucciones,
                    CASE
                        WHEN er.id IS NOT NULL THEN 'Completada'
                        ELSE 'Pendiente'
                    END as estado
                FROM evaluacion e 
                INNER JOIN rubrica_uso ru ON ru.id_eval = e.id
                INNER JOIN rubrica r ON r.id = ru.id_rubrica
                INNER JOIN seccion s ON e.id_seccion = s.id
                INNER JOIN inscripcion_seccion ins ON s.id = ins.id_seccion
                INNER JOIN usuario_estudiante ue ON ins.cedula_estudiante = ue.cedula_usuario
                INNER JOIN usuario u ON ue.cedula_usuario = u.cedula
                LEFT JOIN evaluacion_realizada er ON e.id = er.id_evaluacion AND er.cedula_evaluado = ue.cedula_usuario
                LEFT JOIN tipo_rubrica tr ON r.id_tipo = tr.id
                WHERE e.id = ?
                GROUP BY e.id, ins.cedula_estudiante
                ORDER BY er.fecha_evaluado DESC;
            `;

        const evaluaciones = await query(sqlQuery, [idEval]);
        return evaluaciones.map(ev => {
            const iniciales = (ev.estudiante_nombre.charAt(0) + ev.estudiante_apellido.charAt(0)).toUpperCase();
            const fecha = ev.fecha_evaluacion ?
                new Date(ev.fecha_evaluacion).toISOString() : null;

            return {
                ...ev,
                iniciales,
                fecha_formateada: fecha ? new Date(fecha).toLocaleDateString('es-ES') : 'Pendiente',
                calificacion: ev.puntaje_total ?
                    `${parseFloat(ev.puntaje_total).toFixed(1)}/${ev.porcentaje_evaluacion} (${(parseFloat(ev.puntaje_total) / 5).toFixed(1)}/${ev.porcentaje_evaluacion / 5})` :
                    '-/-'
            };
        });
    }
    static async getCarreras(docenteCedula, periodo) {
        console.log(periodo); periodo = "2025-1"
        const sqlQuery = `
            SELECT DISTINCT
                c.codigo,
                c.nombre,
                c.descripcion
            FROM permiso_docente pd
            INNER JOIN seccion s ON pd.id_seccion = s.id
            INNER JOIN materia_pensum mp ON s.id_materia_plan = mp.id 
            INNER JOIN pensum p ON mp.id_pensum = p.id
            INNER JOIN periodo_academico pa ON p.id = pa.id_pensum
            INNER JOIN materia m ON mp.codigo_materia = m.codigo
            INNER JOIN carrera c ON mp.codigo_carrera = c.codigo
            WHERE pd.docente_cedula = ?
            AND pa.codigo = ?
            ORDER BY c.nombre
        `;
        return query(sqlQuery, [docenteCedula, periodo]);
    }

    static async getMaterias(carreraCodigo, docenteCedula, periodo) {
        console.log(periodo); periodo = "2025-1"
        const sqlQuery = `
            SELECT DISTINCT
                m.codigo,
                m.nombre,
                mp.num_semestre as semestre,
                mp.unidades_credito as creditos
            FROM permiso_docente pd
            INNER JOIN seccion s ON pd.id_seccion = s.id
            INNER JOIN materia_pensum mp ON s.id_materia_plan = mp.id 
            INNER JOIN pensum p ON mp.id_pensum = p.id
            INNER JOIN periodo_academico pa ON p.id = pa.id_pensum
            INNER JOIN materia m ON mp.codigo_materia = m.codigo
            INNER JOIN carrera c ON mp.codigo_carrera = c.codigo
            WHERE c.codigo = ?
              AND pd.docente_cedula = ?
              AND pa.codigo = ?
            ORDER BY semestre, m.nombre
        `;
        return query(sqlQuery, [carreraCodigo, docenteCedula, periodo]);
    }

    static async getSecciones(materiaCodigo, docenteCedula, periodo) {
        console.log(periodo); periodo = "2025-1"
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
            INNER JOIN pensum p ON mp.id_pensum = p.id
            INNER JOIN periodo_academico pa ON p.id = pa.id_pensum
            INNER JOIN materia m ON mp.codigo_materia = m.codigo
            WHERE m.codigo = ?
              AND pd.docente_cedula = ?
              AND pa.codigo = ?
            ORDER BY codigo
        `;
        return query(sqlQuery, [materiaCodigo, docenteCedula, periodo]);
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
                e.id AS id_evaluacion,
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
            LEFT JOIN tipo_rubrica tr ON r.id_tipo = tr.id
            INNER JOIN seccion s ON e.id_seccion = s.id
            INNER JOIN inscripcion_seccion ins ON s.id = ins.id_seccion
            INNER JOIN materia_pensum mp ON s.id_materia_plan = mp.id
            INNER JOIN materia m ON mp.codigo_materia = m.codigo
            LEFT JOIN evaluacion_realizada er ON e.id = er.id_evaluacion AND ins.cedula_estudiante = er.cedula_evaluado
            LEFT JOIN usuario ud ON ud.cedula = er.cedula_evaluador
            LEFT JOIN estrategia_empleada eemp ON er.id_evaluacion = eemp.id_eval
            LEFT JOIN estrategia_eval eeval ON eemp.id_estrategia = eeval.id
            WHERE ins.cedula_estudiante = ? AND e.id = ?
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

    static async saveEvaluacion(evaluacionId, estudianteCedula, evaluadorCedula, payload) {
        const pool = conexion

        const connection = await new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => err ? reject(err) : resolve(conn));
        });

        const query = (sql, params) => new Promise((resolve, reject) => {
            connection.query(sql, params, (err, results) => err ? reject(err) : resolve(results));
        });

        const beginTransaction = () => new Promise((resolve, reject) => {
            connection.beginTransaction(err => err ? reject(err) : resolve());
        });

        const commit = () => new Promise((resolve, reject) => {
            connection.commit(err => err ? reject(err) : resolve());
        });

        const rollback = () => new Promise((resolve, reject) => {
            connection.rollback(() => resolve()); // rollback siempre resuelve
        });

        await beginTransaction();

        let er_id;

        try {
            const rows = await query(
                `SELECT id FROM evaluacion_realizada WHERE id_evaluacion = ? AND cedula_evaluado = ?`,
                [evaluacionId, estudianteCedula]
            );

            if (rows.length === 0) {
                const result_insert = await query(
                    `INSERT INTO evaluacion_realizada (id_evaluacion, cedula_evaluado, cedula_evaluador, observaciones)
                 VALUES (?, ?, ?, ?)`,
                    [evaluacionId, estudianteCedula, evaluadorCedula, payload.observaciones]
                );
                er_id = result_insert.insertId;
            } else {
                er_id = rows[0].id;
                await query(
                    `DELETE FROM detalle_evaluacion WHERE evaluacion_r_id = ?`,
                    [er_id]
                );
            }

            if (payload.detalles && payload.detalles.length > 0) {
                const values = payload.detalles.map(d => [
                    er_id, d.criterio_id, d.nivel_id, d.puntaje_obtenido, null
                ]);
                await query(
                    `INSERT INTO detalle_evaluacion (evaluacion_r_id, id_criterio_detalle, orden_detalle, puntaje_obtenido, observaciones)
                 VALUES ?`,
                    [values]
                );
            }

            await query(
                `UPDATE evaluacion_realizada SET fecha_evaluado = NOW(), observaciones = ? WHERE id = ?`,
                [payload.observaciones || '', er_id]
            );

            await commit();

        } catch (err) {
            await rollback();
            throw err;
        } finally {
            connection.release();
        }

        // Notificación fuera de la transacción (fallo no crítico)
        try {
            const rows = await new Promise((resolve, reject) => {
                pool.query(`
                SELECT r.nombre_rubrica, m.nombre as materia_nombre
                FROM evaluacion_realizada er
                INNER JOIN evaluacion e ON er.id_evaluacion = e.id
                INNER JOIN seccion s ON e.id_seccion = s.id
                INNER JOIN materia_pensum mp ON s.id_materia_plan = mp.id
                INNER JOIN materia m ON mp.codigo_materia = m.codigo
                INNER JOIN rubrica_uso ru ON e.id = ru.id_eval
                INNER JOIN rubrica r ON ru.id_rubrica = r.id
                WHERE er.id = ?
            `, [er_id], (err, results) => err ? reject(err) : resolve(results));
            });

            const evalInfo = rows[0];
            if (evalInfo) {
                await NotificacionModel.create({
                    usuario_destino: estudianteCedula,
                    mensaje: `Tu evaluación en la materia "${evalInfo.materia_nombre}" ha sido corregida (Rúbrica: ${evalInfo.nombre_rubrica}).`,
                    id_rubrica: null
                });
            }
        } catch (notifErr) {
            console.error('Error al crear notificación de evaluación:', notifErr);
        }

        return { er_id };
    }
}

module.exports = TeacherEvaluacionesModel;
