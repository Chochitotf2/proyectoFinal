var express = require('express');
var app = express.Router();
var passport = require('passport');




var cuenta = require('../controllers/cuentaController');
var cuentaController = new cuenta();

module.exports = function (app, passport) {

  //vistas Medico
  app.get('/medico/home', function (req, res, next) { res.render('vista/medico/medicoInicio', { title: 'AdminX' }); });
  app.get('/medico/controlCitas', function (req, res, next) { res.render('vista/medico/controlCitas', { title: 'AdminX' }); });
  app.get('/medico/nuevaConsulta', function (req, res, next) { res.render('vista/medico/nuevaConsulta', { title: 'AdminX' }); });
  app.get('/medico/historialPaciente', function (req, res, next) { res.render('vista/medico/historialPaciente', { title: 'AdminX' }); });
  app.get('/medico/datosPersonales', function (req, res, next) { res.render('vista/medico/datosPersonales', { title: 'AdminX' }); });



  //Vistas Admin
  app.get('/admin/controlMedicos', function (req, res, next) { res.render('vista/admin/controlMedicos', { title: 'AdminX' }); });
  app.get('/admin/controUsuarios', function (req, res, next) { res.render('vista/admin/controUsuarios', { title: 'AdminX' }); });


  //Vistas User 
  app.get('/usuario/home', function (req, res, next) { res.render('vista/usuario/usuarioHome', { title: 'AdminX' }); });
  app.get('/usuario/registroCita', function (req, res, next) { res.render('vista/usuario/registroCita', { title: 'AdminX' }); });
  app.get('/usuario/perfilMedico', function (req, res, next) { res.render('vista/usuario/perfilMedico', { title: 'AdminX' }); });
  app.get('/usuario/historialMedico', function (req, res, next) { res.render('vista/usuario/historialMedico', { title: 'AdminX' }); });


  
  app.get('/registro', cuentaController.verRegistro);
  app.get('/cerrar_sesion' , cuentaController.cerrar)
  app.get('/login', cuentaController.verLogin);

  app.post('/registro/guardar',
          passport.authenticate('local-signup', {successRedirect: '/login',
              failureRedirect: '/registro', failureFlash: true}
          ));
app.post('/login/iniciar',
        passport.authenticate('local-signin',
                {successRedirect: '/usuario/home',
                    failureRedirect: '/login',
                    failureFlash: true}
        ));





}

