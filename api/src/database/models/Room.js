'use strict'

module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
    name: { type: DataTypes.STRING, allowNull: false, field: 'name' },
    defaultCapacity: { type: DataTypes.INTEGER, allowNull: true, field: 'default_capacity' },
  }, {
    tableName: 'Rooms',
  })

  Room.associate = models => {
    Room.belongsToMany(models.CompetitionVenue, {
      as: 'competitionVenues',
      through: models.CompetitionVenueRoom,
      foreignKey: { name: 'roomId', field: 'room_id' },
      onDelete: 'RESTRICT',
    })
    Room.belongsTo(models.Venue, {
      as: 'venue',
      foreignKey: { name: 'venueId', field: 'venue_id' },
      onDelete: 'RESTRICT',
    })
  }

  return Room
}
