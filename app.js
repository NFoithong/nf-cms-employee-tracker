const mysql = require('mysql2');
const inquirer = require('inquirer');
const express = require('express');
const cTable = require('console.table');
const db = require('./db/connection');
const PORT = process.env.PORT || 8080;
const app = express();

//Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Default response for any other request (NOT FOUND)
app.use((req, res) => { res.status(404).end() });

//Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});