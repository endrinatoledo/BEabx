module.exports = function (sequelize, DataTypes) {
  const organizationsModel = sequelize.define('organizationsModel', {
    orgId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'org_id'
    },
    orgName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'org_name'
    },
    couId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'cou_Id'
    },
    orgStatus: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      field: 'org_status'
    }
  }, {
    tableName: 'organizations',
    timestamps: false

  })

  organizationsModel.associate = function (models) {
    organizationsModel.belongsTo(models.countriesModel, {
      as: 'countries',
      foreignKey: 'couId'
    })

    organizationsModel.hasMany(models.groupsModel, {
      as: 'group',
      foreignKey: 'orgId'
    })

    organizationsModel.hasMany(models.domainsModel, {
      as: 'domains',
      foreignKey: 'orgId'
    })
  }

  return organizationsModel
}
