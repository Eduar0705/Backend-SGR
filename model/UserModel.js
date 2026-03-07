const connection = require('./conexion');

class UserModel {
    async login(cedula, password) {
        const query = 'SELECT * FROM usuario WHERE cedula = ? AND password = ?';
        return new Promise((resolve, reject) => {
            connection.query(query, [cedula, password], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    async getByCedula(cedula) {
        const query = `
            SELECT u.cedula, u.nombre, u.apeliido as apellido, u.email, r.nombre as rol_nombre, u.id_rol
            FROM usuario u
            INNER JOIN rol r ON u.id_rol = r.id
            WHERE u.cedula = ?
        `;
        return new Promise((resolve, reject) => {
            connection.query(query, [cedula], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    }

    async changePassword(cedula, newPassword) {
        const query = 'UPDATE usuario SET password = ? WHERE cedula = ?';
        return new Promise((resolve, reject) => {
            connection.query(query, [newPassword, cedula], (err, result) => {
                if (err) return reject(err);
                if (result.affectedRows === 0) return resolve({ status: 'error', mensaje: 'Usuario no encontrado' });
                resolve({ status: 'ok', mensaje: 'Contraseña actualizada correctamente' });
            });
        });
    }

    async getAll() {
        const query = 'SELECT cedula, nombre, apeliido as apellido, email, id_rol, activo FROM usuario ORDER BY nombre';
        return new Promise((resolve, reject) => {
            connection.query(query, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    async create({ cedula, nombre, apellido, email, password, rol }) {
        return new Promise((resolve, reject) => {
            // Verificar si ya existe
            const checkQuery = 'SELECT * FROM usuario WHERE cedula = ? OR email = ?';
            connection.query(checkQuery, [cedula, email], (err, results) => {
                if (err) return reject(err);

                if (results.length > 0) {
                    let campo = 'datos';
                    if (results[0].cedula == cedula) campo = 'cédula';
                    else if (results[0].email === email) campo = 'correo electrónico';
                    return resolve({ status: 'error', mensaje: `Ya existe un usuario con ese ${campo}` });
                }

                const insertQuery = `INSERT INTO usuario (cedula, nombre, apeliido, password, email, id_rol, activo) VALUES (?, ?, ?, ?, ?, ?, 1)`;
                connection.query(insertQuery, [cedula, nombre, apellido || '', password, email, rol], (err) => {
                    if (err) return reject(err);
                    resolve({ status: 'ok', mensaje: 'Usuario agregado exitosamente' });
                });
            });
        });
    }

    async update(cedulaOriginal, { cedula, nombre, apellido, email, password, rol }) {
        return new Promise((resolve, reject) => {
            if (password && password.trim() !== '') {
                const query = `UPDATE usuario SET cedula = ?, nombre = ?, apeliido = ?, password = ?, email = ?, id_rol = ? WHERE cedula = ?`;
                connection.query(query, [cedula, nombre, apellido || '', password, email, rol, cedulaOriginal], (err, result) => {
                    if (err) return reject(err);
                    if (result.affectedRows === 0) return resolve({ status: 'error', mensaje: 'Usuario no encontrado' });
                    resolve({ status: 'ok', mensaje: 'Usuario actualizado correctamente' });
                });
            } else {
                const query = `UPDATE usuario SET cedula = ?, nombre = ?, apeliido = ?, email = ?, id_rol = ? WHERE cedula = ?`;
                connection.query(query, [cedula, nombre, apellido || '', email, rol, cedulaOriginal], (err, result) => {
                    if (err) return reject(err);
                    if (result.affectedRows === 0) return resolve({ status: 'error', mensaje: 'Usuario no encontrado' });
                    resolve({ status: 'ok', mensaje: 'Usuario actualizado correctamente' });
                });
            }
        });
    }

    async delete(cedula) {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM usuario WHERE cedula = ?';
            connection.query(query, [cedula], (err, result) => {
                if (err) return reject(err);
                if (result.affectedRows === 0) return resolve({ status: 'error', mensaje: 'Usuario no encontrado' });
                resolve({ status: 'ok', mensaje: 'Usuario eliminado exitosamente' });
            });
        });
    }
    async updateSessionToken(cedula, token) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE usuario SET session_token = ? WHERE cedula = ?';
            connection.query(query, [token, cedula], (err, result) => {
                if (err) return reject(err);
                resolve(result.affectedRows > 0);
            });
        });
    }

    async getSessionToken(cedula) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT session_token FROM usuario WHERE cedula = ?';
            connection.query(query, [cedula], (err, results) => {
                if (err) return reject(err);
                resolve(results.length > 0 ? results[0].session_token : null);
            });
        });
    }

    async clearSessionToken(cedula) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE usuario SET session_token = NULL WHERE cedula = ?';
            connection.query(query, [cedula], (err, result) => {
                if (err) return reject(err);
                resolve(result.affectedRows > 0);
            });
        });
    }

