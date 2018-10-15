'use strict'

module.exports = (sequelize, DataTypes) => {
  const SolvedProblem = sequelize.define('SolvedProblem', {
    problemNumber: { type: DataTypes.INTEGER, allowNull: false, field: 'problem_number' },
    cancelled: { type: DataTypes.BOOLEAN, allowNull: false, default: false, field: 'cancelled' },
  }, {
    tableName: 'SolvedProblems',
    indexes: [{
      unique: true,
      fields: ['competition_id', 'team_id', 'problem_number'],
    }],
  })

  SolvedProblem.associate = models => {
    SolvedProblem.belongsTo(models.Competition, {
      as: 'competition',
      foreignKey: { name: 'competitionId', field: 'competition_id' },
      onDelete: 'RESTRICT',
    })
    SolvedProblem.belongsTo(models.Team, {
      as: 'team',
      foreignKey: { name: 'teamId', field: 'team_id' },
      onDelete: 'RESTRICT',
    })
    SolvedProblem.belongsTo(models.Organizer, {
      as: 'updatedBy',
      foreignKey: { name: 'lastUpdatedBy', field: 'last_updated_by' },
      onDelete: 'RESTRICT',
    })
  }

  return SolvedProblem
}