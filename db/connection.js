const mysql = require('mysql2');

const db = mysql.createConnection({
        host: 'localhost',
        //Your MySQL username
        user: 'root',
        //Your MySQL password
        password: 'Osara23!',
        database: 'employee_db'
    },
    console.log('Connected to the employee_db database.')
);

module.exports = db;