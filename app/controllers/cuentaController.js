'use strict';
'use strict';
const uuidv4 = require('uuid/v4');
var models = require('./../models');
var Historial = models.historial;
var Cita = models.cita;
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

  

    agendarCita(req,res){
        Cita.create({
            external_medico: "sdsd",
            hora: req.body.hora,
            fecha:req.body.fecha,
            estado: true,
            external_horario: 'ninguno',
            external_id:uuidv4(),
            id_persona: 1     

        }).then(function (newHistorial, created) {
            if (newHistorial) {
                console.log('se ah registrado una cita');
               // req.flash('info', 'Se ha creado correctamente');
                res.redirect('/usuario/home');
            }
        });

        
    }

    
}
module.exports = CuentaController;