    async storeResetToken(cedula, token, expires) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE usuario SET reset_token = ?, reset_token_expires = ? WHERE cedula = ?';
            connection.query(query, [token, expires, cedula], (err, result) => {
                if (err) return reject(err);
                resolve(result.affectedRows > 0);
            });
        });
    }

    async verifyResetToken(cedula, token) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM usuario WHERE cedula = ? AND reset_token = ? AND reset_token_expires > ?';
            connection.query(query, [cedula, token, new Date()], (err, results) => {
                if (err) return reject(err);
                resolve(results.length > 0);
            });
        });
    }
    async obtenerPeriodoActual(cedula, id_rol) {
        return new Promise((resolve, reject) => {
            connection.getConnection((err, conn) => {
                if (err) {
                    console.error('Error al obtener conexión:', err);
                    return reject(err);
                }

                // Consulta período general
                const periodoGeneralQuery = `
                SELECT codigo
                FROM periodo_academico
                WHERE CURRENT_DATE BETWEEN fecha_inicio AND fecha_fin
                OR fecha_fin <= CURRENT_DATE
                ORDER BY fecha_fin DESC
                LIMIT 1;
            `;

                conn.query(periodoGeneralQuery, (err, periodoGeneralResult) => {
                    if (err) {
                        console.error('Error en consulta período general:', err);
                        conn.release();
                        return reject(err);
                    }

                    const periodoGeneral = periodoGeneralResult && periodoGeneralResult[0] ?
                        periodoGeneralResult[0].codigo : null;

                    console.log(`[PERIODO] Período general encontrado: ${periodoGeneral}`);

                    // Si el rol no requiere consulta específica
                    if (id_rol !== 2 && id_rol !== 3) {
                        conn.release();
                        return resolve({
                            success: true,
                            periodo_general: periodoGeneral,
                            periodo_usuario: null
                        });
                    }

                    // Determinar qué consulta ejecutar según el rol
                    let ultimoPeriodoUsuarioQuery;
                    let queryParams = [cedula];

                    if (id_rol == 2) {
                        ultimoPeriodoUsuarioQuery = `
                        SELECT DISTINCT pa.codigo
                        FROM periodo_academico pa
                        INNER JOIN pensum_periodo pp ON pa.codigo = pp.codigo_periodo
                        INNER JOIN pensum p ON pp.id_pensum = p.id
                        INNER JOIN materia_pensum mp ON p.id = mp.id_pensum
                        INNER JOIN seccion s ON mp.id = s.id_materia_plan
                        INNER JOIN permiso_docente pd ON s.id = pd.id_seccion
                        WHERE pd.docente_cedula = ? 
                        AND (CURRENT_DATE BETWEEN pa.fecha_inicio AND pa.fecha_fin)
                        ORDER BY pa.fecha_fin DESC
                        LIMIT 1;
                    `;
                    } else if (id_rol == 3) {
                        ultimoPeriodoUsuarioQuery = `
                        SELECT DISTINCT pa.codigo
                        FROM periodo_academico pa
                        INNER JOIN pensum_periodo pp ON pa.codigo = pp.codigo_periodo
                        INNER JOIN pensum p ON pp.id_pensum = p.id
                        INNER JOIN materia_pensum mp ON p.id = mp.id_pensum
                        INNER JOIN seccion s ON mp.id = s.id_materia_plan
                        INNER JOIN inscripcion_seccion ins ON s.id = ins.id_seccion
                        WHERE ins.cedula_estudiante = ?
                        AND (CURRENT_DATE BETWEEN pa.fecha_inicio AND pa.fecha_fin)
                        ORDER BY pa.fecha_fin DESC
                        LIMIT 1;
                    `;
                    }

                    // Ejecutar consulta para el rol específico
                    conn.query(ultimoPeriodoUsuarioQuery, queryParams, (err, periodoUsuarioResult) => {
                        // Liberar conexión después de ambas consultas
                        conn.release();

                        if (err) {
                            console.error('Error en consulta período usuario:', err);
                            return reject(err);
                        }

                        const periodoUsuario = periodoUsuarioResult && periodoUsuarioResult[0] ?
                            periodoUsuarioResult[0].codigo : null;

                        console.log(`[PERIODO] Período usuario encontrado: ${periodoUsuario}`);

                        resolve({
                            success: true,
                            periodo_general: periodoGeneral,
                            periodo_usuario: periodoUsuario
                        });
                    });
                });
            });
        });
    }
    async clearResetToken(cedula) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE usuario SET reset_token = NULL, reset_token_expires = NULL WHERE cedula = ?';
            connection.query(query, [cedula], (err, result) => {
                if (err) return reject(err);
                resolve(result.affectedRows > 0);
            });
        });
    }
}

module.exports = new UserModel();