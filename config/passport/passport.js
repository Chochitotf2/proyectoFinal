var bCrypt = require('bcrypt-nodejs');
const uuidv4 = require('uuid/v4');
var models = require('../../app/models');
var Medico = models.medico;


module.exports = function (passport, cuenta, persona, rol) {
    var Cuenta = cuenta;//modelo
    var Persona = persona;//modelo
    var Rol = rol;
    var LocalStrategy = require('passport-local').Strategy;

    passport.serializeUser(function (cuenta, done) {
        done(null, cuenta.id);
    });
    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        Cuenta.findOne({ where: { id: id }, include: [{ model: Persona, include: { model: Rol } }] }).then(function (cuenta) {
            if (cuenta) {
                var userinfo = {
                    id: cuenta.id,
                    id_cuenta: cuenta.external_id,
                    id_persona: cuenta.persona.external_id,
                    nombre: cuenta.persona.apellido + " " + cuenta.persona.nombre,
                    rol: cuenta.persona.rol.nombre,
                    estadoHistorial: cuenta.persona.estado_historial,
                    estado :cuenta.estado
                };
                console.log(userinfo);
                done(null, userinfo);
            } else {
                done(cuenta.errors, null);
            }
        });

    });
    //registro de usuarios por passport
    passport.use('local-signup', new LocalStrategy(
        {
            usernameField: 'correo', //lo que esta como name en el input del registro
            passwordField: 'clave', //lo que esta como name en el input del registro
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, email, password, done) {
            var generateHash = function (password) {
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
            };
            //verificar si el email no esta registrado
            Persona.findOne({where: { cedula: req.body.cedula }
            }).then(function (cuenta1) {
               if(cuenta1){
                   return done(null, false, {
                       message: req.flash('correo_repetido', 'Cedula ya registrada')
                   });
               }else{
                Cuenta.findOne({
                    where: {
                        correo: email
                    }
                }).then(function (cuenta) {
                    if (cuenta) {
                        return done(null, false, {
                            message: req.flash('correo_repetido', 'El correo ya esta regisrado')
                        });
    
                    } else {
                        var userPassword = generateHash(password);
                        Rol.findOne({
                            where: { nombre: 'usuario' }
                        }).then(function (rol) {
                            if (rol) {
                                var dataPersona =
                                {
                                    nombre: req.body.nombre,
                                    apellido: req.body.apellido,
                                    cedula: req.body.cedula,
                                    correo: req.body.correo,
                                    direccion: req.body.direccion,
                                    genero: req.body.genero,
                                    telefono: req.body.telefono,
                                    edad: req.body.edad,
                                    estado_civil: req.body.estadoCivil,
                                    nacionalidad: req.body.nacionalidad,
                                    external_id: uuidv4(),
                                    id_rol: rol.id
                                };
                                Persona.create(dataPersona).then(function (newPersona, created) {
                                    if (!newPersona) {
    
                                        return done(null, false);
                                    }
                                    if (newPersona) {
                                        console.log("Se ha creado la persona: " + newPersona.id);
                                        var dataCuenta = {
                                            correo: email,
                                            clave: userPassword,
                                            id_persona: newPersona.id,
                                            external_id: uuidv4()
                                        };
                                        Cuenta.create(dataCuenta).then(function (newCuenta, created) {
                                            if (newCuenta) {
                                                console.log("Se ha creado la cuenta: " + newCuenta.id);
                                                return done(null, newCuenta);
                                            }
                                            if (!newCuenta) {
                                                console.log("cuenta no se pudo crear");
                                                return done(null, false);
                                            }
    
                                        });
                                    }
                                });
                            } else {
                                return done(null, false, {
                                    message: 'El rol no existe'
                                });
                            }
                        });
    
                    }
                });


               }
           });



         
        }
    ));


    //registro medic
    passport.use('local-signupMedic', new LocalStrategy(
        {
            usernameField: 'cuenta', //lo que esta como name en el input del registro
            passwordField: 'clave', //lo que esta como name en el input del registro
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, email, password, done) {
            var generateHash = function (password) {
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
            };
            //verificar si el email no esta registrado
            Persona.findOne({where: { cedula: req.body.cedula }
            }).then(function (cuenta1) {
               if(cuenta1){
                   return done(null, false, {
                       message: req.flash('correo_repetido', 'Cedula ya registrada')
                   });
               }else{
                Cuenta.findOne({
                    where: {
                        correo: email
                    }
                }).then(function (cuenta) {
                    if (cuenta) {
    
                        return done(null, false, {
                            message: req.flash('correo_repetido', 'El correo ya esta regisrado')
                        });
    
                    } else {
                        var userPassword = generateHash(password);
                        Rol.findOne({
                            where: { nombre: 'medico' }
                        }).then(function (rol) {
                            if (rol) {
                                var dataPersona =
                                {
                                    nombre: req.body.nombre,
                                    apellido: req.body.apellido,
                                    cedula: req.body.cedula,
                                    correo: req.body.correo,
                                    direccion: req.body.direccion,
                                    genero: req.body.genero,
                                    telefono: req.body.telefono,
                                    edad: req.body.edad,
                                    estado_civil: req.body.estadoCivil,
                                    nacionalidad: req.body.nacionalidad,
                                    external_id: uuidv4(),
                                    id_rol: rol.id
                                };
                                Persona.create(dataPersona).then(function (newPersona, created) {
                                    if (!newPersona) {
    
                                        return done(null, false);
                                    }
                                    if (newPersona) {
                                        console.log("Se ha creado la persona: " + newPersona.id);
                                        var dataCuenta = {
                                            correo: email,
                                            clave: userPassword,
                                            id_persona: newPersona.id,
                                            external_id: uuidv4()
                                        };
                                        var dataMedico = {
                                            id: newPersona.id,
                                            especialidad: req.body.especialidad,
                                            nro_consultorio: req.body.consultorio
                                        };
                                        Cuenta.create(dataCuenta).then(function (newCuenta, created) {
                                            if (newCuenta) {
                                                console.log("Se ha creado la cuenta: " + newCuenta.id);
                                                return done(null, newCuenta);
                                            }
                                            if (!newCuenta) {
                                                console.log("cuenta no se pudo crear");
                                                return done(null, false);
                                            }
    
                                        });
                                        Medico.create(dataMedico).then(function (newMedico, created) {
                                            if (newMedico) {
                                                console.log("Se ha creado el medico: " + newMedico.id);
                                                return (newMedico);
                                            }
                                            if (!newMedico) {
                                                console.log("So se pudo crear medico lol xD");
    
                                            }
    
                                        });
    
                                    }
                                });
                            } else {
                                return done(null, false, {
                                    message: 'El rol no existe'
                                });
                            }
                        });
    
                    }
                });



               }
            });
          
        }
    ));
    //inicio de sesion
    passport.use('local-signin', new LocalStrategy(
        {
            usernameField: 'correo',
            passwordField: 'clave',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, email, password, done) {
            var Cuenta = cuenta;
            var isValidPassword = function (userpass, password) {
                return bCrypt.compareSync(password, userpass);
            }
            Cuenta.findOne({ where: { correo: email } }).then(function (cuenta) {
                if (!cuenta) {
                    return done(null, false, { message: req.flash('err_cred', 'Cuenta no existe') });
                }

                if (!isValidPassword(cuenta.clave, password)) {
                    return done(null, false, { message: req.flash('err_cred', 'Clave incorrecta') });
                }

                //   req.session.external = cuenta.external_id;

                var userinfo = cuenta.get();
                //console.log(userinfo);
                return done(null, userinfo);

            }).catch(function (err) {
                console.log("Error:", err);
                return done(null, false, { message: req.flash('err_cred', 'Cuenta erronea') });
            });
        }
    ));
}