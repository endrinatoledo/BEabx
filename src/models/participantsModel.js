module.exports = function (sequelize, DataTypes) {
    const participantsModel = sequelize.define('participantsModel', {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'par_id'
        },
        userEmail: {
            type: DataTypes.STRING(150),
            allowNull: false,
            field: 'usr_email'
        },
        userId: {
            type: DataTypes.INTEGER(11),
            field: 'usr_id'
        },
        meeId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            field: 'mee_id'
        }
    }, {
        tableName: 'participants',
        timestamps: false
    })

    participantsModel.associate = function (models) {
        participantsModel.belongsTo(models.meetingModel, {
            foreignKey: 'mee_id'
        })
    }

    return participantsModel
}
