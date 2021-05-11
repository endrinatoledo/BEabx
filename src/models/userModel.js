module.exports = (sequelize, DataTypes) => {
  const userModel = sequelize.define('userModel',
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'usr_id'
      },
      login: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'usr_login'
      },
      firstName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'usr_firstname'
      },
      secondName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'usr_secondname'
      },
      lastName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'usr_lastname'
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'usr_email'
      },
      birthDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: 'usr_birthdate'
      },
      createdAt: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: 'created_at'
      },
      updateAt: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: 'updated_at'
      },
      deleteAt: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: 'deleted_at'
      },
      status: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        field: 'usr_status'
      },
      img: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'usr_img'
      },
      password:{
        type:DataTypes.STRING(100),
        allowNull: true,
        field: 'usr_password'
      }
    }, {
      tableName: 'users',
      timestamps: false
    }
  )

  userModel.associate = (models) => {
    userModel.hasMany(models.usersrolatrModel, {
      as: 'usersrolatr',
      foreignKey: 'usrId'
    })
    userModel.hasMany(models.assignmentsModel, {
      as: 'assignmentsAsigned',
      foreignKey: 'usrId'
    })
    userModel.hasMany(models.assignmentsModel, {
      as: 'assignmentsCreator',
      foreignKey: 'usrCreator'
    })
    userModel.hasMany(models.agreementModel, {
      as: 'agreementAsc',
      foreignKey: 'usrId'
    })
    userModel.hasMany(models.agreementModel, {
      as: 'agreementCreator',
      foreignKey: 'usrIdCreator'
    })
    userModel.hasOne(models.employeeModel, {
      as: 'employee',
      foreignKey: 'usrId'
    })
    userModel.hasOne(models.commentsModel, {
      as: 'comments',
      foreignKey: 'usrId'
    })
      userModel.hasMany(models.participantsModel, {
          as: 'participant',
          foreignKey: 'usr_id'
      })
      userModel.belongsTo(models.meetingModel, {
          as: 'leader',
          foreignKey: 'usr_id'
      })
  }
  return userModel
}
