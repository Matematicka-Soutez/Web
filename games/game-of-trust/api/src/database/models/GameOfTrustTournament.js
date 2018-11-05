'use strict'

module.exports = (sequelize, DataTypes) => {
  const GameOfTrustTournament = sequelize.define('GameOfTrustTournament', {
    number: { type: DataTypes.INTEGER, allowNull: false, field: 'number', unique: true },
    mistakeRate: { type: DataTypes.INTEGER, allowNull: false, field: 'mistake_rate', default: 0 },
    start: { type: DataTypes.DATE, allowNull: false, field: 'start' },
    end: { type: DataTypes.DATE, allowNull: false, defaultValue: new Date(), field: 'end' },
  }, {
    tableName: 'GameOfTrustTournaments',
    timestamps: true,
  })

  GameOfTrustTournament.associate = models => {
    GameOfTrustTournament.belongsTo(models.Competition, {
      as: 'competition',
      foreignKey: { name: 'competitionId', field: 'competition_id' },
      onDelete: 'RESTRICT',
    })
    GameOfTrustTournament.hasMany(models.GameOfTrustTeamScore, {
      as: 'teamScores',
      foreignKey: { name: 'tournamentId', field: 'tournament_id' },
      onDelete: 'RESTRICT',
    })
    GameOfTrustTournament.hasMany(models.GameOfTrustTournamentStrategy, {
      as: 'strategies',
      foreignKey: { name: 'tournamentId', field: 'tournament_id' },
      onDelete: 'RESTRICT',
    })
    GameOfTrustTournament.hasOne(models.GameOfTrustTournament, {
      as: 'previousTournament',
      foreignKey: { name: 'previousTournamentId', field: 'previous_tournament_id' },
      onDelete: 'RESTRICT',
    })
  }

  return GameOfTrustTournament
}
