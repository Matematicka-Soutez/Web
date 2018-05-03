const _ = require('lodash')
const db = require('../../../server/database')
const appErrors = require('../../../server/utils/errors/application')

module.exports = {
  findTeamPositions,
  findTeamPosition,
  addTeamPosition,
}

async function findTeamPositions(competitionId, dbTransaction) {
  const query = `SELECT tp1.*
  FROM public."TeamPositions" tp1 LEFT JOIN public."TeamPositions" tp2
  ON (tp1.team_id = tp2.team_id AND tp1."createdAt" < tp2."createdAt")
  WHERE tp1.competition_id = 1 AND tp2.id IS NULL;`
  const result = await db.sequelize.query(query, {
    type: db.sequelize.QueryTypes.SELECT,
    replacements: { competitionId },
    raw: true,
    transaction: dbTransaction,
  })
  console.log(result)
  return parseTeamPositions(result)
}

async function addTeamPosition(position, dbTransaction) {
  const result = await db.TeamPosition.create(position, {
    returning: true,
    transaction: dbTransaction,
  })
  return parseTeamPosition(result)
}

async function findTeamPosition(competitionId, teamId, dbTransaction) {
  const result = await db.TeamPosition.findOne({
    where: { competitionId, teamId },
    order: [['createdAt', 'DESC']],
    transaction: dbTransaction,
  })
  return parseTeamPosition(result)
}


/* PRIVATE PARSING METHODS */
function parseTeamPositions(positions) {
  return positions ? _.map(positions, parseTeamPosition) : positions
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
