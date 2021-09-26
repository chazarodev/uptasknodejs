const passport = require('passport');
//Importar modelo de usuarios
const Usuarios = require('../models/Usuarios');
const Sequelize = require('sequelize');
const Op = Sequelize.Op
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handler/email');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});

//Función que revisa si el usuario se encuentra logeado
exports.usuarioAutenticado = (req, res, next) => {
    //Usuario autenticado
    if (req.isAuthenticated()) {
        return next();
    }
    
    //Usuario no autenticado
    return res.redirect('/iniciar-sesion');
}

//función para cerrar sesion
exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion'); //cerrar sesion, redirige a iniciar sesion
    })
}

//Genera un token si el usuario es valido
exports.enviarToken = async (req, res) => {
    //Verificar que el usuario existe
    const {email} = req.body;
    const usuario = await Usuarios.findOne({where: {email}});
    //Si no existe el usuario
    if (!usuario) {
        req.flash('error', 'Correo no válido')
        res.render('reestablecer', {
            nombrePagina: 'Reestablecer tu contraseña',
            mensajes: req.flash()
        });
    }

    //Usuario existe
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000; //Una hora para expirar

    //Guardarlos en la base de datos
    await usuario.save();

    //url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

    //Enviar el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'reestablecer-password'
    });

    //Terminar la ejecucíon
    req.flash('correcto', 'Se envió el enlace a tu correo');
    res.redirect('/iniciar-sesion');
}

//Validar token
exports.validarToken = async (req, res) => {
    // res.json(req.params.token);
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    });
    //Si no se encuentra al usuario
    if (!usuario) {
        req.flash('error', 'No válido');
        res.redirect('/reestablecer');
    }
    //Formulario para generar el password
    res.render('resetPassword', {
        nombrePagina: 'Reestablecer Contraseña'
    });
}

//Reestablecer password
exports.actualizarPassword = async (req, res) => {
    //Verificar que el token y la fecha de expiracion sean validos
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte]: Date.now()
            }
        }
    });

    //Verificar si el usuario existe
    if (!usuario) {
        req.flash('error', 'No válido');
        res.redirect('/reestablecer');
    }

    //Hashear el nuevo password, eliminar token y expiracion de la instancia de usuario
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;

    //Guardar el nuevo password
    await usuario.save() //Nota: Cuando se genera una instancia del modelo, no es necesario generar la consulta para actualizar la bd.
    //Con el códifo usuario.save() basta para guardar la información actualizada

    req.flash('correcto', 'Tu password se actualizó correctamente');
    res.redirect('/iniciar-sesion');
}

