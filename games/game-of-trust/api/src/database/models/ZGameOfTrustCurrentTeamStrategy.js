'use strict'

const gameConfig = require('../../../../config')

module.exports = (sequelize, DataTypes) => {
  const GameOfTrustCurrentTeamStrategy = sequelize.define('GameOfTrustCurrentTeamStrategy', {
    strategy: { type: DataTypes.INTEGER, allowNull: false, field: 'strategy' },
    teamId: { type: DataTypes.INTEGER, allowNull: false, field: 'team_id', primaryKey: true },
    teamNumber: { type: DataTypes.INTEGER, allowNull: false, field: 'team_number' },
    teamName: { type: DataTypes.STRING, allowNull: false, field: 'team_name' },
    teamArrived: { type: DataTypes.BOOLEAN, allowNull: false, field: 'team_arrived' },
    // TODO: fix, make competition agnostic
    competitionId: { type: DataTypes.INTEGER, allowNull: true, field: 'competition_id' },
  }, {
    tableName: 'GameOfTrustCurrentTeamStrategies',
    timestamps: false,
  })

  GameOfTrustCurrentTeamStrategy.sync = options => {
    if (options.force) {
      const strategyLifespan = gameConfig.game.strategyLifespan
      const defaultStrategy = gameConfig.game.defaultStrategy
      // TODO: fix, make competition agnostic
      return sequelize.query(`
        CREATE VIEW "GameOfTrustCurrentTeamStrategies" AS
          SELECT
            team."id"                         AS team_id,
            team."number"                     AS team_number,
            team."name"                       AS team_name,
            team."arrived"                    AS team_arrived,
            CASE
              WHEN uniqueStrategy."strategy" IS NOT NULL
              THEN uniqueStrategy."strategy"
              ELSE ${defaultStrategy}
              END                             AS strategy,
            CASE
              WHEN uniqueStrategy."competition_id" IS NOT NULL
              THEN uniqueStrategy."competition_id"
              ELSE 2
              END                             AS competition_id
            
          FROM
            public."Teams" as team
          LEFT JOIN
            (SELECT
              tp1."team_id"         AS team_id,
              tp1."strategy"        AS strategy,
              tp1."competition_id"  AS competition_id
            FROM (SELECT *
                  FROM public."GameOfTrustTeamStrategies"
                  WHERE NOT reverted) as tp1
              LEFT JOIN (SELECT *
                        FROM public."GameOfTrustTeamStrategies"
                        WHERE NOT reverted) as tp2
              ON (
                tp1.team_id = tp2.team_id
                AND tp1.competition_id = tp2.competition_id
                AND tp1."createdAt" < tp2."createdAt"
              )
            WHERE tp2.id IS NULL
              AND tp1."createdAt" > (NOW() - INTERVAL '${strategyLifespan} minutes'))
              as uniqueStrategy
          ON (
            team.id = uniqueStrategy.team_id
          )
          WHERE team."arrived"
          ORDER BY team_number;
        `, { logging: options.logging })
    }
    return true
  }

  GameOfTrustCurrentTeamStrategy.drop = options => {
    if (options.force) {
      return sequelize.query(
        'DROP VIEW IF EXISTS "GameOfTrustCurrentTeamStrategies";',
        { logging: options.logging },
      )
    }
    return true
  }

  GameOfTrustCurrentTeamStrategy.create = () => {
    throw new Error('Can\'t create entries in view "GameOfTrustCurrentTeamStrategies".')
  }

  GameOfTrustCurrentTeamStrategy.update = () => {
    throw new Error('Can\'t update entries in view "GameOfTrustCurrentTeamStrategies".')
  }

  GameOfTrustCurrentTeamStrategy.delete = () => {
    throw new Error('Can\'t delete entries in view "GameOfTrustCurrentTeamStrategies".')
  }

  return GameOfTrustCurrentTeamStrategy
}
