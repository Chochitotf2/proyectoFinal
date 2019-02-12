module.exports = function (sequelize, Sequelize) {
    var persona = require('../models/persona');
    var Persona = new persona(sequelize, Sequelize);
    var Medico = sequelize.define('medico', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey:true
        },
        especialidad: {
            type: Sequelize.STRING(50)
        },
        max_turnos: {
            type: Sequelize.INTEGER
        },
        estado: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        nro_consultorio: {
            type: Sequelize.INTEGER
        }
    }, {freezeTableName: true,
        createdAt: 'fecha_registro',
        updatedAt: 'fecha_modificacion'
    });

    Medico.associate = function (models) {
    models.horario_medico.hasOne(models.medico, {
        foreignKey: 'id_horario_medico'
    });


}

    
    return Medico;
};