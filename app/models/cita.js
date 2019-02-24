module.exports = function (sequelize, Sequelize) {
    var persona = require('../models/persona');
    var Persona = new persona(sequelize, Sequelize);
    var Cita = sequelize.define('cita', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        external_medico: { //revisar esto referecncia
            type: Sequelize.UUID
        },
        hora: {
            type: Sequelize.TIME 
        },
        fecha: {
            type: Sequelize.DATE 
        },
        estado: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        external_horario: {
            type: Sequelize.UUID
        },
        external_id: {
            type: Sequelize.UUID
        }
    }, {freezeTableName: true,
        createdAt: 'fecha_registro',
        updatedAt: 'fecha_modificacion'
    });
    
    Cita.belongsTo(Persona, {
        foreignKey: 'id_persona',
        constraints: false
    });
    
    return Cita;
};

