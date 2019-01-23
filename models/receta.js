module.exports = function (sequelize, Sequelize) {
    var consulta_medica = require('../models/consulta_medica');
    var Consulta_medica = new persona(sequelize, Sequelize);
    var Receta = sequelize.define('receta', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },      
        medicamento: {
            type: Sequelize.STRING(100)
        },
        duracion_tratamiento: {
            type: Sequelize.STRING(100)
        },
        fecha_Emision: {
            type: Sequelize.DATE
        },
        via_administracion: {
            type: Sequelize.STRING(100)
        },
        external_id: {
            type: Sequelize.UUID
        }

    }, {freezeTableName: true,
        createdAt: 'fecha_registro',
        updatedAt: 'fecha_modificacion'
    });
    
    /* 
    Receta.belongsTo(Consulta_medica, {
        foreignKey: 'id_persona',
        constraints: false
    });
*/    
    return Examen;
};

