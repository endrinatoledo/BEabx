module.exports = function (sequelize, DataTypes) {
  const originModel = sequelize.define('originModel', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'ori_id'
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'ori_name'
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'ori_description'
    },
    status: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      field: 'ori_status'
    }
  }, {
    tableName: 'origin',
    timestamps: false
  })

  originModel.associate = function (models) {
    originModel.hasMany(models.agreementModel, {
      as: 'agreements',
      foreignKey: 'id'
    })
  }

  return originModel
}
