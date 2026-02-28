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
}

module.exports = new DocenteModel();