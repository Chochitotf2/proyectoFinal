module.exports = function (sequelize, Sequelize) {
    var rol = require('../models/rol');
    var Rol = new rol(sequelize, Sequelize);
    var Persona = sequelize.define('persona', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        nombre: {
            type: Sequelize.STRING(50)
        },
        apellido: {
            type: Sequelize.STRING(50)
        },        
        cedula: {
            type: Sequelize.STRING(10),
            allowNull: false,
            unique: true
        },        
        correo: {
            type: Sequelize.STRING(50),
            allowNull: false,
            unique: true
        },        
        direccion: {
            type: Sequelize.STRING(256),
            allowNull: false,
        },        
        genero: {
            type: Sequelize.STRING(1),
            allowNull: false,
        },      
        telefono: {
            type: Sequelize.STRING(20),
            allowNull: false,
        },        
        edad: {
            type: Sequelize.INTEGER,
        },        
        estado_civil: {
            type: Sequelize.STRING(20),
        },        
        nacionalidad: {
            type: Sequelize.STRING(20),
        },
        external_id: {
            type: Sequelize.UUID
        }
    }, {freezeTableName: true
    });
    
    Persona.belongsTo(Rol, {
        foreignKey: 'id_rol',
        constraints: false
    });
    
    Persona.associate = function (models) {
        models.persona.hasOne(models.cuenta, {
            foreignKey: 'id_persona'
        });
        models.persona.hasOne(models.historial, {
            foreignKey: 'id_persona'
        });
        models.persona.hasMany(models.cita, {
            foreignKey: 'id_persona'
        });
    }
    
    return Persona;
};