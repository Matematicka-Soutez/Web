// eslint-disable max-len

module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define('Address', {
    firstName: { type: DataTypes.STRING, allowNull: false, field: 'first_name' },
    lastName: { type: DataTypes.STRING, allowNull: false, field: 'last_name' },
    street: { type: DataTypes.STRING, allowNull: true, field: 'street' },
    city: { type: DataTypes.STRING, allowNull: true, field: 'city' },
    zip: { type: DataTypes.STRING, allowNull: true, field: 'zip' },
  }, {
    tableName: 'Addresses',
    timestamps: true,
  })

  Address.associate = models => {
    Address.hasOne(models.User, {
      as: 'user',
      foreignKey: { name: 'addressId', field: 'address_id' },
      onDelete: 'RESTRICT',
    })
    Address.belongsTo(models.State, {
      as: 'state',
      foreignKey: { name: 'stateId', field: 'state_id' },
      onDelete: 'RESTRICT',
    })
  }

  return Address
}
