const mysql = require('mysql2');

/*const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'mysql-sistems.alwaysdata.net',
    user: 'sistems',
    password: '31466704',
    database: 'sistems_sgr'
});*/

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sistems_sgr',
    port: process.env.DB_PORT || 3306
});

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('La conexión a la base de datos fue cerrada.');
        } else if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('La base de datos tiene demasiadas conexiones.');
        } else if (err.code === 'ECONNREFUSED') {
            console.error('La conexión a la base de datos fue rechazada.');
        } else {
            console.error('Error al conectar a la base de datos:', err);
        }
    } else {
        console.log('Conectado a la pool de base de datos exitosamente');
        connection.release();
    }
});

module.exports = pool;
