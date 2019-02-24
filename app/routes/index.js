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


        //principal

      
        //vistas Medico
        
        app.get('/medico/home', function (req, res, next) { res.render('vista/medico/medicoInicio', { title: 'AdminX' }); });
        app.get('/medico/controlCitas', medicoController.verRegistroParaMedicos);
        app.get('/medico/nuevaConsulta', medicoController.pantallaNuevaConsulta);
        app.get('/medico/historialPaciente',  medicoController.historialPaciente);
               app.get('/medico/editar', medicoController.verEditarMedico);
        app.get('/lista/editar', medicoController.verEditar);
        app.post('/medico/guardarEditar', userController.modificarMedic);
  
  

        app.get('/medico/editar', medicoController.verEditarMedico);
        app.get('/usuario/misCitasMedico',  medicoController.misCitasMedico);

        app.post('/medico/guardarCita', medicoController.agendarCitaMedico);
        app.post('/guardarConsultaMedica', medicoController.guardarConsultaMedica);

        //Vistas Admin
        app.get('/admin/darDeBaja/:external',auth, medicoController.darBaja);
        app.get('/admin/darDeBajaUser/:external',auth, medicoController.darBajaUser);
        
        app.get('/admin/controlMedicos', function (req, res, next) { res.render('vista/admin/controlMedicos', { title: 'AdminX' }); });
        app.get('/admin/controlUsuarios', auth, adminUserController.verUsuarios);
        app.get('/admin/controlUsuarios/listados', auth, adminUserController.listarUsuarios);
        app.get('/admin/controlMedico/listados', auth, medicoController.listarMedicos);
        app.get('/admin/controlMedico/medicoPersona', auth, medicoController.listarMedicoPersona);
        app.post('/medico/guardar',
                passport.authenticate('local-signupMedic', {
                        successRedirect: '/admin/controlMedicos',
                        failureRedirect: '/login', failureFlash: true
                }
                ));





        //Vistas User s
        app.get('/usuario/home', function (req, res, next) { res.render('vista/usuario/usuarioHome', { title: 'AdminX' }); });
        app.get('/usuario/registroCita',userController.verRegistroMedicos );
        app.get('/usuario/verEditar', userController.verEditar);
        app.get('/usuario/historialMedico', function (req, res, next) { res.render('vista/usuario/historialMedico', { title: 'AdminX' }); });
        app.get('/usuario/miHistorial', userController.comprobarHistorial);
        app.get('/usuario/filtradoFecha/:external/:exter',  userController.filtrarCitas);
        app.get('/usuario/tablaCitas/:medico',  userController.datosCitaMedico);
        app.get('/usuario/quitar/:external',  userController.eliminarCita);
        app.get('/usuario/filtradoMedico/:external',  userController.filtrarCuentaMedico);
        app.get('/usuario/misCitas',  userController.misCitas);
        app.get('/usuario/misConsultas',  userController.misConsultas);
        app.get('/crearpdf/:data',userController.crearpdf);
        app.get('/carga',userController.abrirPdf); 


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

