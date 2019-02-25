'use strict';
var models = require('../models');
var Persona = models.persona;
var Medico = models.medico;
var Rol = models.rol;
var Cuenta = models.cuenta;
const uuidv4 = require('uuid/v4');

var pdf = require('html-pdf');
var Historial = models.historial;
var Consulta = models.consulta_medica;
var Cita = models.cita;
var Receta = models.receta;

var forEach = require('sync-each');

var async = require("async");



class MedicoController {
    verMedico(req, res) {
        res.render('/vista/medico/medicoInicio')
    }



    listarMedicos(req, res) {


        Medico.findAll().then(function (medico) {
            res.send(medico);

        }).catch(function (err) {
            console.log("Error:", err);

        });

    }

    listarMedicoPersona(req, res) {

        var lista = [];
        Persona.findAll({ where: { id_rol: 3 }, include: { model: models.cuenta } }).then(function (medicoPersona) {
            Medico.findAll({}).then(function (medico) {
                lista.push(medicoPersona);
                lista.push(medico);
                console.log(lista);
                res.send(lista);

            }).catch(function (err) {
                console.log("Error:", err);

            });

        }).catch(function (err) {
            console.log("Error:", err);

        });

    }

    verEditar(req, res) {

        var lista = [];
        Persona.findOne({ where: { external_id: req.user.id_persona }, include: { model: models.cuenta } }).then(function (medicoPersona) {
            Medico.findOne({ where: { id: req.user.id } }).then(function (medico) {

                lista.push(medicoPersona);
                lista.push(medico);
                res.send({ lista: lista });
                console.log({ lista: lista });


            }).catch(function (err) {
                console.log("Error:", err);

            });


        }).catch(function (err) {
            console.log("Error:", err);
            res.redirect('/medico/home');
        });


    }


    verEditarMedico(req, res) {

        var lista = [];
        Persona.findOne({ where: { external_id: req.user.id_persona }, include: { model: models.cuenta } }).then(function (medicoPersona) {
            Medico.findOne({ where: { id: req.user.id } }).then(function (medico) {

                lista.push(medicoPersona);
                lista.push(medico);
                res.render('vista/medico/perfilMedico', { lista: lista });
                console.log({ lista: lista });


            }).catch(function (err) {
                console.log("Error:", err);

            });


        }).catch(function (err) {
            console.log("Error:", err);
            res.redirect('/medico/home');
        });


    }

    darBaja(req, res) {
   
        var external = req.params.external;


        Cuenta.findOne({  where: { external_id: external } }).then(function (medico) {
            if (medico) {
              if(medico.estado==true){
                var estados = false;
              }else{
                var estados = true;
              }
              Cuenta.update({
                estado: estados
            }, { where: { external_id: external } }).then(function (updatedCuenta, created) {
                if (updatedCuenta) {

                    req.flash('info', 'Se ha dado de baja correctamente', false);
                    res.redirect('/admin/controlUsuarios');
                }
            });         }


        }).catch(function (err) {
            console.log("Error:", err);

        });

    }


    darBajaUser(req, res) {
        var external = req.params.external;


        Cuenta.findOne({  where: { external_id: external } }).then(function (medico) {
            if (medico) {
              if(medico.estado==true){
                var estados = false;
              }else{
                var estados = true;
              }
              Cuenta.update({
                estado: estados
            }, { where: { external_id: external } }).then(function (updatedCuenta, created) {
                if (updatedCuenta) {

                    req.flash('info', 'Se ha dado de baja correctamente', false);
                    res.redirect('/admin/controlUsuarios');
                }
            });         }


        }).catch(function (err) {
            console.log("Error:", err);

        });



    }


    misCitasMedico(req, res) {//id del medico cuabndo inicie session
        Cita.findAll({ where: { external_medico: req.user.id }, include: { model: models.persona }, order: [["fecha", "ASC"]] }).then(function (citas) {
            if (citas) {
                res.status(200).json(citas);
            }
        });
    }
    verRegistroParaMedicos(req, res) {
        var lista = [];
        Persona.findAll({ where: { id_rol: 3 }, include: { model: models.rol } }).then(function (medicos) {
            if (medicos) {//id_persona id de la persona que inicio sesion
                Cita.findAll({ where: { external_medico: req.user.id }, include: { model: models.persona } }).then(function (citas) {
                    if (citas) {
                        Persona.findAll({ where: { id_rol: 1 }, include: { model: models.rol } }).then(function (usuario) {
                            if (usuario) {
                                res.render('vista/medico/controlCitas',
                                    {
                                        title: 'AdminX',
                                        citasMedicas: citas,
                                        listaP: usuario,
                                        lista: medicos
                                    });
                            }
                        });
                        //  lista.push(item.external_medico);

                    }
                });
            }
        });
    }
    agendarCitaMedico(req, res) {

        if (req.body.external_verificar == 'guarda') {
            Cita.create({
                external_medico: req.body.medico,
                hora: req.body.hora,
                fecha: req.body.fecha,
                estado: true,
                external_horario: 'ninguno',
                external_id: uuidv4(),
                id_persona: req.body.usuario  //id_persona id del la persona que agenda la cita

            }).then(function (newHistorial, created) {
                if (newHistorial) {
                    console.log('se ah registrado una cita');
                    // req.flash('info', 'Se ha creado correctamente');
                    res.redirect('/medico/controlCitas');

                }
            });

        } else {
            Cita.update({
                hora: req.body.hora,
                fecha: req.body.fecha
            }, { where: { external_id: req.body.external_modificar } }).then(function (updatedVino, created) {
                if (updatedVino) {
                    // req.flash('info', 'Se ha creado correctamente', false);
                    res.redirect('/medico/controlCitas');
                }
            });
        }

    }





