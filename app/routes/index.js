var express = require('express');
var app = express.Router();
var passport = require('passport');




var cuenta = require('../controllers/cuentaController');
var cuentaController = new cuenta();

var medico = require('../controllers/medicoController');
var medicoController = new medico();

var adminUser = require('../controllers/adminUserController');
var adminUserController = new adminUser();

var user = require('../controllers/userController');
var userController = new user();


module.exports = function (app, passport) {

        var auth = function middleWare(req, res, next) {
                if (req.isAuthenticated()) {
                        next();
                } else {
                        alert('err_cred', 'Inicia sesion!!!');
                        res.redirect('/login');
                }
        }
        var authUsuario = function middleWare(req, res, next) {
                if (req.user.rol == 'usuario') {
                        if (req.user.estado ==true) {
                                next();
                        }else{
                                res.redirect('/nop');
                        }
                     
                } else {
                        //  alert('err_cred', 'Inicia sesion!!!');
                        res.redirect('/upps');
                }
        }
        var authUsuario2 = function middleWare(req, res, next) {
                if (req.user.estadoHistorial) {
                        next();
                } else {
                        //  alert('err_cred', 'Inicia sesion!!!');
                        res.redirect('/usuario/miHistorial');
                }
        }
        var authUsuario3 = function middleWare(req, res, next) {
                if (req.user.rol == 'medico') {
                        if (req.user.estado ==true) {
                                next();
                        }else{
                                res.redirect('/nop');
                        }
                } else {
                        //  alert('err_cred', 'Inicia sesion!!!');
                        res.redirect('/upps');
                }
        }
        var authUsuario4 = function middleWare(req, res, next) {
                if (req.user.rol == 'administrador') {
                        next();
                } else {
                        //  alert('err_cred', 'Inicia sesion!!!');
                        res.redirect('/upps');
                }
        }
        app.get('/nop', function (req, res, next) { res.render('indexnop', { title: 'AdminX' }); });

        app.get('/home', function (req, res, next) { res.render('index', { title: 'AdminX' }); });


        // medico no agregar auth
        app.get('/medico/misConsultas/:external', medicoController.misConsultas);
        app.get('/usuario/misCitasMedico', medicoController.misCitasMedico);


        //vistas Medico
        app.get('/medico/home', auth, authUsuario3, function (req, res, next) { res.render('vista/medico/medicoInicio', { title: 'AdminX' }); });
        app.get('/medico/controlCitas', auth, authUsuario3, medicoController.verRegistroParaMedicos);
        app.get('/medico/nuevaConsulta', auth, authUsuario3, medicoController.pantallaNuevaConsulta);
        app.get('/medico/historialPaciente', auth, authUsuario3, medicoController.historialPaciente);
        app.get('/medico/editar', auth, authUsuario3, medicoController.verEditarMedico);

        app.post('/medico/guardarCita', authUsuario3, medicoController.agendarCitaMedico);
        app.post('/guardarConsultaMedica', authUsuario3, medicoController.guardarConsultaMedica);


        app.get('/upps', function (req, res, next) { res.render('ups', { title: 'AdminX' }); });

        app.get('/lista/editar', medicoController.verEditar);
        app.post('/medico/guardarEditar', userController.modificarMedic);

        //Vistas Admin
        app.get('/admin/controlMedicos', authUsuario4, function (req, res, next) { res.render('vista/admin/controlMedicos', { title: 'AdminX' }); });
        app.get('/admin/controlUsuarios', auth, authUsuario4, adminUserController.verUsuarios);
        app.get('/admin/controlUsuarios/listados', auth, adminUserController.listarUsuarios);
        app.get('/admin/controlMedico/listados', auth, medicoController.listarMedicos);
        app.get('/admin/controlMedico/medicoPersona', auth, medicoController.listarMedicoPersona);
        app.post('/medico/guardar',
                passport.authenticate('local-signupMedic', {
                        successRedirect: '/admin/controlMedicos',
                        failureRedirect: '/login', failureFlash: true
                }
                ));

        app.get('/admin/darDeBaja/:external', auth, medicoController.darBaja);
        app.get('/admin/darDeBajaUser/:external', auth, medicoController.darBajaUser);



        //ajax no  agregar  auth
        app.get('/usuario/filtradoFecha/:external/:exter', userController.filtrarCitas);
        app.get('/usuario/tablaCitas/:medico', userController.datosCitaMedico);
        app.get('/crearpdf/:data', userController.crearpdf);
        app.get('/carga', userController.abrirPdf);
        app.get('/crearpdfReceta/:data', userController.crearpdfReceta);
        app.get('/cargaReceta', userController.abrirPdfReceta);
        app.get('/usuario/quitar/:external', userController.eliminarCita);
        app.get('/usuario/filtradoMedico/:external', userController.filtrarCuentaMedico);
        app.get('/usuario/misCitas', userController.misCitas);
        app.get('/usuario/misConsultas', userController.misConsultas);
        app.get('/usuario/verEditar', userController.verEditar);
        //Vistas User 
        app.get('/usuario/home', auth, authUsuario, authUsuario2, function (req, res, next) { res.render('vista/usuario/usuarioHome', { title: 'AdminX' }); });
        app.get('/usuario/registroCita', auth, authUsuario, authUsuario2, userController.verRegistroMedicos);
        app.get('/usuario/historialMedico', auth, authUsuario, authUsuario2, function (req, res, next) { res.render('vista/usuario/historialMedico', { title: 'AdminX' }); });
        app.get('/usuario/miHistorial', auth, authUsuario, userController.comprobarHistorial);


        app.post('/usuario/guardaHistorial', userController.guardarHistorial);
        app.post('/usuario/guardarEditar', userController.modificarPerson);
        app.post('/usuario/guardarCita', userController.agendarCita);



        app.get('/registro', cuentaController.verRegistro);
        app.get('/cerrar_sesion', cuentaController.cerrar)
        app.get('/login', cuentaController.verLogin);
        app.get('/redireccion', function (req, res, next) { res.render('vista/redireccion', { rol: req.user.rol, estado: req.user.estadoHistorial }); });

        app.post('/registro/guardar',
                passport.authenticate('local-signup', {
                        successRedirect: '/login',
                        failureRedirect: '/registro', failureFlash: true
                }
                ));
        app.post('/login/iniciar',
                passport.authenticate('local-signin',
                        {
                                successRedirect: '/redireccion',
                                failureRedirect: '/login',
                                failureFlash: true
                        }
                ));





}

