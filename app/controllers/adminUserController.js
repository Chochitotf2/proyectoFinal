'use strict';
var models = require('./../models');
var Persona = models.persona;
var Cuenta = models.cuenta;
var Rol = models.rol;
const uuidv4 = require('uuid/v4');
class adminUserController {
    
    verUsuarios(req, res) {
        

        Persona.findAll({where: {id_rol: 1},include: {model: models.cuenta}}).then(function (persona) {
            res.render('vista/admin/controlUsuarios', {lista: persona });

        }).catch(function (err) {
            console.log("Error:", err);

        });

    }

    listarUsuarios(req, res) {
        

        Persona.findAll({where: {id_rol: 1},include: {model: models.cuenta}}).then(function (persona) {
            res.send(persona);

        }).catch(function (err) {
            console.log("Error:", err);

        });

    }

 



}
module.exports = adminUserController;