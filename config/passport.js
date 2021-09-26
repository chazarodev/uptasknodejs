const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Referencia al modelo a autenticar
const Usuarios = require('../models/Usuarios');

//Local strategy - Login con credenciales propias (usuario y passsword)
passport.use(
    new LocalStrategy(
        //Por deafult passport espera un usuario y password
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: {
                        email,
                        activo: 1
                    }
                });
                //Usuario existe, password incorrecto
                if (!usuario.verificarPassword(password)) {
                    return done(null, false, {
                        message: 'Datos ingresados son incorrectos'
                    });    
                }
                //El email existe y el password es correcto
                return done(null, usuario)
            } catch (error) {
                //Usuario no existe
                return done(null, false, {
                    message: 'Datos ingresados son incorrectos'
                })
            }
        }
    )
)

//Serializar el usuario
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
})

//deserializar el usuario
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
})

//exportar
module.exports = passport;