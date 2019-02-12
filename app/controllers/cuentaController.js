'use strict';
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
    
}
module.exports = CuentaController;