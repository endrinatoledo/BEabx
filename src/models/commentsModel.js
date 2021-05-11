module.exports = function (sequelize, DataTypes) {
  const commentsModel = sequelize.define('commentsModel', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'com_id'
    },
    description: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'com_description'
    },
    createdAt: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'com_create_at'
    },
    updatedAt: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'com_update_at'
    },
    agrId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'agr_id'
    },
    asmId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'asm_id'
    },
    usrId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'usr_id'
    }
  }, {
    tableName: 'comments',
    timestamps: false
  })

  commentsModel.associate = function (models) {
    commentsModel.belongsTo(models.assignmentsModel, {
      as: 'assignments',
      foreignKey: 'asmId'
    })

    commentsModel.belongsTo(models.agreementModel, {
      as: 'agreements',
      foreignKey: 'agrId'
    })

    commentsModel.belongsTo(models.userModel, {
      as: 'users',
      foreignKey: 'usrId'
    })
  }

  return commentsModel
}
