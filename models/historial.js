module.exports = function (sequelize, Sequelize) {
    var persona = require('../models/persona');
    var Persona = new persona(sequelize, Sequelize);
    var Historial = sequelize.define('historial', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        profesion: {
            type: Sequelize.STRING(50)
        },
        fumador: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        bebedor: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        cardiaco: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        convivencia_animales: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        grupo_sanguineo: {
            type: Sequelize.STRING(50)
        },
        enfermedades: {
            type: Sequelize.STRING(100)
        },
        antecedentes_familiar: {
            type: Sequelize.STRING(100)
        },
        evaluacion_fisica: {
            type: Sequelize.STRING(100)
        },
        diagnostico_ingreso: {
            type: Sequelize.STRING(100)
        },
        plan_de_tratamiento: {
            type: Sequelize.STRING(100)
        },
        objetivo_tratamiento: {
            type: Sequelize.STRING(100)
        },
        deporte: {
            type: Sequelize.STRING(100)
        },
        external_medico: {
            type: Sequelize.UUID
        },
        external_id: {
            type: Sequelize.UUID
        }
    }, {
        timestamps: false,
            freezeTableName: true
        });

        ///mi external

        Historial.belongsTo(Persona, {
            foreignKey: 'id_persona',
            constraints: false
        });

    return Historial;
};