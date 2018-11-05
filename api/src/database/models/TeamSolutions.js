'use strict'

module.exports = (sequelize, DataTypes) => {
  const TeamSolution = sequelize.define('TeamSolution', {
    problemNumber: { type: DataTypes.INTEGER, allowNull: false, field: 'problem_number', primaryKey: true },
    teamId: { type: DataTypes.INTEGER, allowNull: false, field: 'team_id', primaryKey: true },
    competitionId: { type: DataTypes.INTEGER, allowNull: false, field: 'competition_id', primaryKey: true },
    solved: { type: DataTypes.BOOLEAN, allowNull: false, default: false, field: 'solved' },
    createdBy: { type: DataTypes.INTEGER, allowNull: false, field: 'created_by' },
  }, {
    tableName: 'TeamSolutions',
    timestamps: false,
  })

  TeamSolution.associate = models => {
    TeamSolution.belongsTo(models.Competition, {
      as: 'competition',
      foreignKey: { name: 'competitionId', field: 'competition_id' },
      onDelete: 'RESTRICT',
    })
    TeamSolution.belongsTo(models.Team, {
      as: 'team',
      foreignKey: { name: 'teamId', field: 'team_id' },
      onDelete: 'RESTRICT',
    })
    TeamSolution.belongsTo(models.Organizer, {
      as: 'author',
      foreignKey: { name: 'createdBy', field: 'created_by' },
      onDelete: 'RESTRICT',
    })
  }

  TeamSolution.sync = options => {
    if (options.force) {
      return sequelize.query(`
        CREATE VIEW "TeamSolutions" AS
          SELECT
            ts1."problem_number"  AS problem_number,
            ts1."team_id"         AS team_id,
            ts1."competition_id"  AS competition_id,
            ts1."solved"          AS solved,
            ts1."created_by"      AS created_by
          FROM public."TeamSolutionChanges" as ts1
            LEFT JOIN public."TeamSolutionChanges" as ts2
            ON (
              ts1.team_id = ts2.team_id
              AND ts1.problem_number = ts2.problem_number
              AND ts1.competition_id = ts2.competition_id
              AND ts1."createdAt" < ts2."createdAt"
            )
          WHERE ts2.id IS NULL;
        `, { logging: options.logging })
    }
    return true
  }

  TeamSolution.drop = options => {
    if (options.force) {
      return sequelize.query(
        'DROP VIEW IF EXISTS "TeamSolutions";',
        { logging: options.logging },
      )
    }
    return true
  }

  TeamSolution.create = () => {
    throw new Error('Can\'t create entries in view "TeamSolutions".')
  }

  TeamSolution.update = () => {
    throw new Error('Can\'t update entries in view "TeamSolutions".')
  }

  TeamSolution.delete = () => {
    throw new Error('Can\'t delete entries in view "TeamSolutions".')
  }

  return TeamSolution
}
