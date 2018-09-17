'use strict'

module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define('Address', {
    titleLine1: { type: DataTypes.STRING, allowNull: false, field: 'title_line1' },
    titleLine2: { type: DataTypes.STRING, allowNull: false, field: 'title_line2' },
    street: { type: DataTypes.STRING, allowNull: true, field: 'street' },
    city: { type: DataTypes.STRING, allowNull: true, field: 'city' },
    zip: { type: DataTypes.STRING, allowNull: true, field: 'zip' },
  }, {
    tableName: 'Addresses',
  })

  Address.associate = models => {
    Address.hasOne(models.School, {
      as: 'school',
      foreignKey: { name: 'addressId', field: 'address_id' },
      onDelete: 'RESTRICT',
    })
    Address.hasOne(models.Venue, {
      as: 'venue',
      foreignKey: { name: 'addressId', field: 'address_id' },
      onDelete: 'RESTRICT',
    })
    Address.belongsTo(models.Country, {
      as: 'country',
      foreignKey: { name: 'countryId', field: 'country_id' },
      onDelete: 'RESTRICT',
    })
  }

  return Address
}
