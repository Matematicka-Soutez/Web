'use strict'

module.exports = (sequelize, DataTypes) => {
  const WatterBottlingCurrentTeamPosition = sequelize.define('WatterBottlingCurrentTeamPosition', {
    horizontal: { type: DataTypes.INTEGER, allowNull: false, field: 'horizontal' },
    vertical: { type: DataTypes.INTEGER, allowNull: false, field: 'vertical' },
    power: { type: DataTypes.INTEGER, allowNull: false, field: 'power' },
    waterFlow: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: 'water_flow' },
    teamId: { type: DataTypes.INTEGER, allowNull: false, field: 'team_id' },
    competitionId: { type: DataTypes.INTEGER, allowNull: false, field: 'competition_id' },
  }, {
    tableName: 'WatterBottlingCurrentTeamPositions',
    timestamps: false,
  })

  WatterBottlingCurrentTeamPosition.sync = options => {
    if (options.force) {
      return sequelize.query(`
        CREATE VIEW "WatterBottlingCurrentTeamPositions" AS
          SELECT
            tp1."team_id"         AS team_id,
            0                     AS water_flow,
            tp1."power"           AS power,
            tp1."horizontal"      AS horizontal,
            tp1."vertical"        AS vertical,
            tp1."competition_id"  AS competition_id
          FROM (SELECT *
                FROM public."WatterBottlingTeamPositions"
                WHERE NOT reverted) as tp1
            LEFT JOIN (SELECT *
                      FROM public."WatterBottlingTeamPositions"
                      WHERE NOT reverted) as tp2
            ON (
              tp1.team_id = tp2.team_id
              AND tp1.competition_id = tp2.competition_id
              AND tp1."createdAt" < tp2."createdAt"
            )
          WHERE tp2.id IS NULL;
        `, { logging: options.logging })
    }
    return true
  }

  WatterBottlingCurrentTeamPosition.drop = options => {
    if (options.force) {
      return sequelize.query(
        'DROP VIEW IF EXISTS "WatterBottlingCurrentTeamPositions";',
        { logging: options.logging },
      )
    }
    return true
  }

  WatterBottlingCurrentTeamPosition.create = () => {
    throw new Error('Can\'t create entries in view "WatterBottlingCurrentTeamPositions".')
  }

  WatterBottlingCurrentTeamPosition.update = () => {
    throw new Error('Can\'t update entries in view "WatterBottlingCurrentTeamPositions".')
  }

  WatterBottlingCurrentTeamPosition.delete = () => {
    throw new Error('Can\'t delete entries in view "WatterBottlingCurrentTeamPositions".')
  }

  return WatterBottlingCurrentTeamPosition
}
