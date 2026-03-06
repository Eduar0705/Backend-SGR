const connection = require('./conexion');

class PermisosModel {
    async getPermisosByDocente(cedula) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    pd.id,
                    mp.codigo_carrera AS carrera_codigo,
                    mp.num_semestre AS semestre,
                    mp.codigo_materia AS materia_codigo,
                    pd.id_seccion AS seccion_id,
                    c.nombre as carrera_nombre,
                    m.nombre as materia_nombre,
                    CONCAT(mp.codigo_carrera, '-', mp.codigo_materia, ' ', s.letra) AS seccion_codigo,
                    mp.codigo_periodo AS lapso_academico
                FROM permiso_docente pd
                INNER JOIN seccion s ON pd.id_seccion = s.id
                INNER JOIN materia_pensum mp ON s.id_materia_plan = mp.id
                INNER JOIN materia m ON mp.codigo_materia = m.codigo
                INNER JOIN carrera c ON mp.codigo_carrera = c.codigo
                WHERE pd.docente_cedula = ? AND pd.activo = 1
                ORDER BY carrera_nombre, semestre, materia_nombre, seccion_codigo;
            `;
            connection.query(query, [cedula], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    async getPermisoById(id) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    pd.*,
                    u.nombre as docente_nombre,
                    u.apeliido as docente_apellido,
                    c.nombre as carrera_nombre,
                    m.nombre as materia_nombre,
                    CONCAT(mp.codigo_carrera, '-', mp.codigo_materia, ' ', s.letra) AS seccion_codigo,
                    mp.codigo_periodo AS lapso_academico
                FROM permiso_docente pd
                INNER JOIN seccion s ON pd.id_seccion = s.id
                INNER JOIN materia_pensum pp ON s.id_materia_plan = mp.id
                INNER JOIN materia m ON mp.codigo_materia = m.codigo
                INNER JOIN carrera c ON mp.codigo_carrera = c.codigo
                INNER JOIN usuario u ON pd.docente_cedula = u.cedula
                WHERE pd.id = ?
            `;
            connection.query(query, [id], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    }

    async createOrReactivatePermiso(docente_cedula, seccion_id, cedula_creador) {
        return new Promise((resolve, reject) => {
            // Verificar si ya existe (incluso inactivo)
            const checkQuery = `SELECT id, activo FROM permiso_docente WHERE docente_cedula = ? AND id_seccion = ?`;
            connection.query(checkQuery, [docente_cedula, seccion_id], (err, results) => {
                if (err) return reject(err);

                if (results.length > 0) {
                    const permiso = results[0];
                    if (permiso.activo === 1) {
                        return resolve({ success: false, message: 'El permiso ya existe y está activo', id: permiso.id });
                    }
                    // Reactivar
                    const updateQuery = `UPDATE permiso_docente SET activo = 1, cedula_creador = ? WHERE id = ?`;
                    connection.query(updateQuery, [cedula_creador, permiso.id], (err, result) => {
                        if (err) return reject(err);
                        resolve({ success: true, message: 'Permiso reactivado exitosamente', id: permiso.id, reactivado: true });
                    });
                } else {
                    // Crear nuevo
                    const insertQuery = `INSERT INTO permiso_docente (docente_cedula, id_seccion, cedula_creador, activo) VALUES (?, ?, ?, 1)`;
                    connection.query(insertQuery, [docente_cedula, seccion_id, cedula_creador], (err, result) => {
                        if (err) return reject(err);
                        resolve({ success: true, message: 'Permiso creado exitosamente', id: result.insertId, nuevo: true });
                    });
                }
            });
        });
    }

    async deletePermiso(id) {
        return new Promise((resolve, reject) => {
            const query = `UPDATE permiso_docente SET activo = 0 WHERE id = ?`;
            connection.query(query, [id], (err, result) => {
                if (err) return reject(err);
                if (result.affectedRows === 0) return resolve({ success: false, message: 'Permiso no encontrado' });
                resolve({ success: true, message: 'Permiso eliminado exitosamente' });
            });
        });
    }
}

module.exports = new PermisosModel();
