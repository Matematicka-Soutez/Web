'use strict'

module.exports = (sequelize, DataTypes) => {
  const TeamSolvedProblemCount = sequelize.define('TeamSolvedProblemCount', {
    solvedProblems: { type: DataTypes.INTEGER, allowNull: false, field: 'solved_problems' },
    teamId: { type: DataTypes.INTEGER, allowNull: false, field: 'team_id', primaryKey: true },
    competitionId: { type: DataTypes.INTEGER, allowNull: false, field: 'competition_id', primaryKey: true },
  }, {
    tableName: 'TeamSolvedProblemCounts',
    timestamps: false,
  })

  TeamSolvedProblemCount.associate = models => {
    TeamSolvedProblemCount.belongsTo(models.Competition, {
      as: 'competition',
      foreignKey: { name: 'competitionId', field: 'competition_id' },
      onDelete: 'RESTRICT',
    })
    TeamSolvedProblemCount.belongsTo(models.Team, {
      as: 'team',
      foreignKey: { name: 'teamId', field: 'team_id' },
      onDelete: 'RESTRICT',
    })
  }

  TeamSolvedProblemCount.sync = options => {
    if (options.force) {
      return sequelize.query(`
        CREATE VIEW "TeamSolvedProblemCounts" AS
          SELECT
            team_id         AS "team_id",
            competition_id  AS "competition_id",
            count(solved)   AS "solved_problems"
          FROM "TeamSolutions"
          WHERE solved
          GROUP BY team_id, competition_id;
        `, { logging: options.logging })
    }
    return true
  }

  TeamSolvedProblemCount.drop = options => {
    if (options.force) {
      return sequelize.query(
        'DROP VIEW IF EXISTS "TeamSolvedProblemCounts";',
        { logging: options.logging },
      )
    }
    return true
  }

  TeamSolvedProblemCount.create = () => {
    throw new Error('Can\'t create entries in view "TeamSolvedProblemCounts".')
  }

  TeamSolvedProblemCount.update = () => {
    throw new Error('Can\'t update entries in view "TeamSolvedProblemCounts".')
  }

  TeamSolvedProblemCount.delete = () => {
    throw new Error('Can\'t delete entries in view "TeamSolvedProblemCounts".')
  }

  return TeamSolvedProblemCount
}
