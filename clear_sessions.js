const pool = require('./model/conexion');

function clearAllSessions() {
    pool.query('UPDATE usuario SET session_token = NULL', (error, result) => {
        if (error) {
            console.error('Error al intentar cerrar las sesiones:', error);
        } else {
            console.log(`Se cerraron exitosamente ${result.affectedRows} sesiones abiertas.`);
        }
        process.exit(0);
    });
}

clearAllSessions();
