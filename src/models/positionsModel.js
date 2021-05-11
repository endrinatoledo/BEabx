module.exports = function (sequelize, DataTypes) {
  const positionsModel = sequelize.define('positionsModel', {
    posId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'pos_id'
    },
    posName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'pos_name'
    }
  }, {
    tableName: 'positions',
    timestamps: false
  })

  return positionsModel
}
