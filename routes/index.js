const express = require('express');
const router = express.Router();

//importar express validator, valida los datos ingresados en el formulario por el usuario
const {body} = require('express-validator/check');

//importar el controlador
const proyectosController = require('../controller/proyectosController');
const tareasController = require('../controller/tareasController');
const usuariosController = require('../controller/usuariosController');
const authController = require('../controller/authController');

module.exports = function() {
    //Definir las rutas que se mostraran
    router.get('/', 
        authController.usuarioAutenticado,
        proyectosController.proyectosHome
    ); //Realizar llamada al controlador
    // res.send('Hola'); // Nota: El parametro del send a ejecutar es tarea del controlador
    //Es lo que se conoce como el Middleware de express

    router.get('/nuevo-proyecto', 
        authController.usuarioAutenticado,
        proyectosController.formularioProyecto
    )
    router.post('/nuevo-proyecto', 
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.nuevoProyecto
    );

    //Listar proyecto
    router.get('/proyectos/:url',
        authController.usuarioAutenticado, 
        proyectosController.proyectoPorUrl
    ); //comodin :url lo pasamos a proyectosController.js

    //Actualizar el proyecto
    router.get('/proyecto/editar/:id',
        authController.usuarioAutenticado, 
        proyectosController.formularioEditar
    );
    router.post('/nuevo-proyecto/:id', 
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.actualizarProyecto
    );

    //Eliminar proyecto
    router.delete('/proyectos/:url', 
        authController.usuarioAutenticado,
        proyectosController.eliminarProyecto
    );

    //Routes para las tareas
    router.post('/proyectos/:url', 
        authController.usuarioAutenticado,
        tareasController.agregarTarea
    );

    //Actualizar tarea
    router.patch('/tareas/:id', 
        authController.usuarioAutenticado,
        tareasController.cambiarEstadoTarea
    );

    //Eliminar Tarea
    router.delete('/tareas/:id', 
        authController.usuarioAutenticado,
        tareasController.eliminarTarea
    );

    //Crear nueva cuenta
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', usuariosController.crearCuenta);
    router.get('/confirmar/:correo', usuariosController.confirmarCuenta);

    //Iniciar sesión
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);

    //cerrar sesión
    router.get('/cerrar-sesion', authController.cerrarSesion);

    //Reestablecer contrasenia
    router.get('/reestablecer', usuariosController.formReestablecerPassword);
    router.post('/reestablecer', authController.enviarToken);
    router.get('/reestablecer/:token', authController.validarToken);
    router.post('/reestablecer/:token', authController.actualizarPassword);

    return router;

    //Nota: app.use es reemplazado por router.verbo
}
