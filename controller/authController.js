const passport = require('passport');

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