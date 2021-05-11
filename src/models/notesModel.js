module.exports = (sequelize, DataTypes) => {
  const notesModel = sequelize.define('notesModel', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'noe_id'
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'noe_date'
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'noe_title'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'noe_description'
    },
    meeId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'mee_id'
    },
    usrId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'usr_id'
    },
    grpId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'grp_id'
    }
  }, {
    tableName: 'note',
    timestamps: false
  })

  notesModel.associate = function (models) {
    notesModel.belongsTo(models.userModel, {
      as: 'user',
      foreignKey: 'usrId'
    })
    notesModel.belongsTo(models.meetingModel, {
      as: 'meeting',
      foreignKey: 'meeId'
    })

    notesModel.belongsTo(models.groupsModel, {
      as: 'group',
      foreignKey: 'grpId'
    })

  }

  return notesModel
}
