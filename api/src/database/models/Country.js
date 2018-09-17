'use strict'

module.exports = (sequelize, DataTypes) => {
  const Country = sequelize.define('Country', {
    name: { type: DataTypes.STRING, allowNull: false, field: 'name' },
    abbreviation: { type: DataTypes.STRING, allowNull: false, field: 'abbreviation' },
  }, {
    tableName: 'Countries',
  })

  Country.associate = models => {
    Country.hasMany(models.Address, {
      as: 'addresses',
      foreignKey: { name: 'countryId', field: 'country_id' },
      onDelete: 'RESTRICT',
    })
  }

  return Country
}
