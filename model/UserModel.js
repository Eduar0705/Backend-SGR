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
}

module.exports = new UserModel();