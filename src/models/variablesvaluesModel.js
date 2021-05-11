module.exports = (sequelize, DataTypes) => {
  const variablesvaluesModel = sequelize.define('variablesvaluesModel', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'vva_id'
    },
    cod: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: 'vva_cod'
    },
    value: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      field: 'vva_value'
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'vva_description'
    }
  },
  {
    tableName: 'variablesvalues',
    timestamps: false
  })

  variablesvaluesModel.associate = (models) => {
    variablesvaluesModel.hasOne(models.assignmentsModel, {
      as: 'assignments',
      foreignKey: 'status'
    })

    variablesvaluesModel.hasOne(models.agreementModel, {
      as: 'agreement',
      foreignKey: 'status'
    })
  }

  return variablesvaluesModel
}
