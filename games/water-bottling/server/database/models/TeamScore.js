module.exports = (sequelize, DataTypes) => {
  const TeamScore = sequelize.define('TeamScore', {
    score: { type: DataTypes.INTEGER, allowNull: false, field: 'score' },
    createdAt: { type: DataTypes.DATE, field: 'createdAt', defaultValue: sequelize.fn('NOW') },
    updatedAt: { type: DataTypes.DATE, field: 'updatedAt', defaultValue: sequelize.fn('NOW') },
  }, {
    tableName: 'TeamScores',
  })
  TeamScore.associate = models => {
    TeamScore.belongsTo(models.Team, {
      as: 'team',
      foreignKey: { name: 'teamId', field: 'team_id' },
      onDelete: 'RESTRICT',
    })
  }

  return TeamScore
}
