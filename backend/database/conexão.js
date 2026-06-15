const mysql = require("mysql2");
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "Barbearia_prime"
// });

db.connect((err) => {
    if (err) {
        console.log("Erro ao conectar:", err);
    } else {
        console.log("Conectado ao MySQL!");
    }
});

module.exports = db;