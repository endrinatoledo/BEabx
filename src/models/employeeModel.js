module.exports = function (sequelize, DataTypes) {
  const employeeModel = sequelize.define('employeeModel', {
    empId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'emp_id'
    },
    usrId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'usr_id'
    },
    orgId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'org_id'
    },
    posId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'pos_id'
    },
    empStatus: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      field: 'emp_status'
    },
    createDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'emp_create_at'
    },
    updateDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'emp_update_at'
    }
  }, {
    tableName: 'employee',
    timestamps: false
  })

  employeeModel.associate = function (models) {
    employeeModel.hasMany(models.positionsModel, {
      as: 'positions',
      foreignKey: 'posId'
    })

    employeeModel.belongsTo(models.organizationsModel, {
      as: 'organization',
      foreignKey: 'orgId'
    })
    employeeModel.belongsTo(models.userModel, {
      as: 'user',
      foreignKey: 'usrId'
    })
  }

  return employeeModel
}
