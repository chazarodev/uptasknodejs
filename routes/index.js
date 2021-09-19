const express = require('express');
const router = express.Router();

//importar express validator, valida los datos ingresados en el formulario por el usuario
const {body} = require('express-validator/check');

//importar el controlador
const proyectosController = require('../controller/proyectosController');

module.exports = function() {
    //Definir las rutas que se mostraran
    router.get('/', proyectosController.proyectosHome); //Realizar llamada al controlador
    // res.send('Hola'); // Nota: El parametro del send a ejecutar es tarea del controlador
    //Es lo que se conoce como el Middleware de express

    router.get('/nuevo-proyecto', proyectosController.formularioProyecto)
    router.post('/nuevo-proyecto', 
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.nuevoProyecto
    );

    //Listar proyecto
    router.get('/proyectos/:url', proyectosController.proyectoPorUrl); //comodin :url lo pasamos a proyectosController.js

    return router;

    //Nota: app.use es reemplazado por router.verbo
}
