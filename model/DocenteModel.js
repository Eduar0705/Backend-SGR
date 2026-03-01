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
            // Verificar si el docente ya existe (posiblemente inactivo)
            const checkQuery = `
                SELECT u.*, ud.*
                FROM usuario_docente ud
                INNER JOIN usuario u ON ud.cedula_usuario = u.cedula
                WHERE u.cedula = ?
            `;

            connection.query(checkQuery, [cedula], (err, results) => {
                if (err) return reject(err);

                connection.getConnection((err, conn) => {
                    if (err) return reject(err);

                    conn.beginTransaction((err) => {
                        if (err) { conn.release(); return reject(err); }

                        if (results.length > 0 && results[0].activo == 0) {
                            // Re-activar docente existente
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
                        } else if (results.length > 0 && results[0].activo == 1) {
                            // Ya existe y está activo
                            conn.release();
                            resolve({ success: false, message: 'Ya existe un docente con esa cédula' });
                        } else {
                            // Crear nuevo
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