module.exports = (sequelize, DataTypes) => {
  const meetingPositionsModel = sequelize.define('meetingPositionsModel', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    meeId: {
      type: DataTypes.BIGINT,
      field: 'meeId'
    },
    agrId: {
      type: DataTypes.BIGINT,
      field: 'agrId'
    },
    asmId: {
      type: DataTypes.BIGINT,
      field: 'asmId'
    },
    noeId: {
      type: DataTypes.BIGINT,
      field: 'noeId'
    },
    position: {
      type: DataTypes.INTEGER,
      field: 'position'
    }
  }, {
    tableName: 'meeting_positions',
    timestamps: false
  })
  meetingPositionsModel.associate = function (models) {
    meetingPositionsModel.hasMany(models.meetingModel, {
      foreignKey: 'mee_id'
    })
    meetingPositionsModel.hasMany(models.agreementModel, {
      foreignKey: 'agr_id'
    })
    meetingPositionsModel.hasMany(models.assignmentsModel, {
      foreignKey: 'asm_id'
    })
    meetingPositionsModel.hasMany(models.notesModel, {
      foreignKey: 'noe_id'
    })
  }
  return meetingPositionsModel
}
