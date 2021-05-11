module.exports = (sequelize, DataTypes) => {
    const meetingModel = sequelize.define('meetingModel', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'mee_id'
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'mee_title'
      },
      date: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'mee_date'
      },
      grpId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'grp_id'
      },
      oriId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'ori_id'
      },
        usrId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            field: 'usr_id'
        },
      status: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        field: 'mee_status'
      }
  
    }, {
      tableName: 'meeting',
      timestamps: false
    })
  
    meetingModel.associate = function (models) {
        meetingModel.belongsTo(models.groupsModel, {
            as: 'groups',
            foreignKey: 'grpId'
        })
        meetingModel.belongsTo(models.originModel, {
            as: 'origin',
            foreignKey: 'oriId'
        })
        meetingModel.hasMany(models.participantsModel, {
            foreignKey: 'mee_id'
        })
        meetingModel.hasOne(models.userModel, {
            as: 'leader',
            foreignKey: 'usr_id'
        })
    }
  
    return meetingModel
  }
