'use strict'

module.exports = (sequelize, DataTypes) => {
  const WatterBottlingCurrentTeamScore = sequelize.define('WatterBottlingCurrentTeamScore', {
    // id column is here just to pleasure sequelize
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, field: 'id' },
    gameScore: { type: DataTypes.INTEGER, allowNull: false, field: 'game_score' },
  }, {
    tableName: 'WatterBottlingCurrentTeamScores',
    timestamps: false,
  })

  WatterBottlingCurrentTeamScore.associate = models => {
    WatterBottlingCurrentTeamScore.belongsTo(models.Team, {
      as: 'team',
      foreignKey: { name: 'teamId', field: 'team_id' },
      onDelete: 'RESTRICT',
    })
    WatterBottlingCurrentTeamScore.belongsTo(models.Competition, {
      as: 'competition',
      foreignKey: { name: 'competitionId', field: 'competition_id' },
      onDelete: 'RESTRICT',
    })
  }

  WatterBottlingCurrentTeamScore.sync = options => {
    if (options.force) {
      return sequelize.query(`
        CREATE VIEW "WatterBottlingCurrentTeamScores" AS
          SELECT
            MAX("id")        AS "id",
            "competition_id" AS "competition_id",
            "team_id"        AS "team_id",
            SUM("score")     AS "game_score"
          FROM public."WatterBottlingTeamScores"
          GROUP BY competition_id, team_id;
        `, { logging: options.logging })
    }
    return true
  }

  WatterBottlingCurrentTeamScore.drop = options => {
    if (options.force) {
      return sequelize.query(
        'DROP VIEW IF EXISTS "WatterBottlingCurrentTeamScores";',
        { logging: options.logging },
      )
    }
    return true
  }

  WatterBottlingCurrentTeamScore.create = () => {
    throw new Error('Can\'t create entries in view "WatterBottlingCurrentTeamScores".')
  }

  WatterBottlingCurrentTeamScore.update = () => {
    throw new Error('Can\'t update entries in view "WatterBottlingCurrentTeamScores".')
  }

  WatterBottlingCurrentTeamScore.delete = () => {
    throw new Error('Can\'t delete entries in view "WatterBottlingCurrentTeamScores".')
  }

  return WatterBottlingCurrentTeamScore
}
