'use strict'

module.exports = (sequelize, DataTypes) => {
  const GameOfTrustTeamScore = sequelize.define('GameOfTrustTeamScore', {
    score: { type: DataTypes.DOUBLE, allowNull: false, field: 'score' },
  }, {
    tableName: 'GameOfTrustTeamScores',
    timestamps: true,
  })

  GameOfTrustTeamScore.associate = models => {
    GameOfTrustTeamScore.belongsTo(models.Team, {
      as: 'team',
      foreignKey: { name: 'teamId', field: 'team_id' },
      onDelete: 'RESTRICT',
    })
    GameOfTrustTeamScore.belongsTo(models.Competition, {
      as: 'competition',
      foreignKey: { name: 'competitionId', field: 'competition_id' },
      onDelete: 'RESTRICT',
    })
    GameOfTrustTeamScore.belongsTo(models.GameOfTrustGameRound, {
      as: 'gameRound',
      foreignKey: { name: 'gameRoundId', field: 'game_round_id' },
      onDelete: 'RESTRICT',
    })
  }

  return GameOfTrustTeamScore
}
