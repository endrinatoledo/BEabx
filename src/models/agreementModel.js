module.exports = (sequelize, DataTypes) => {
  const agreementModel = sequelize.define('agreementModel', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'agr_id'
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'agr_title'
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'agr_content'
    },
    oriId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'ori_id'
    },
    status: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      field: 'agr_status'
    },
    agrCreate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'agr_create_at'
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'agr_date'
    },
    agrUpdate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'agr_update_at'
    },
    meeId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'mee_id'
    },
    usrId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'usr_id'
    },
    grpId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'grp_id'
    },
    usrIdCreator: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'usr_creator'
    }
  }, {
    tableName: 'agreement',
    timestamps: false
  })

  agreementModel.associate = function (models) {
    agreementModel.belongsTo(models.originModel, {
      as: 'origin',
      foreignKey: 'oriId'
    })

    agreementModel.belongsTo(models.groupsModel, {
      as: 'group',
      foreignKey: 'grpId'
    })
    agreementModel.belongsTo(models.userModel, {
      as: 'user',
      foreignKey: 'usrId'
    })
    agreementModel.belongsTo(models.userModel, {
      as: 'userCreator',
      foreignKey: 'usrIdCreator'
    })
    agreementModel.hasMany(models.commentsModel, {
      as: 'comments',
      foreignKey: 'id'
    })
    agreementModel.belongsTo(models.variablesvaluesModel, {
      as: 'variablesvalues',
      foreignKey: 'status'
    })
    agreementModel.belongsTo(models.meetingModel, {
      as: 'meeting',
      foreignKey: 'meeId'
    })

  }

  return agreementModel
}
