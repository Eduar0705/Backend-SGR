const connection = require('./conexion');

class DocenteModel {
    async getDocentes() {
        const query = `
            SELECT 
                u.cedula, 
                u.nombre, 
                u.apeliido AS apellido, 
                ud.especializacion, 
                u.email, 
                ud.telf AS telefono, 
                ud.descripcion, 
                u.activo 
            FROM usuario u
            INNER JOIN usuario_docente ud ON u.cedula = ud.cedula_usuario
            WHERE u.activo = 1 
            AND u.id_rol = 2 
            ORDER BY apellido, nombre
        `;

        return new Promise((resolve, reject) => {
            connection.query(query, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    async createDocente({ cedula, nombre, apellido, email, telefono, especialidad, notas }) {
        return new Promise((resolve, reject) => {
            // Verificar si el usuario ya existe (en usuario y/o usuario_docente)
            const checkQuery = `
                SELECT u.cedula, u.nombre, u.apeliido, u.email, u.activo, u.id_rol,
                       ud.cedula_usuario AS docente_existe
                FROM usuario u
                LEFT JOIN usuario_docente ud ON u.cedula = ud.cedula_usuario
                WHERE u.cedula = ?
            `;

            connection.query(checkQuery, [cedula], (err, results) => {
                if (err) return reject(err);

                connection.getConnection((err, conn) => {
                    if (err) return reject(err);

                    conn.beginTransaction((err) => {
                        if (err) { conn.release(); return reject(err); }

                        if (results.length > 0 && results[0].docente_existe && results[0].activo == 0) {
                            // Re-activar docente existente (tiene registro en usuario y usuario_docente)
                            const updateUsuario = `UPDATE usuario SET nombre = ?, apeliido = ?, email = ?, activo = 1 WHERE cedula = ?`;
                            conn.query(updateUsuario, [nombre, apellido, email, cedula], (err) => {
                                if (err) {
                                    return conn.rollback(() => { conn.release(); reject(err); });
                                }

                                const updateDocente = `UPDATE usuario_docente SET especializacion = ?, descripcion = ?, telf = ? WHERE cedula_usuario = ?`;
                                conn.query(updateDocente, [especialidad, notas || '', telefono, cedula], (err) => {
                                    if (err) {
                                        return conn.rollback(() => { conn.release(); reject(err); });
                                    }

                                    conn.commit((err) => {
                                        if (err) {
                                            return conn.rollback(() => { conn.release(); reject(err); });
                                        }
                                        conn.release();
                                        resolve({ success: true, message: 'Profesor re-agregado exitosamente', reactivated: true });
                                    });
                                });
                            });
                        } else if (results.length > 0 && results[0].docente_existe && results[0].activo == 1) {
                            // Ya existe como docente y está activo
                            conn.release();
                            resolve({ success: false, message: 'Ya existe un docente con esa cédula' });
                        } else if (results.length > 0 && !results[0].docente_existe) {
                            // El usuario existe en la tabla usuario pero NO en usuario_docente
                            // Actualizar su rol a docente e insertar en usuario_docente
                            const updateUsuario = `UPDATE usuario SET nombre = ?, apeliido = ?, email = ?, id_rol = 2, activo = 1 WHERE cedula = ?`;
                            conn.query(updateUsuario, [nombre, apellido, email, cedula], (err) => {
                                if (err) {
                                    return conn.rollback(() => { conn.release(); reject(err); });
                                }

                                const insertDocente = `INSERT INTO usuario_docente (cedula_usuario, especializacion, descripcion, telf) VALUES (?, ?, ?, ?)`;
                                conn.query(insertDocente, [cedula, especialidad, notas || '', telefono], (err) => {
                                    if (err) {
                                        return conn.rollback(() => { conn.release(); reject(err); });
                                    }

                                    conn.commit((err) => {
                                        if (err) {
                                            return conn.rollback(() => { conn.release(); reject(err); });
                                        }
                                        conn.release();
                                        resolve({ success: true, message: 'Profesor agregado exitosamente (usuario existente actualizado)' });
                                    });
                                });
                            });
                        } else {
                            // Crear nuevo (no existe en ninguna tabla)
                            const insertUsuario = `INSERT INTO usuario (cedula, nombre, apeliido, email, id_rol) VALUES (?, ?, ?, ?, 2)`;
                            conn.query(insertUsuario, [cedula, nombre, apellido, email], (err) => {
                                if (err) {
                                    return conn.rollback(() => { conn.release(); reject(err); });
                                }

                                const insertDocente = `INSERT INTO usuario_docente (cedula_usuario, especializacion, descripcion, telf) VALUES (?, ?, ?, ?)`;
                                conn.query(insertDocente, [cedula, especialidad, notas || '', telefono], (err) => {
                                    if (err) {
                                        return conn.rollback(() => { conn.release(); reject(err); });
                                    }

                                    conn.commit((err) => {
                                        if (err) {
                                            return conn.rollback(() => { conn.release(); reject(err); });
                                        }
                                        conn.release();
                                        resolve({ success: true, message: 'Profesor agregado exitosamente' });
                                    });
                                });
                            });
                        }
                    });
                });
            });
        });
    }

    async updateDocente(cedula_og, { cedula, nombre, apellido, email, telefono, especialidad, notas, activo }) {
        return new Promise((resolve, reject) => {
            connection.getConnection((err, conn) => {
                if (err) return reject(err);

                // Validar que no exista ya un usuario con la nueva cédula
                const checkUsuario = `SELECT cedula FROM usuario WHERE cedula = ?`;
                conn.query(checkUsuario, [cedula], (err, results) => {
                    if (err) {
                        conn.release();
                        return reject(err);
                    }

                    if (results.length > 0 && cedula_og !== cedula) {
                        conn.release();
                        return resolve({ success: false, message: 'Esa cédula ya pertenece a otro profesor. Por favor, asegurese de evitar duplicados.' });
                    }

                    conn.beginTransaction((err) => {
                        if (err) { conn.release(); return reject(err); }

                        const updateUsuario = `UPDATE usuario SET cedula = ?, nombre = ?, apeliido = ?, email = ?, activo = ? WHERE cedula = ?`;
                        conn.query(updateUsuario, [cedula, nombre, apellido, email, activo || 1, cedula_og], (err) => {
                            if (err) {
                                return conn.rollback(() => { conn.release(); reject(err); });
                            }

                            const updateDocente = `UPDATE usuario_docente SET cedula_usuario = ?, especializacion = ?, descripcion = ?, telf = ? WHERE cedula_usuario = ?`;
                            conn.query(updateDocente, [cedula, especialidad, notas || '', telefono, cedula_og], (err) => {
                                if (err) {
                                    return conn.rollback(() => { conn.release(); reject(err); });
                                }

                                conn.commit((err) => {
                                    if (err) {
                                        return conn.rollback(() => { conn.release(); reject(err); });
                                    }
                                    conn.release();
                                    resolve({ success: true, message: 'Profesor actualizado exitosamente' });
                                });
                            });
                        });
                    });
                });
            });
        });
    }

    async deleteDocente(cedula) {
        return new Promise((resolve, reject) => {
            const query = `UPDATE usuario SET activo = 0 WHERE cedula = ?`;
            connection.query(query, [cedula], (err, result) => {
                if (err) return reject(err);
                if (result.affectedRows === 0) {
                    return resolve({ success: false, message: 'Profesor no encontrado' });
                }
                resolve({ success: true, message: 'Profesor eliminado exitosamente' });
            });
        });
    }
}

module.exports = new DocenteModel();