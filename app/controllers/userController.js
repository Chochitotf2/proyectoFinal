'use strict';
var pdf = require('html-pdf');
const uuidv4 = require('uuid/v4');
var models = require('./../models');
var Historial = models.historial;
var Consulta = models.consulta_medica;
var Cita = models.cita;
var Receta = models.receta;


var path = require('path');
var fs = require('fs');
var Cuenta = models.medico;
var Persona = models.persona;
var Medico = models.medico;
var forEach = require('sync-each');

var async = require("async");
var contenido = '<h1>Prueba de creacion de sssssssssssssscodigo</h1>';
var options = {
    "format": "A4",
    "header": {
        "height": "60px"
    },
    "footer": {
        "heigt": "22mm"
    },
    // "base":'file://Users/midesweb/carpeta_base'
};



class CuentaController {
    verLogin(req, res) {
        res.render('vista/login', {
            error: req.flash("err_cred")
        });
    }
    verRegistro(req, res) {
        res.render('vista/registroUsuario');
    }

    cerrar(req, res) {
        req.session.destroy();
        res.redirect('/login');
    }


    agendarCita(req, res) {

        if (req.body.external_verificar == 'guarda') {
            Cita.create({
                external_medico: req.body.medico,
                hora: req.body.hora,
                fecha: req.body.fecha,
                estado: true,
                external_horario: 'ninguno',
                external_id: uuidv4(),
                id_persona: req.user.id

            }).then(function (newHistorial, created) {
                if (newHistorial) {
                    console.log('se ah registrado una cita');
                    res.redirect('/usuario/registroCita');

                }
            });

        } else {
            Cita.update({
                hora: req.body.hora,
                fecha: req.body.fecha
            }, { where: { external_id: req.body.external_modificar } }).then(function (updatedVino, created) {
                if (updatedVino) {
                    // req.flash('info', 'Se ha creado correctamente', false);
                    res.redirect('/usuario/registroCita');
                }
            });
        }
    }



    verEditar(req, res) {

        Persona.findOne({ where: { id: req.user.id }, include: { model: models.cuenta } }).then(function (persona) {

            res.render('vista/usuario/perfilUser', { lista: persona });

        }).catch(function (err) {
            console.log("Error:", err);
            res.redirect('/usuario/home');
        });

    }


    modificarPerson(req, res) {
        Persona.update({
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            edad: req.body.edad,
            nacionalidad: req.body.nacionalidad,
            telefono: req.body.telefono,
            direccion: req.body.direccion

        }, { where: { external_id: req.body.external } }).then(function (updatedPersona, created) {
            if (updatedPersona) {

                res.redirect('/usuario/home');
            }
        });
    }

    modificarMedic(req, res) {
        Persona.update({
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            edad: req.body.edad,
            nacionalidad: req.body.nacionalidad,
            telefono: req.body.telefono,
            direccion: req.body.direccion

        }, { where: { external_id: req.body.external } }).then(function (updatedPersona, created) {
            if (updatedPersona) {

                res.redirect('/medico/home');
            }
        });
        Medico.update({
            
            nro_consultorio: req.body.consultorio,
            especialidad: req.body.especialidad

        }, { where: { id: req.user.id } }).then(function (updatedPersona, created) {
            if (updatedPersona) {

                res.redirect('/medico/home');
            }
        });
    }


    ///////////////////////////////////////////Historial////////////////////////////////////
    comprobarHistorial(req, res) {
        res.render('vista/usuario/miHistorial');

    }
    guardarHistorial(req, res) {
        Historial.create({
            profesion: req.body.profesion,
            fumador: req.body.fuma,
            bebedor: req.body.bebedor,
            cardiaco: req.body.cardiaco,
            convivencia_animales: req.body.animales,
            grupo_sanguineo: req.body.grupoSa,
            enfermedades: req.body.enfermedades,
            antecedentes_familiar: req.body.familia,
            deporte: req.body.deporte,
            external_id: uuidv4(),
            id_persona: req.user.id
        }).then(function (newHistorial, created) {
            if (newHistorial) {
                Persona.update({
                    estado_historial: true,
                }, { where: { id: req.user.id } }).then(function (updatedVino, created) {
                    if (updatedVino) {
                        res.redirect('/usuario/home');
                    }
                });

            }
        });
    }
    ///////////////////////////////////////////fecha////////////////////////////////////
    filtrarCitas(req, res) {
        var fechax = new Date(req.params.external);
        var medico = req.params.exter;
        Cita.findAll({ where: { fecha: fechax, external_medico: medico } }).then(function (horas) {
            if (horas) {

                res.status(200).json(horas);
            }
        });
    }

