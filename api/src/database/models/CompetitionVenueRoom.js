'use strict'

module.exports = (sequelize, DataTypes) => {
  const CompetitionVenueRoom = sequelize.define('CompetitionVenueRoom', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    capacity: { type: DataTypes.INTEGER, allowNull: false, field: 'capacity' },
  }, {
    tableName: 'CompetitionVenueRooms',
  })

  CompetitionVenueRoom.associate = models => {
    CompetitionVenueRoom.belongsTo(models.CompetitionVenue, {
      as: 'competitionVenue',
      foreignKey: { name: 'competitionVenueId', field: 'competition_venue_id' },
      onDelete: 'RESTRICT',
    })
    CompetitionVenueRoom.belongsTo(models.Room, {
      as: 'room',
      foreignKey: { name: 'roomId', field: 'room_id' },
      onDelete: 'RESTRICT',
    })
    CompetitionVenueRoom.hasMany(models.Team, {
      as: 'teams',
      foreignKey: { name: 'competitionVenueRoomId', field: 'competition_venue_room_id' },
      onDelete: 'RESTRICT',
    })
  }

  return CompetitionVenueRoom
}
