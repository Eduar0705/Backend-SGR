const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'mysql-sistems.alwaysdata.net',
    user: 'sistems',
    password: '31466704',
    database: 'sistems_sgr'
});

const pool1 = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sgr'
});

// Test connection
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
