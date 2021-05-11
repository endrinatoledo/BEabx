module.exports = function (sequelize, DataTypes) {
  const domainsModel = sequelize.define('domainsModel', {
    domId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'dom_id'
    },
    domExtension: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'dom_extension'
    },
    domStatus: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'dom_status'
    },
    orgId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'org_id'
    }
  }, {
    tableName: 'domains',
    timestamps: false
  })

  domainsModel.associate = function (models) {
    domainsModel.belongsTo(models.organizationsModel, {
      as: 'organizations',
      foreignKey: 'orgId'
    })
  }

  return domainsModel
}
