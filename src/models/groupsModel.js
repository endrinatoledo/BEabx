module.exports = (sequelize, DataTypes) => {
  const groupsModel = sequelize.define('groupsModel', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'grp_id'
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'grp_name'
    },
    parentId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'grp_parentid'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'grp_description'
    },
    acronym: {
      type: DataTypes.STRING(4),
      allowNull: false,
      field: 'grp_acronym'
    },
    orgId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'org_id'
    },
    img: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'grp_img'
    }
  }, {
    tableName: 'groups',
    timestamps: false
  })

  groupsModel.associate = function (models) {
    groupsModel.belongsTo(models.organizationsModel, {
      as: 'organizations',
      foreignKey: 'orgId'
    })

    groupsModel.hasMany(models.groupsModel, {
      as: 'groupsParent',
      foreignKey: 'id'
    })

    groupsModel.belongsTo(models.groupsModel, {
      as: 'groups',
      foreignKey: 'parentId'
    })

    groupsModel.hasMany(models.assignmentsModel, {
      as: 'assignments',
      foreignKey: 'grpId'
    })

    groupsModel.hasMany(models.agreementModel, {
      as: 'agreements',
      foreignKey: 'grpId'
    })

    groupsModel.hasMany(models.usersrolatrModel, {
      as: 'usersrolatr',
      foreignKey: 'grpId'
    })
  }

  return groupsModel
}
