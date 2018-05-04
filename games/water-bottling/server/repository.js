const _ = require('lodash')
const db = require('../../../server/database')
const appErrors = require('../../../server/utils/errors/application')

module.exports = {
  getGrid,
  createGrid,
  clearGameData,
  findTeamPosition,
  addTeamPosition,
  createTeamPositions,
  getTeamScore,
}

async function getGrid(competitionId, dbTransaction) {
  const query = `
  SELECT 
    COUNT("teamId") AS teamCount,
    SUM("power") AS combinedPower,
    "horizontal" AS horizontal,
    "vertical" AS vertical,
  FROM
    (SELECT tp1.*
    FROM public."WatterBottlingTeamPositions" tp1 LEFT JOIN public."WatterBottlingTeamPositions" tp2
    ON (tp1.team_id = tp2.team_id AND tp1."createdAt" < tp2."createdAt")
    WHERE tp1.competition_id = :competitionId AND tp2.id IS NULL) AS teamPositions
  ORDER BY "vertical" ASC, "horizontal" ASC
  GROUP BY "horizontal", "vertical"`
  const grid = await db.sequelize.query(query, {
    type: db.sequelize.QueryTypes.SELECT,
    replacements: { competitionId },
    raw: true,
    transaction: dbTransaction,
  })
  console.log(grid)
  return parseGrid(grid)
}

async function addTeamPosition(position, dbTransaction) {
  const result = await db.WatterBottlingTeamPosition.create(position, {
    returning: true,
    transaction: dbTransaction,
  })
  return parseTeamPosition(result)
}

async function createTeamPositions(positions, dbTransaction) {
  const result = await db.WatterBottlingTeamPosition.bulkCreate(positions, {
    transaction: dbTransaction,
  })
  console.log(result)
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

function getTeamScore(competitionId, teamId, dbTransaction) {
  if (!competitionId || !teamId) {
    throw new Error('competitionId and teamId are required')
  }
  return db.WatterBottlingTeamScore.sum({
    where: { competitionId, teamId },
    transaction: dbTransaction,
  })
}

async function createGrid(grid, dbTransaction) {
  const result = await db.WatterBottlingGrid.bulkCreate(grid, { transaction: dbTransaction })
  console.log(result)
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
  return grid
}

function parseTeamPosition(teamPos) {
  if (!teamPos) {
    return teamPos
  }
  const parsed = {}
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
