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
                        DISTINCT pa.*,
                        (CASE WHEN EXISTS (SELECT 1 
                            FROM evaluacion e 
                            WHERE e.codigo_periodo = pa.codigo) 
                            THEN 1 
                            ELSE 0 
                        END) AS modificable
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
    async createPeriodo(codigo, fecha_inicio, fecha_fin, id_pensum, dias_evaluacion) {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO periodo_academico
                            (codigo, fecha_inicio, activo, fecha_fin, id_pensum, dias_abierto)
                            VALUES (?, ?, ?, ?, ?, ?)`
            connection.query(query, [codigo, fecha_inicio, 1, fecha_fin, id_pensum, dias_evaluacion], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
    async getPeriodoByCodigo(codigo) {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM periodo_academico WHERE codigo = ?`
            connection.query(query, [codigo], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
    async deletePeriodo(codigo_periodo) {
        return new Promise((resolve, reject) => {
            connection.getConnection((err, conn) => {
                if (err) return reject(err);

                conn.beginTransaction((err) => {
                    if (err) {
                        conn.release();
                        return reject(err);
                    }
                            // 1. Eliminar cortes
                            conn.query(
                                `DELETE FROM corte_periodo WHERE codigo_periodo = ?`,
                                [codigo_periodo],
                                (error) => {
                                    if (error) return conn.rollback(() => { conn.release(); reject(error); });

                                    // 2. Eliminar periodo
                                    conn.query(
                                        `DELETE FROM periodo_academico WHERE codigo = ?`,
                                        [codigo_periodo],
                                        (error, results) => {
                                            if (error) return conn.rollback(() => { conn.release(); reject(error); });

                                            conn.commit((err) => {
                                                conn.release();
                                                if (err) return reject(err);
                                                resolve(results);
                                            });
                                        }
                                    );
                                }
                            );
                        }
                    );
                });
            });
    }
    async getCortes(periodo) {
        return new Promise((resolve, reject) => {
            const query = `
            SELECT 
                cp.*,
                (CASE WHEN EXISTS (SELECT 1 
                    FROM evaluacion e 
                    WHERE e.codigo_periodo = cp.codigo_periodo) 
                THEN 1 
                ELSE 0 
                END) AS modificable
            FROM corte_periodo cp
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
    async syncCortesEvaluaciones(codigo_periodo) {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE evaluacion e
                INNER JOIN corte_periodo cp ON e.codigo_periodo = cp.codigo_periodo
                    SET e.corte_orden = cp.orden
                WHERE e.fecha_evaluacion BETWEEN cp.fecha_inicio AND cp.fecha_fin
                AND e.codigo_periodo = ?
            `;
            connection.query(query, [codigo_periodo], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    }
    async getPensums() {
        return new Promise((resolve, reject) => {
            const query = `SELECT
                        *
                    FROM pensum
                    ORDER BY id DESC`
            connection.query(query, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
}
module.exports = new PeriodosModel();
