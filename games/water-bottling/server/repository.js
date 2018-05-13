const _ = require('lodash')
const db = require('../../../server/database')
const appErrors = require('../../../server/utils/errors/application')

async function getGrid(competitionId, dbTransaction) {
  const query = `
  SELECT
    COUNT(teamId)-1 AS "teamCount",
    SUM(power) AS "combinedPower",
    SUM(waterFlow) AS "waterFlow",
    horizontal,
    vertical
  FROM (
    SELECT
      tp1."team_id" AS teamId,
      0 AS waterFlow,
      tp1."power" AS power,
      tp1."horizontal" AS horizontal,
      tp1."vertical" AS vertical
    FROM public."WatterBottlingTeamPositions" tp1 LEFT JOIN public."WatterBottlingTeamPositions" tp2
    ON (tp1.team_id = tp2.team_id AND tp1."createdAt" < tp2."createdAt")
    WHERE tp1.competition_id = :competitionId AND tp2.id IS NULL
  UNION
    SELECT
      0 AS teamId,
      grid."water_flow" AS waterFlow,
      0 AS power,
      grid."horizontal" AS horizontal,
      grid."vertical" AS vertical
    FROM public."WatterBottlingGrid" grid
  ) AS currentPositions
  GROUP BY "horizontal", "vertical"
  ORDER BY "vertical" DESC, "horizontal" ASC`
  const grid = await db.sequelize.query(query, {
    type: db.sequelize.QueryTypes.SELECT,
    replacements: { competitionId },
    raw: true,
    transaction: dbTransaction,
  })
  return parseGrid(grid)
}

async function getCurrentTeamPositions(competitionId, dbTransaction) {
  const query = `
  SELECT
    currentPositions."teamId"     AS "teamId",
    currentPositions."power"      AS "power",
    grid."water_flow"             AS "waterFlow",
    currentPositions."horizontal" AS "horizontal",
    currentPositions."vertical"   AS "vertical"
  FROM (
        SELECT
          tp1."team_id"    AS "teamId",
          tp1."power"      AS "power",
          tp1."horizontal" AS "horizontal",
          tp1."vertical"   AS "vertical"
        FROM public."WatterBottlingTeamPositions" tp1
          LEFT JOIN public."WatterBottlingTeamPositions" tp2
            ON (tp1.team_id = tp2.team_id AND tp1."createdAt" < tp2."createdAt")
        WHERE tp1.competition_id = :competitionId AND tp2.id IS NULL
      ) AS currentPositions
    INNER JOIN public."WatterBottlingGrid" AS grid
      ON currentPositions."horizontal" = grid."horizontal"
        AND currentPositions."vertical" = grid."vertical"
  ORDER BY
    currentPositions."vertical" DESC,
    currentPositions."horizontal" ASC`
  const positions = await db.sequelize.query(query, {
    type: db.sequelize.QueryTypes.SELECT,
    replacements: { competitionId },
    raw: true,
    transaction: dbTransaction,
  })
  return parseCurrentTemPositions(positions)
}

async function addTeamPosition(position, dbTransaction) {
  const result = await db.WatterBottlingTeamPosition.create(position, {
    returning: true,
    transaction: dbTransaction,
  })
  return parseTeamPosition(result)
}

async function createTeamPositions(positions, dbTransaction) {
  await db.WatterBottlingTeamPosition.bulkCreate(positions, { transaction: dbTransaction })
  return true
}

async function createTeamScores(scores, dbTransaction) {
  await db.WatterBottlingTeamScore.bulkCreate(scores, { transaction: dbTransaction })
  return true
}

async function findTeamPosition(competitionId, teamId, dbTransaction) {
  const position = await db.WatterBottlingTeamPosition.findOne({
    where: { competitionId, teamId },
    order: [['createdAt', 'DESC']],
    transaction: dbTransaction,
  })
  if (!position) {
    throw new appErrors.NotFoundError()
  }
  return parseTeamPosition(position)
}

async function getTeamScore(competitionId, teamId, dbTransaction) {
  if (!competitionId || !teamId) {
    throw new Error('competitionId and teamId are required')
  }
  const score = await db.WatterBottlingTeamScore.sum('score', {
    where: { competitionId, teamId },
    transaction: dbTransaction,
  })
  return score || 0
}

async function createGrid(grid, dbTransaction) {
  await db.WatterBottlingGrid.bulkCreate(grid, { transaction: dbTransaction })
  return true
}

function clearGameData(competitionId, dbTransaction) {
  return Promise.all([
    db.WatterBottlingGrid.destroy({ where: { competitionId }, transaction: dbTransaction }),
    db.WatterBottlingTeamScore.destroy({ where: { competitionId }, transaction: dbTransaction }),
    db.WatterBottlingTeamPosition.destroy({ where: { competitionId }, transaction: dbTransaction }),
  ])
}


/* PRIVATE PARSING METHODS */
function parseGrid(grid) {
  return grid ? _.map(grid, parseField) : []
}

function parseField(field) {
  if (!field) {
    return field
  }
  const parsed = {}
  parsed.horizontal = field.horizontal
  parsed.vertical = field.vertical
  parsed.teamCount = field.teamCount
  parsed.combinedPower = field.combinedPower
  parsed.waterFlow = field.waterFlow
  return parsed
}

function parseTeamPosition(teamPos) {
  if (!teamPos) {
    return teamPos
  }
  const parsed = {}
  parsed.id = teamPos.id
  parsed.horizontal = teamPos.horizontal
  parsed.vertical = teamPos.vertical
  parsed.power = teamPos.power
  parsed.teamId = teamPos.teamId
  parsed.competitionId = teamPos.competitionId
  parsed.organizerId = teamPos.organizerId
  parsed.previousPositionId = teamPos.previousPositionId
  parsed.createdAt = teamPos.createdAt
  parsed.updatedAt = teamPos.updatedAt
  return parsed
}

function parseCurrentTemPositions(positions) {
  const rows = _.groupBy(positions, 'vertical')
  const fields = []
  _.forOwn(rows, (row, vertical) => {
    const rowFields = _.groupBy(row, 'horizontal')
    _.forOwn(rowFields, (fieldContent, horizontal) => {
      const teams = fieldContent.map(team => ({
        id: team.teamId,
        power: team.power,
      }))
      fields.push({
        vertical,
        horizontal,
        waterFlow: fieldContent[0].waterFlow,
        teams,
      })
    })
  })
  return fields
}


module.exports = {
  getGrid,
  createGrid,
  clearGameData,
  findTeamPosition,
  addTeamPosition,
  createTeamPositions,
  createTeamScores,
  getTeamScore,
  getCurrentTeamPositions,
}
