module.exports = function (sequelize, Sequelize) {
    var historial = require('../models/historial');
    var Historial = new historial(sequelize, Sequelize);
    var Consulta_medica = sequelize.define('consulta_medica', {
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
            type: Sequelize.STRING(100)
        },
        recomendaciones: {
            type: Sequelize.STRING(100)
        },
        examen_fisico: {
            type: Sequelize.STRING(100)
        },
        peso: {
            type: Sequelize.DECIMAL(10, 2)
        },
        talla: {
            type: Sequelize.DECIMAL(10, 2)
        },
        estatura: {
            type: Sequelize.INTEGER 
        },
        external_medico: { 
            type: Sequelize.UUID
        },
        external_id: {
            type: Sequelize.UUID
        }

    }, {
        freezeTableName: true,
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
      //  models.consulta_medica.hasOne(models.examenes, {
       //     foreignKey: 'id_consulta_medica'
      ///  });
    }

  

    return Consulta_medica;
};