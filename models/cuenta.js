module.exports = function (sequelize, Sequelize) {
    var persona = require('../models/persona');
    var Persona = new persona(sequelize, Sequelize);
    var Cuenta = sequelize.define('cuenta', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        usuario: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        clave: {
            type: Sequelize.STRING
        },
        external_id: {
            type: Sequelize.UUID
        },
        estado: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }
        
    }, {freezeTableName: true,
        createdAt: 'fecha_registro',
        updatedAt: 'fecha_modificacion'
    });
    
    Cuenta.belongsTo(Persona, {
        foreignKey: 'id_persona',
        constraints: false
    });
    
    return Cuenta;
};