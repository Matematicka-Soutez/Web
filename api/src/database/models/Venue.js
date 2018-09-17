'use strict'

module.exports = (sequelize, DataTypes) => {
  const Venue = sequelize.define('Venue', {
    name: { type: DataTypes.STRING, allowNull: false, field: 'name' },
    defaultCapacity: { type: DataTypes.INTEGER, allowNull: true, field: 'default_capacity' },
  }, {
    tableName: 'Venues',
  })

  Venue.associate = models => {
    Venue.belongsToMany(models.Competition, {
      as: 'competitions',
      through: models.CompetitionVenue,
      foreignKey: { name: 'venueId', field: 'venue_id' },
      onDelete: 'RESTRICT',
    })
    Venue.hasMany(models.CompetitionVenue, {
      as: 'competitionVenues',
      foreignKey: { name: 'venueId', field: 'venue_id' },
      onDelete: 'RESTRICT',
    })
    Venue.hasMany(models.Room, {
      as: 'rooms',
      foreignKey: { name: 'venueId', field: 'venue_id' },
      onDelete: 'RESTRICT',
    })
    Venue.belongsTo(models.Address, {
      as: 'address',
      foreignKey: { name: 'addressId', field: 'address_id' },
      onDelete: 'RESTRICT',
    })
  }

  return Venue
}
