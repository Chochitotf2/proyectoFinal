module.exports = function (sequelize, Sequelize) {
    var persona = require('../models/persona');
    var Persona = new persona(sequelize, Sequelize);
    var Medico = sequelize.define('medico', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
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
    
  //  Cuenta.belongsTo(Persona, {
  //      foreignKey: 'id_persona',
  //      constraints: false
  //  });

  Horario_medico.associate = function (models) {
    models.horario_medico.hasOne(models.medico, {
        foreignKey: 'id_horario_medico'
    });

    models.medico.hasMany(models.comentarios, {
        foreignKey: 'id_medico'
    });
}

    
    return Medico;
};