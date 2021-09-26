//importar el modelo donde se guardarán los datos
const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handler/email');

exports.formCrearCuenta = (req, res) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear cuenta en Uptask'
    });
}

exports.formIniciarSesion = (req, res) => {
    // console.log(res.locals.mensajes);
    const {error} = res.locals.mensajes;
    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar sesión en Uptask',
        error
    });
}

exports.crearCuenta = async (req, res) => {
    //Leer los datos del formulario
    const {email, password} = req.body;

    try {
        //crear el usuario
        await Usuarios.create({
            email,
            password
        });

        //crear un URL de confirmacion
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        //Crear el objeto de usuario
        const usuario = {
            email
        }

        //Enviar email
        enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta',
            confirmarUrl,
            archivo: 'confirmar-cuenta'
        });

        //Redirigir al usuario
        req.flash('correcto', 'Accede a tu correo para confirmar la cuenta');
        res.redirect('/iniciar-sesion');   
    } catch (error) {
        req.flash('error', error.errors.map(error => error.message));
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina: 'Crear cuenta en Uptask',
            email,
            password
        });
    }
}

exports.formReestablecerPassword = (req, res, next) => {
    res.render('reestablecer', {
        nombrePagina: 'Reestablece tu password'
    });
}

//Cambia el estado de una cuenta
exports.confirmarCuenta = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    });
    //Si no existe el usuario
    if (!usuario) {
        req.flash('error', 'No válido');
        res.redirect('/crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'Cuenta activada correctamente');
    res.redirect('/iniciar-sesion');
}