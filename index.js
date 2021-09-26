const express = require('express');
const router = require('./routes');
const path = require('path'); //lee los archivos que existen en las carpetas, es decir, una forma de acceder a ellos.
const bodyParser = require('body-parser');
// const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');

//importar helpers con funciones
const helpers = require('./helpers');

//Crear la conexión a la base de datos
const db = require('./config/db');

//Importar el modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync() //Nota: authenticate conecta a la bd, mientras que sync, genera las tablas en la base de datos
    .then(() => console.log('Conectado al servidor'))
    .catch(error => console.log(error));
    
//Crear una aplicación de express
const app = express();

//Indicar de que ruta cargar los archivos estáticos
app.use(express.static('public'));

//Habilitar template engine pug
app.set('view engine', 'pug');

//habilitar bodyParser para leer datos del formulario
app.use(bodyParser.urlencoded({extended: true}));

//Agregar express validator a toda la aplicación
// app.use(expressValidator());

//Habilitar carpeta de las vistas
app.set('views', path.join(__dirname, './views')); //Acceder al directorio principal (dirname) a la carpeta de views

//Agregar flash messages
app.use(flash());

app.use(cookieParser());

//Permite navegar entre las distintas páginas sin tener que autenticarse el usuario de nuevo
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

//Pasar var dump a la aplicación
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump; //Nota: esto nos ayuda a crear variables y consumirlas en cualquier otro archivo del proyecto
    res.locals.mensajes = req.flash();
    next(); //Next ejecuta el siguiente middleware
})

app.use('/', router());

//Indica en cuál puerto correr la aplicación
app.listen(3000);