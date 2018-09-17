'use strict'

module.exports = (sequelize, DataTypes) => {
  const CompetitionVenue = sequelize.define('CompetitionVenue', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    capacity: { type: DataTypes.INTEGER, allowNull: false, field: 'capacity' },
  }, {
    tableName: 'CompetitionVenues',
  })

  CompetitionVenue.associate = models => {
    CompetitionVenue.belongsToMany(models.Room, {
      as: 'rooms',
      through: models.CompetitionVenueRoom,
      foreignKey: { name: 'competitionVenueId', field: 'competition_venue_id' },
      onDelete: 'RESTRICT',
    })
    CompetitionVenue.hasMany(models.CompetitionVenueRoom, {
      as: 'cvrooms',
      foreignKey: { name: 'competitionVenueId', field: 'competition_venue_id' },
      onDelete: 'RESTRICT',
    })
    CompetitionVenue.belongsTo(models.Competition, {
      as: 'competition',
      foreignKey: { name: 'competitionId', field: 'competition_id' },
      onDelete: 'RESTRICT',
    })
    CompetitionVenue.belongsTo(models.Venue, {
      as: 'venue',
      foreignKey: { name: 'venueId', field: 'venue_id' },
      onDelete: 'RESTRICT',
    })
    CompetitionVenue.hasMany(models.Team, {
      as: 'teams',
      foreignKey: { name: 'competitionVenueId', field: 'competition_venue_id' },
      onDelete: 'RESTRICT',
    })
  }

  return CompetitionVenue
}
