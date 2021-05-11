module.exports = function (sequelize, DataTypes) {
    const invitationsModel = sequelize.define('invitationsModel', {
      invId: {
        type: DataTypes.BIGINT(20),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'inv_id'
      },
      status: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        field: 'inv_status'
      },
      grpId: {
        type: DataTypes.BIGINT(20),
        allowNull: false,
        field: 'grp_id'
      },
      usrId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        field: 'usr_id'
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'usr_email'
      },

    }, {
      tableName: 'invitations',
      timestamps: false
  
    })
  
    invitationsModel.associate = function (models) {
      invitationsModel.belongsTo(models.countriesModel, {
        as: 'group',
        foreignKey: 'grpId'
      })
      invitationsModel.belongsTo(models.countriesModel, {
        as: 'user',
        foreignKey: 'usrId'
      })
  
     
    }
  
    return invitationsModel
  }
  