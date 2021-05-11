module.exports = function (sequelize, DataTypes) {
  const rolesatrModel = sequelize.define('rolesatrModel', {
    rol_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    rol_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    rol_description: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'rolesatr',
    timestamps: false
  })

  return rolesatrModel
}