    datosCitaMedico(req, res) {
        var medicoq = req.params.medico;
        var datoMedico = [];
        Medico.findOne({ where: { id: medicoq } }).then(function (medico) {
            if (medico) {
                Persona.findOne({ where: { id: medicoq } }).then(function (persona) {
                    if (persona) {
                        datoMedico.push(persona);
                        datoMedico.push(medico);
                        res.send(datoMedico);
                    }
                });

            }
        });
    }

    misCitas(req, res) {
        Cita.findAll({ where: { id_persona: req.user.id }, include: { model: models.persona }, order: [["fecha", 'ASC']] }).then(function (citas) {
            if (citas) {
                res.status(200).json(citas);
            }
        });
    }
    eliminarCita(req, res) {
        var external = req.params.external;
        Cita.update({
            estado: false,
        }, { where: { external_id: external } }).then(function (updatedVino, created) {
            if (updatedVino) {
                res.status(200).json('removido');
            }
        });
    }
    verRegistroMedicos(req, res) {
        var lista = [];
        Persona.findAll({ where: { id_rol: 3 }, include: { model: models.rol } }).then(function (medicos) {
            if (medicos) {//id_persona id de la persona que inicio sesion
                Cita.findAll({ where: { id_persona: req.user.id }, include: { model: models.persona } }).then(function (citas) {
                    if (citas) {

                        //  lista.push(item.external_medico);
                        res.render('vista/usuario/registroCita',
                            {
                                title: 'AdminX',
                                citasMedicas: citas,
                                lista: medicos
                            });
                    }
                });
            }
        });
    }
    filtrarCuentaMedico(req, res) {
        var usurio = req.params.external;
        // console.log(usurio);
        Cuenta.findOne({ where: { id: usurio } }).then(function (user) {
            if (user) {
                res.status(200).json(user);
            }
        });
    }
    misConsultas(req, res) {
        Consulta.findAll({
            where: {},
            include: {
                model: models.historial,
                where: { id_persona: req.user.id }
            }, order: [["fecha", "DESC"]]
        }).then(function (citas) {
            //id persona id de la persona que entra por session
            if (citas) {
                res.status(200).json(citas);
            }
        });
    }

    crearpdf(req, res) {
        var con = req.params.data;
        Consulta.findOne({ where: {external_id:con}, include: { model: models.receta }  }).then(function (medicos) {
            if (medicos) {
                contenido = 
                '<div style="padding: 70px">'+
                '<h1>Consulta Medica</h1>'+
                '<h4>Fecha de la Consulta  :</h4>'+
                '<h5>'+medicos.fecha+'</h5>'+
                '<h4>Motivo de la consulta :</h4>'+
                '<h5>'+medicos.motivo+'</h5>'+
                '<h4>Diagnostigo del medico</h4>'+
                '<h5>'+medicos.diagnostico+'</h5>'+
                '<h4>Atendido en la area de :</h4>'+
                '<h5>'+medicos.especialidad+'</h5>'+
                '<h4>Recomendaciones del Medico :</h4>'+
                '<h5>'+medicos.recomendaciones+'</h5>'+
                '<h4>Examene de laboratorio</h4>'+
                '<h5>'+medicos.examenes+'</h5>'+
                '<h4>Examenes preoperatorios </h4>'+
                '<h5>'+medicos.fisico+'</h5>'+
                '<h4>Peso :</h4>'+
                '<h5>'+medicos.peso+'</h5>'+
                '<h4>Estatura :</h4>'+
                '<h5>'+medicos.estatura+'</h5>'+'</div>';
               
                pdf.create(contenido).toFile('./test.pdf', function (err, resp) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.status(200).json('bn');
                    }
                });



            }
        });
    }

    abrirPdf(req, res) {
        var path_file = './test.pdf';
        fs.exists(path_file, function (exists) {
            if (exists) {
                res.sendFile(path.resolve(path_file));
            }
        });
    }






    
}
module.exports = CuentaController;