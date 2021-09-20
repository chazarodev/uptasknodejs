const Sequelize = require('sequelize');
const db = require('../config/db');

//Importar el modelo de proyectos para relacionar las tablas
const Proyectos = require('./Proyectos');

const Tareas = db.define('tareas', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    tarea: {
        type: Sequelize.STRING(100)
    },
    estado: {
        type: Sequelize.INTEGER(1)
    }
})
Tareas.belongsTo(Proyectos); //Relaciona la tabla tares con proyectos, la otra forma es con el método hasmany

module.exports = Tareas;