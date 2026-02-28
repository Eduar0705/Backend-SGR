const connection = require('./conexion');

class DashboardModel {
    async getStats() {
        return new Promise((resolve, reject) => {
            const queryDocentes = 'SELECT COUNT(*) as total FROM usuario WHERE id_rol = 2 AND activo = 1';
            const queryRubricas = 'SELECT COUNT(*) as total FROM rubrica WHERE activo = 1';
            const queryEvaluaciones = 'SELECT COUNT(*) as total FROM rubrica_uso WHERE estado = "En Revision"';

            connection.query(queryDocentes, (err, resDocentes) => {
                if (err) return reject(err);
                
                connection.query(queryRubricas, (err, resRubricas) => {
                    if (err) return reject(err);
                    
                    connection.query(queryEvaluaciones, (err, resEvaluaciones) => {
                        if (err) return reject(err);
                        
                        resolve({
                            totalProfesores: resDocentes[0].total,
                            totalRubricas: resRubricas[0].total,
                            totalEvaluacionesPendientes: resEvaluaciones[0].total
                        });
                    });
                });
            });
        });
    }
}

module.exports = new DashboardModel();
