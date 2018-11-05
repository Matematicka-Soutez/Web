/* eslint-disable max-len */
'use strict'

module.exports = (sequelize, DataTypes) => {
  const GameOfTrustTournamentStrategy = sequelize.define('GameOfTrustTournamentStrategy', {
    strategy: { type: DataTypes.INTEGER, allowNull: false, field: 'strategy' },
    teamCount: { type: DataTypes.INTEGER, allowNull: false, field: 'team_count' },
    profitSum: { type: DataTypes.DOUBLE, allowNull: false, field: 'profit_sum' },
    profitMin: { type: DataTypes.DOUBLE, allowNull: false, field: 'profit_min' },
    profitMax: { type: DataTypes.DOUBLE, allowNull: false, field: 'profit_max' },
    profitMedian: { type: DataTypes.DOUBLE, allowNull: false, field: 'profit_median' },
  }, {
    tableName: 'GameOfTrustTournamentStrategies',
    timestamps: true,
  })

  GameOfTrustTournamentStrategy.associate = models => {
    GameOfTrustTournamentStrategy.belongsTo(models.Competition, {
      as: 'competition',
      foreignKey: { name: 'competitionId', field: 'competition_id' },
      onDelete: 'RESTRICT',
    })
    GameOfTrustTournamentStrategy.belongsTo(models.GameOfTrustTournament, {
      as: 'tournament',
      foreignKey: { name: 'tournamentId', field: 'tournament_id' },
      onDelete: 'RESTRICT',
    })
  }

  return GameOfTrustTournamentStrategy
}
