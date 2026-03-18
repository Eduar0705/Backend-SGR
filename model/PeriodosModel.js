const connection = require('./conexion');

const addOneDay = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(`${dateStr}T00:00:00`);
    date.setDate(date.getDate() + 2);
    return date.toISOString().split('T')[0];
};


class PeriodosModel {
    async getPeriodos() {
        return new Promise((resolve, reject) => {
            const query = `SELECT
                        DISTINCT *
                    FROM periodo_academico pa 
                    ORDER BY pa.codigo DESC`
            connection.query(query, (err, results) => {
                if (err) return reject(err);

                const formatted = results.map(row => ({
                    ...row,
                    fecha_inicio: addOneDay(row.fecha_inicio?.toISOString().split('T')[0]),
                    fecha_fin: addOneDay(row.fecha_fin?.toISOString().split('T')[0]),
                }));

                resolve(formatted);
            });
        });
    }

    async getCortes(periodo) {
        return new Promise((resolve, reject) => {
            const query = `
            SELECT 
                *
            FROM corte_periodo
            WHERE codigo_periodo = ?
            ORDER BY codigo_periodo
        `;
            connection.query(query, [periodo], (error, results) => {
                if (error) return reject(error);

                const formatted = results.map(row => ({
                    ...row,
                    fecha_inicio: addOneDay(row.fecha_inicio?.toISOString().split('T')[0]),
                    fecha_fin: addOneDay(row.fecha_fin?.toISOString().split('T')[0]),
                }));
                resolve(formatted);
            });
        });
    }
    async createCorte(codigo_periodo, orden, fecha_inicio, fecha_fin) {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO corte_periodo (codigo_periodo, orden, fecha_inicio, fecha_fin)
                VALUES (?, ?, ?, ?);
            `;
            connection.query(query, [codigo_periodo, orden, fecha_inicio, fecha_fin], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    }
    async updateCorte(codigo_periodo, orden, fecha_inicio, fecha_fin) {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE corte_periodo
                SET fecha_inicio=?, fecha_fin=?
                WHERE codigo_periodo=? AND orden=?
            `;
            connection.query(query, [fecha_inicio, fecha_fin, codigo_periodo, orden], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    }
    async deleteCorte(codigo_periodo, orden) {
        return new Promise((resolve, reject) => {
            const query = `
                DELETE FROM corte_periodo
                WHERE codigo_periodo=? AND orden=?
            `;
            connection.query(query, [codigo_periodo, orden], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    }
}
module.exports = new PeriodosModel();
