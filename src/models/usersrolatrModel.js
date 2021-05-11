module.exports = function (sequelize, DataTypes) {
  const usersrolatrModel = sequelize.define('usersrolatrModel', {
    usrId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'usr_id',
      primaryKey: true
    },
    grpId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'grp_id',
      primaryKey: true
    },
    rolId: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'rol_id',
      primaryKey: true
    },
    urgStatus: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      field: 'urg_status'
    }
  }, {
    tableName: 'usersrolatr',
    timestamps: false
  })
  usersrolatrModel.removeAttribute('id')
  usersrolatrModel.associate = function (models) {
    usersrolatrModel.belongsTo(models.groupsModel, {
      as: 'groups',
      foreignKey: 'grpId'
    })
    usersrolatrModel.belongsTo(models.userModel, {
      as: 'user',
      foreignKey: 'usrId'
    })
  }

  return usersrolatrModel
}
