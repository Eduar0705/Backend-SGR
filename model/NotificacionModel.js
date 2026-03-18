const connection = require('./conexion');

class NotificacionModel {
    async getByUsuario(cedula) {
        const query = `
            SELECT 
                n.*,
                datos_adicionales.rubrica_id,
                datos_adicionales.nombre_rubrica,
                datos_adicionales.materia_nombre,
                datos_adicionales.seccion_codigo
            FROM notificacion n
            LEFT JOIN (
                SELECT
                    nr.id_notif,
                    r.id AS rubrica_id,
                    r.nombre_rubrica,
                    m.nombre AS materia_nombre,
                    CONCAT(mp.codigo_carrera, '-', mp.codigo_materia, ' ', s.letra) AS seccion_codigo
                FROM notificacion_rubrica nr
                INNER JOIN rubrica r ON nr.id_rubrica = r.id
                INNER JOIN rubrica_uso ru ON r.id = ru.id_rubrica
                INNER JOIN evaluacion e ON ru.id_eval = e.id
                INNER JOIN seccion s ON e.id_seccion = s.id
                INNER JOIN materia_pensum mp ON mp.id = s.id_materia_plan
                INNER JOIN materia m ON mp.codigo_materia = m.codigo
                GROUP BY nr.id_notif
            ) AS datos_adicionales ON n.id = datos_adicionales.id_notif
            WHERE n.usuario_destino = ?
            ORDER BY n.fecha DESC 
            LIMIT 50
        `;

        return new Promise((resolve, reject) => {
            connection.query(query, [cedula], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    async markAsRead(id) {
        return new Promise((resolve, reject) => {
            connection.query('UPDATE notificacion SET leido = 1 WHERE id = ?', [id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    async markAllAsRead(cedula) {
        return new Promise((resolve, reject) => {
            connection.query('UPDATE notificacion SET leido = 1 WHERE usuario_destino = ?', [cedula], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    async create({ usuario_destino, mensaje, id_rubrica = null }) {
        return new Promise((resolve, reject) => {
            connection.getConnection((err, conn) => {
                conn.beginTransaction(async (err) => {
                    if (err) return reject(err);

                    try {
                        const insertNotif = 'INSERT INTO notificacion (usuario_destino, mensaje, leido, fecha) VALUES (?, ?, 0, NOW())';
                        const result = await new Promise((res, rej) => {
                            conn.query(insertNotif, [usuario_destino, mensaje], (e, r) => e ? rej(e) : res(r));
                        });

                        const idNotif = result.insertId;

                        if (id_rubrica) {
                            const insertRel = 'INSERT INTO notificacion_rubrica (id_notif, id_rubrica) VALUES (?, ?)';
                            await new Promise((res, rej) => {
                                conn.query(insertRel, [idNotif, id_rubrica], (e, r) => e ? rej(e) : res(r));
                            });
                        }

                        conn.commit((e) => {
                            if (e) return conn.rollback(() => reject(e));
                            resolve({ id: idNotif });
                        });
                    } catch (error) {
                        conn.rollback(() => reject(error));
                    }
                });
            });
        });
    }
}

module.exports = new NotificacionModel();
