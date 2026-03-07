const connection = require('./conexion');

class PeriodosModel {
    async getPeriodos() {
        return new Promise((resolve, reject) => {
            const query = `SELECT
                                DISTINCT pa.codigo 
                            FROM periodo_academico pa 
                            ORDER BY pa.codigo DESC`
            connection.query(query, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
}
module.exports = new PeriodosModel();
