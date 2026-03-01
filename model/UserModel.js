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

    async getAll() {
        const query = 'SELECT cedula, nombre, apeliido, email, id_rol, activo FROM usuario ORDER BY nombre';
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
}

module.exports = new UserModel();