'use strict';
var models = require('../models');
var Persona = models.persona;
var Medico   = models.medico;
var Rol = models.rol;
var Cuenta = models.cuenta;
const uuidv4 = require('uuid/v4');
class MedicoController {
    verMedico(req, res) {
        res.render('/vista/medico/medicoInicio')
    }

    guardar(req, res) {
        Rol.findOne({
            where: {nombre: 'medico'}
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
                            correo: req.body.correo,
                            clave: req.body.clave,
                            id_persona: newPersona.id,
                            external_id: uuidv4()
                        };
                        var dataMedico = {
                            id : persona.id,
                            especialidad: req.body.especialidad,
                            max_turnos: req.body.maximo,
                            nro_consultorio: req.body.nroConsultorio,
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
                                console.log("Se ha creado la cuenta: " + newMedico.id);
                                return done(null, newMedico);
                            }
                            if (!newMedico) {
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

   

   

  



}
module.exports = MedicoController;