//importar el modelo 
const Proyectos = require('../models/Proyectos');

//Este código del controlador es lo que se pasa como segundo parametro en el archivo de rutas
exports.proyectosHome = async (req, res) => {
    const proyectos = await Proyectos.findAll(); //Llama al modelo para Consultar la base de datos
    // res.send('index') Ahora que tenemos la carpeta de vistas, en lugar de ocupar .send, ocupamos .render
    res.render('index', {
        nombrePagina: 'Proyectos',
        proyectos //Una vez realizada la consulta llamando al modelo, pasamos los datos hacia la vista
    }); //Ahora accedemos a ./views/index.pug como primer parametro, y como segundo parametro las opciones que serán un objeto
}

exports.formularioProyecto = async (req, res) => {
    const proyectos = await Proyectos.findAll();
    res.render('nuevoProyecto', {
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    });
}

exports.nuevoProyecto = async (req, res) => {
    const proyectos = await Proyectos.findAll();
    //Acceder a la información escrita en el formulario y enviarlo a la consola
    // console.log(req.body) //Nota: para observar los datos en la consola debemos habilitar bodyParser(ver index.js)

    //Validar que existan datos en el input del formulario
    const {nombre} = req.body

    let errores = [];

    if (!nombre) {
        errores.push({'texto': 'Agrega un nombre al proyecto'});
    }

    //Si hay errores
    if (errores.length > 0) {
        res.render('nuevoProyecto' , {
            nombrePagina: 'Nuevo Proyecto',
            errores, //Enviar los errores hacía la vista
            proyectos
        });
    } else {
        //Generar la url
        // const url = slug(nombre).toLowerCase(); Se modifica el código para insertar hooks de sequelize (ver Proyectos.js)
        //Insertar el nombre escritos en el formulario a la base de datos e insertar la urll generada con slug
        const proyecto = await Proyectos.create({nombre});
        res.redirect('/');
    }
}

exports.proyectoPorUrl = async (req, res, next) => {
    const proyectos = await Proyectos.findAll();
    // res.send(req.params.url) //url corresponde al comodin de la ruta del metodo get en index.js
    const proyecto = await Proyectos.findOne({
        where: {
            url: req.params.url
        }
    });

    if (!proyecto) {
        return next();
    }

    //render a la vista
    res.render('tareas', {
        nombrePagina: 'Tareas del Proyecto',
        proyecto,
        proyectos
    });
}