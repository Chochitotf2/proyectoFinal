module.exports = function (sequelize, Sequelize) {
    var medico = require('../models/medico');
    var Medico = new medico(sequelize, Sequelize);
    var Comentario = sequelize.define('comentario', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        Comentario: {
            type: Sequelize.STRING
        },
        puntucion: {
            type: Sequelize.INTEGER
        },
        external_id: {
            type: Sequelize.UUID
        },
        id_medico: {
            type: Sequelize.INTEGER
        }
        
    }, {freezeTableName: true,
        createdAt: 'fecha_registro',
        updatedAt: 'fecha_modificacion'
    });
    
    Comentario.belongsTo(Medico, {
        foreignKey: 'id_medico',
        constraints: false
    });

    
    
    return Comentario;
};