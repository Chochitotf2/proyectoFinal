module.exports = function (sequelize, Sequelize) {
    var historial = require('../models/historial');
    var Historial = new historial(sequelize, Sequelize);
    var Consulta_medica = sequelize.define('cita', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        fecha: {
            type: Sequelize.DATE
        },        
        motivo: {
            type: Sequelize.STRING(100)
        },        
        diagnostico: {
            type: Sequelize.STRING(100)
        },
        especialidad: {
            type: Sequelize.STRING(100)
        },
        tipo_atencion: {
            type: Sequelize.STRING(100)
        },
        descripcion: {
            type: Sequelize.STRING(100)
        },
        examenes: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        recomendaciones: {
            type: Sequelize.STRING(100)
        },
        external_id: {
            type: Sequelize.UUID
        }

    }, {freezeTableName: true,
        createdAt: 'fecha_registro',
        updatedAt: 'fecha_modificacion'
    });
    
    Consulta_medica.belongsTo(Historial, {
        foreignKey: 'id_historial',
        constraints: false
    });
    
    Consulta_medica.associate = function (models) {
        models.consulta_medica.hasOne(models.receta, {
            foreignKey: 'id_consulta_medica'
        });
        models.persona.hasOne(models.examenes, {
            foreignKey: 'id_consulta_medica'
        });
    }
    return Consulta_medica;
};
