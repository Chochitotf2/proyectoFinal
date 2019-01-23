module.exports = function (sequelize, Sequelize) {
    var Horario_medico = sequelize.define('horario_medico', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        hora_inicio: {
            type: Sequelize.DATE                        
        },
        hora_fin: {
            type: Sequelize.DATE                        
        }
    }, {timestamps: false, 
        freezeTableName: true});

        Horario_medico.belongsTo(Medico, {
            foreignKey: 'id_horario_medico',
            constraints: false
        });
        
    return Rol;
};