    guardarConsultaMedica(req, res) {
        Persona.findOne({ where: { id: req.body.personaAte }, include: { model: models.historial } }).then(function (medicos) {
            if (medicos) {

                if (req.body.laboratorio == undefined || req.body.laboratorio == "") {
                    var laboratorio = 'Sin examenes de Laboratorio ';
                } else {
                    var laboratorio = req.body.laboratorio;
                }
                if (req.body.fisico == undefined || req.body.fisico == "") {
                    var fisico = 'No fue Necesario Examenes '
                } else {
                    var fisico = req.body.fisico;
                }

                if (req.body.medicamento == undefined || req.body.medicamento == "") {
                    Consulta.create({
                        fecha: new Date(),
                        motivo: req.body.motivo,
                        diagnostico: req.body.diagnostico,
                        especialidad: req.body.espec,
                        tipo_atencion: null,
                        descripcion: null,
                        examenes: laboratorio,
                        recomendaciones: req.body.recomendacion,
                        examen_fisico: fisico,
                        peso: req.body.peso,
                        talla: null,
                        estatura: req.body.estatura,
                        external_medico: req.user.id, //id sacado de la session
                        external_id: uuidv4(),
                        id_historial: medicos.historial.id

                    }).then(function (newHistorial, created) {
                        if (newHistorial) {
                            // res.send(newHistorial);
                            res.redirect('/medico/nuevaConsulta');

                        }
                    });

                } else {



                    Consulta.create({
                        fecha: new Date(),
                        motivo: req.body.motivo,
                        diagnostico: req.body.diagnostico,
                        especialidad: req.body.espec,
                        tipo_atencion: null,
                        descripcion: null,
                        examenes: laboratorio,
                        recomendaciones: req.body.recomendacion,
                        examen_fisico: fisico,
                        peso: req.body.peso,
                        talla: null,
                        estatura: req.body.estatura,
                        external_medico: req.user.id, //id sacado de la session
                        external_id: uuidv4(),
                        id_historial: medicos.historial.id

                    }).then(function (newHistorial, created) {
                        if (newHistorial) {

                            Receta.create({
                                medicamento: req.body.medicamento,
                                duracion_tratamiento: req.body.duracion,
                                fecha_Emision: new Date(),
                                via_administracion: req.body.administracion,
                                plan_de_tratamiento: req.body.tratamiento,
                                objetivo_tratamiento: req.body.objetivo_tratamiento,
                                external_id: uuidv4(),
                                id_consulta_medica: newHistorial.id
                            }).then(function (sec, created) {
                                if (sec) {
                                    res.redirect('/medico/nuevaConsulta');

                                }
                            });
                        }
                    });
                }
            }
        });
    }


    pantallaNuevaConsulta(req, res) {

        Persona.findAll({ where: { id_rol: 1, estado_historial: true }, include: { model: models.rol } }).then(function (medicos) {
            if (medicos) {

                Medico.findOne({ where: { id: 2 } }).then(function (medico) {
                    if (medico) {//id_persona id de la persona que inicio sesion
                        res.render('vista/medico/nuevaConsulta',
                            {
                                title: 'AdminX',
                                medico: medico,
                                listaPersonas: medicos
                            });
                    }
                });
            }
        });
    }

    historialPaciente(req, res) {

        Persona.findAll({ where: { id_rol: 1 }, include: { model: models.rol } }).then(function (usuario) {
            if (usuario) {
                res.render('vista/medico/historialPaciente', { title: 'AdminX', listaPersonas: usuario });
            }
        });

    }



    misConsultas(req, res) {
        var external = req.params.external;

        Consulta.findAll({
            where: {},
            include: [
                { model: models.historial, where: { id_persona: external } },
                { model: models.receta }], order: [["fecha", "DESC"]]
        }).then(function (citas) {
            //id persona id de la persona que entra por session
            if (citas) {
                console.log(citas);
                res.status(200).json(citas);
            }
        });
    }
}
module.exports = MedicoController;