const Sequelize = require('sequelize');

//Configurar la base de datos
const db = new Sequelize('uptasknode', 'root', 'admin', {
    host: 'localhost',
    dialect: 'mysql',
    port: '3306',
    operatorAliases: false,
    define: {
        timestamps: false
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 3000,
        idle: 10000
    }
});

module.exports = db;