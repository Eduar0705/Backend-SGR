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
    async getCortes(periodo) {
        return new Promise((resolve, reject) => {
            console.log(periodo); periodo = "2025-1"
            const query = `
                SELECT 
                    *
                FROM corte_periodo
                WHERE codigo_periodo = ?
                ORDER BY codigo_periodo
            `;
            connection.query(query, [periodo], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    }
}
module.exports = new PeriodosModel();
