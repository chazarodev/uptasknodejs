const Sequelize = require('sequelize');
//importar la configuración de la base de datos
const db = require('../config/db');
//importar dependencia slug para las urls
const slug = require('slug');
//imprtar dependencia para generar id
const shortid = require('shortid');

//Configuración del modelo
const Proyectos = db.define('proyectos', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: Sequelize.STRING(100)
    },
    url: {
        type: Sequelize.STRING(100)
    }
}, {
    hooks: {
        beforeCreate(proyecto) {
            const url = slug(proyecto.nombre).toLowerCase();
            proyecto.url = `${url}-${shortid.generate()}`
        },
    }
});

module.exports = Proyectos;