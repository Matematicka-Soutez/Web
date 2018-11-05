'use strict'

module.exports = (sequelize, DataTypes) => {
  const GameOfTrustCurrentTeamScore = sequelize.define('GameOfTrustCurrentTeamScore', {
    // id column is here just to pleasure sequelize
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, field: 'id' },
    gameScore: { type: DataTypes.INTEGER, allowNull: false, field: 'game_score' },
  }, {
    tableName: 'GameOfTrustCurrentTeamScores',
    timestamps: false,
  })

  GameOfTrustCurrentTeamScore.associate = models => {
    GameOfTrustCurrentTeamScore.belongsTo(models.Team, {
      as: 'team',
      foreignKey: { name: 'teamId', field: 'team_id' },
      onDelete: 'RESTRICT',
    })
    GameOfTrustCurrentTeamScore.belongsTo(models.Competition, {
      as: 'competition',
      foreignKey: { name: 'competitionId', field: 'competition_id' },
      onDelete: 'RESTRICT',
    })
  }

  GameOfTrustCurrentTeamScore.sync = options => {
    if (options.force) {
      return sequelize.query(`
        CREATE VIEW "GameOfTrustCurrentTeamScores" AS
          SELECT
            MAX("id")        AS "id",
            "competition_id" AS "competition_id",
            "team_id"        AS "team_id",
            SUM("score")     AS "game_score"
          FROM public."GameOfTrustTeamScores"
          GROUP BY competition_id, team_id;
        `, { logging: options.logging })
    }
    return true
  }

  GameOfTrustCurrentTeamScore.drop = options => {
    if (options.force) {
      return sequelize.query(
        'DROP VIEW IF EXISTS "GameOfTrustCurrentTeamScores";',
        { logging: options.logging },
      )
    }
    return true
  }

  GameOfTrustCurrentTeamScore.create = () => {
    throw new Error('Can\'t create entries in view "GameOfTrustCurrentTeamScores".')
  }

  GameOfTrustCurrentTeamScore.update = () => {
    throw new Error('Can\'t update entries in view "GameOfTrustCurrentTeamScores".')
  }

  GameOfTrustCurrentTeamScore.delete = () => {
    throw new Error('Can\'t delete entries in view "GameOfTrustCurrentTeamScores".')
  }

  return GameOfTrustCurrentTeamScore
}
