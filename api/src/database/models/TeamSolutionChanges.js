'use strict'

module.exports = (sequelize, DataTypes) => {
  const TeamSolutionChange = sequelize.define('TeamSolutionChange', {
    problemNumber: { type: DataTypes.INTEGER, allowNull: false, field: 'problem_number' },
    solved: { type: DataTypes.BOOLEAN, allowNull: false, default: false, field: 'solved' },
  }, {
    tableName: 'TeamSolutionChanges',
  })

  TeamSolutionChange.associate = models => {
    TeamSolutionChange.belongsTo(models.Competition, {
      as: 'competition',
      foreignKey: { name: 'competitionId', field: 'competition_id' },
      onDelete: 'RESTRICT',
    })
    TeamSolutionChange.belongsTo(models.Team, {
      as: 'team',
      foreignKey: { name: 'teamId', field: 'team_id' },
      onDelete: 'RESTRICT',
    })
    TeamSolutionChange.belongsTo(models.Organizer, {
      as: 'author',
      foreignKey: { name: 'createdBy', field: 'created_by' },
      onDelete: 'RESTRICT',
    })
  }

  return TeamSolutionChange
}
