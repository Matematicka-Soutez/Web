module.exports = (sequelize, DataTypes) => {
  const CompetitionVenueRoom = sequelize.define('CompetitionVenueRoom', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, }, 
    capacity: { type: DataTypes.INTEGER, allowNull: false, field: 'capacity' },
  }, {
    tableName: 'CompetitionVenueRooms',
  })

  CompetitionVenueRoom.associate = models => {
    CompetitionVenueRoom.hasMany(models.Team, {
      as: 'teams',
      foreignKey: { name: 'competitionVenueRoomId', field: 'competition_venue_room_id' },
      onDelete: 'RESTRICT',
    })
  }

  return CompetitionVenueRoom
}
