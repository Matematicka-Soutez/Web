'use strict'

module.exports = (sequelize, DataTypes) => {
  const WatterBottlingTeamScore = sequelize.define('WatterBottlingTeamScore', {
    score: { type: DataTypes.DOUBLE, allowNull: false, field: 'score' },
  }, {
    tableName: 'WatterBottlingTeamScores',
    timestamps: true,
  })

  WatterBottlingTeamScore.associate = models => {
    WatterBottlingTeamScore.belongsTo(models.Team, {
      as: 'team',
      foreignKey: { name: 'teamId', field: 'team_id' },
      onDelete: 'RESTRICT',
    })
    WatterBottlingTeamScore.belongsTo(models.Competition, {
      as: 'competition',
      foreignKey: { name: 'competitionId', field: 'competition_id' },
      onDelete: 'RESTRICT',
    })
  }

  return WatterBottlingTeamScore
}
