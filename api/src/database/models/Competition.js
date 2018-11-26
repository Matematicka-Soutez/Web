'use strict'

module.exports = (sequelize, DataTypes) => {
  const Competition = sequelize.define('Competition', {
    name: { type: DataTypes.STRING, allowNull: false, field: 'name' },
    date: { type: DataTypes.DATE, allowNull: false, field: 'date' },
    start: { type: DataTypes.DATE, allowNull: false, field: 'start' },
    end: { type: DataTypes.DATE, allowNull: false, field: 'end' },
    registrationRound1: { type: DataTypes.DATE, allowNull: false, field: 'registration_round1' },
    registrationRound2: { type: DataTypes.DATE, allowNull: false, field: 'registration_round2' },
    registrationRound3: { type: DataTypes.DATE, allowNull: false, field: 'registration_round3' },
    registrationEnd: { type: DataTypes.DATE, allowNull: false, field: 'registration_end' },
    isPublic: { type: DataTypes.BOOLEAN, allowNull: false, dafaultValue: false, field: 'is_public' },
    invitationEmailSent: { type: DataTypes.BOOLEAN, allowNull: false, dafaultValue: false, field: 'invitation_email_sent' },
  }, {
    tableName: 'Competitions',
  })

  Competition.associate = models => {
    Competition.belongsToMany(models.Venue, {
      as: 'venues',
      through: models.CompetitionVenue,
      foreignKey: { name: 'competitionId', field: 'competition_id' },
      onDelete: 'RESTRICT',
    })
    Competition.belongsToMany(models.Organizer, {
      as: 'organizers',
      through: 'CompetitionOrganizers',
      foreignKey: { name: 'competitionId', field: 'competition_id' },
      onDelete: 'RESTRICT',
    })
    Competition.hasMany(models.CompetitionVenue, {
      as: 'competitionVenues',
      foreignKey: { name: 'competitionId', field: 'competition_id' },
      onDelete: 'RESTRICT',
    })
    Competition.belongsTo(models.Game, {
      as: 'game',
      foreignKey: { name: 'gameId', field: 'game_id' },
      onDelete: 'RESTRICT',
    })
    Competition.belongsTo(models.Organizer, {
      as: 'createdBy',
      foreignKey: { name: 'organizerId', field: 'organizer_id' },
      onDelete: 'RESTRICT',
    })
    Competition.hasMany(models.TeamSolutionChange, {
      as: 'teamSolutionChanges',
      foreignKey: { name: 'competitionId', field: 'competition_id' },
      onDelete: 'RESTRICT',
    })
  }

  return Competition
}
