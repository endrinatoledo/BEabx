module.exports = (sequelize, DataTypes) => {
  const assignmentsModel = sequelize.define('assignmentsModel', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'asm_id'
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'asm_title'
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'asm_content'
    },
    initialDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'asm_initialdate'
    },
    finalDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'asm_finaldate'
    },
    asmCreate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'asm_create_at'
    },
    asmUpdate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'asm_update_at'
    },
    status: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      field: 'asm_status'
    },
    grpId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'grp_id'
    },
    usrCreator: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'usr_creator'
    },
    usrId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'usr_id'
    },
    userEmail: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'usr_email'
    },
    meeId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'mee_id'
    },
    notification: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'asm_notifies'
    }
  }, {
    tableName: 'assignments',
    timestamps: false
  })

  assignmentsModel.associate = function (models) {
    assignmentsModel.belongsTo(models.groupsModel, {
      as: 'group',
      foreignKey: 'grpId'
    })
    assignmentsModel.hasMany(models.commentsModel, {
      as: 'comments',
      foreignKey: 'asmId'
    })
    assignmentsModel.belongsTo(models.userModel, {
      as: 'user',
      foreignKey: 'usrId'
    })
    assignmentsModel.belongsTo(models.userModel, {
      as: 'userCreator',
      foreignKey: 'usrCreator'
    })
    assignmentsModel.belongsTo(models.variablesvaluesModel, {
      as: 'variablesvalues',
      foreignKey: 'status'
    })
    assignmentsModel.belongsTo(models.meetingModel, {
      as: 'meeting',
      foreignKey: 'meeId'
    })


  }

  return assignmentsModel
}
