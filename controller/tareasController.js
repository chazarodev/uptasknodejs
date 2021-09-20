//Importar el modelo de proyectos y tareas para obtener sus datos
const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.agregarTarea = async (req, res, next) => {
    //Conocer la referencia del proyecto que se encuentra seleccionado
    const proyecto = await Proyectos.findOne({where: {url: req.params.url}});
    // console.log(proyecto);
    // console.log(req.body);
    //Leer el valor del input en el formulario de nueva tarea
    const {tarea} = req.body; //Nota: body se utiliza cuando son datos de un formulario.
    //Estado 0 igual a incompleto y ID del proyecto
    const estado = 0;
    const proyectoId = proyecto.id;
    //Insertar en la base de datos
    const resultado = await Tareas.create({tarea, estado, proyectoId});
    if (!resultado) {
        return next();
    }
    //Redireccionar
    res.redirect(`/proyectos/${req.params.url}`);
}

exports.cambiarEstadoTarea = async (req, res) => {
    const {id} = req.params;
    const tarea = await Tareas.findOne({
        where: {
            id
        }
    });

    //Cambiar el estado de la tarea
    let estado = 0;
    if (tarea.estado === estado) {
        estado = 1;
    }
    tarea.estado = estado;
    const resultado = await tarea.save();

    if (!resultado) return next();

    res.status(200).send('Actualizado');

}