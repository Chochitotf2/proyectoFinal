module.exports = function (sequelize, Sequelize) {
    var consulta_medica = require('../models/consulta_medica');
    var Consulta_medica = new consulta_medica(sequelize, Sequelize);
    var Examenes = sequelize.define('examenes', {
    id: {
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
    },
    examen: {
    type: Sequelize.STRING(100)
    },
    external_id: {
    type: Sequelize.UUID
    }
    
    }, {
    freezeTableName: true,
    createdAt: 'fecha_registro',
    updatedAt: 'fecha_modificacion'
    });
    
    
    Examenes.belongsTo(Consulta_medica, {
    foreignKey: 'id_consulta_medica',
    constraints: false
    });
    
    return Examenes;
    };
    