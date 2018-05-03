module.exports = (sequelize, DataTypes) => {
  const TeamScore = sequelize.define('TeamScore', {
    score: { type: DataTypes.INTEGER, allowNull: false, field: 'score' },
  }, {
    tableName: 'TeamScores',
    timestamps: true,
  })

  TeamScore.associate = models => {
    TeamScore.belongsTo(models.Team, {
      as: 'team',
      foreignKey: { name: 'teamId', field: 'team_id' },
      onDelete: 'RESTRICT',
    })
    TeamScore.belongsTo(models.Competition, {
      as: 'competition',
      foreignKey: { name: 'competitionId', field: 'competition_id' },
      onDelete: 'RESTRICT',
    })
  }

  return TeamScore
}
