/* eslint-disable max-len */
'use strict'

const moment = require('moment')
const _ = require('lodash')
const db = require('../../../../api/src/database')
const appErrors = require('../../../../core/errors/application')
const gameConfig = require('../../config.json')

async function getTournamentResults(competitionId, dbTransaction) {
  const tournament = await db.GameOfTrustTournament.findOne({
    where: { competitionId },
    include: [{
      model: db.GameOfTrustTournamentStrategy,
      require: true,
      as: 'strategies',
    }],
    order: [['number', 'DESC']],
    transaction: dbTransaction,
  })
  if (!tournament) {
    throw new appErrors.NotFoundError()
  }
  return parseTournament(tournament)
}

async function getResults(competitionId, dbTransaction) {
  const query = `
    SELECT "GameOfTrustCurrentTeamScore"."game_score" AS "gameScore",
       "game_score" + (COALESCE("team"."solved_problems_override", "team->solvedProblemCounts"."solved_problems", 0) * :problemPointValue)
                                                  AS "totalScore",
       "team"."id"                                AS "teamId",
       "team"."name"                              AS "teamName",
       "team"."number"                            AS "teamNumber",
       (COALESCE("team"."solved_problems_override", "team->solvedProblemCounts"."solved_problems", 0) * :problemPointValue)
                                                  AS "problemScore",
       COALESCE("team"."solved_problems_override", "team->solvedProblemCounts"."solved_problems", 0)
                                                  AS "solvedProblems",
       "team->school"."id"                        AS "schoolId",
       "team->school"."short_name"                AS "schoolShortName",
       "team->members"."id"                       AS "teamMemberId",
       "team->members"."first_name" || ' ' || "team->members"."last_name"
                                                  AS "teamMemberName",
       "team->competitionVenueRoom"."id"          AS "competitionVenueRoomId",
       "team->competitionVenueRoom->room"."id"    AS "roomId",
       "team->competitionVenueRoom->room"."name"  AS "roomName"
    FROM "GameOfTrustCurrentTeamScores" AS "GameOfTrustCurrentTeamScore"
           LEFT OUTER JOIN (
        "Teams" AS "team"
            LEFT OUTER JOIN "Schools" AS "team->school" ON "team"."school_id" = "team->school"."id"
            LEFT OUTER JOIN "TeamMembers" AS "team->members" ON "team"."id" = "team->members"."team_id"
            LEFT OUTER JOIN "CompetitionVenueRooms" AS "team->competitionVenueRoom" ON "team"."competition_venue_room_id" =
                                                                                       "team->competitionVenueRoom"."id"
            LEFT OUTER JOIN "Rooms" AS "team->competitionVenueRoom->room" ON "team->competitionVenueRoom"."room_id" =
                                                                             "team->competitionVenueRoom->room"."id"
            LEFT OUTER JOIN "TeamSolvedProblemCounts" AS "team->solvedProblemCounts" ON
          "team"."id" = "team->solvedProblemCounts"."team_id" AND "team->solvedProblemCounts"."competition_id" = :competitionId)
             ON "GameOfTrustCurrentTeamScore"."team_id" = "team"."id"
    WHERE "GameOfTrustCurrentTeamScore"."competition_id" = ${competitionId}
    ORDER BY "totalScore" DESC;`
  const results = await db.sequelize.query(query, {
    type: db.sequelize.QueryTypes.SELECT,
    replacements: {
      competitionId,
      problemPointValue: gameConfig.game.problemPointValue,
    },
    raw: true,
    transaction: dbTransaction,
  })
  return parseResults(results)
}

async function setTeamStrategy(strategy, dbTransaction) {
  const result = await db.GameOfTrustTeamStrategy.create(strategy, {
    returning: true,
    transaction: dbTransaction,
  })
  return parseTeamStrategy(result)
}

async function createTournamentStrategies(strategies, dbTransaction) {
  await db.GameOfTrustTournamentStrategy.bulkCreate(strategies, { transaction: dbTransaction })
  return true
}

async function createTeamScores(scores, dbTransaction) {
  await db.GameOfTrustTeamScore.bulkCreate(scores, { transaction: dbTransaction })
  return true
}

async function createTournament(tournament, dbTransaction) {
  const result = await db.GameOfTrustTournament.create(tournament, {
    returning: true,
    transaction: dbTransaction,
  })
  return parseTournament(result)
}

async function getCurrentTeamStrategy(competitionId, teamId, dbTransaction) {
  const strategyLifespan = gameConfig.game.strategyLifespan
  const strategy = await db.GameOfTrustTeamStrategy.findOne({
    where: {
      competitionId,
      teamId,
      reverted: false,
      createdAt: {
        [db.sequelize.Op.gte]: moment().subtract(strategyLifespan, 'minutes').toDate(),
      },
    },
    order: [['createdAt', 'DESC']],
    transaction: dbTransaction,
  })
  if (!strategy) {
    return {
      default: true,
      strategy: gameConfig.game.defaultStrategy,
      validUntilTournament: gameConfig.game.lastTournamentNumber,
      teamId,
      competitionId,
    }
  }
  return parseTeamStrategy(strategy)
}

async function getCurrentTeamStrategies(competitionId, dbTransaction) {
  const strategies = await db.GameOfTrustCurrentTeamStrategy.findAll({
    where: { competitionId },
    transaction: dbTransaction,
  })
  return parseTeamStrategies(strategies)
}

function revertTeamStrategyById(strategyId, organizerId, dbTransaction) {
  return db.GameOfTrustTeamStrategy.update(
    {
      reverted: true,
      revertedById: organizerId,
    },
    {
      where: {
        id: strategyId,
      },
      transaction: dbTransaction,
    },
  )
}

async function getTeamScore(competitionId, teamId, dbTransaction) {
  if (!competitionId || !teamId) {
    throw new Error('competitionId and teamId are required')
  }
  const score = await db.GameOfTrustTeamScore.sum('score', {
    where: { competitionId, teamId },
    transaction: dbTransaction,
  })
  return score || 0
}

async function clearGameData(competitionId, dbTransaction) {
  await Promise.all([
    db.GameOfTrustTournamentStrategy.destroy({ where: { competitionId }, transaction: dbTransaction }), // eslint-disable-line max-len
    db.GameOfTrustTeamScore.destroy({ where: { competitionId }, transaction: dbTransaction }),
    db.GameOfTrustTeamStrategy.destroy({ where: { competitionId }, transaction: dbTransaction }),
  ])
  await db.GameOfTrustTournament.destroy({ where: { competitionId }, transaction: dbTransaction })
}


/* PRIVATE PARSING METHODS */
function parseTournament(tournament) {
  if (!tournament) {
    return tournament
  }
  const parsed = {}
  parsed.id = tournament.id
  parsed.number = tournament.number
  parsed.mistakeRate = tournament.mistakeRate
  parsed.start = tournament.start
  parsed.end = tournament.end
  parsed.competitionId = tournament.competitionId
  parsed.previousTournamentId = tournament.previousTournamentId
  if (tournament.strategies) {
    parsed.strategies = parseTournamentStrategies(tournament.strategies)
  }
  return parsed
}

function parseTournamentStrategies(strategies) {
  return strategies ? _.map(strategies, parseTournamentStrategy) : []
}

function parseTournamentStrategy(strategy) {
  if (!strategy) {
    return strategy
  }
  const parsed = {}
  parsed.id = strategy.id
  parsed.strategy = strategy.strategy
  parsed.teamCount = strategy.teamCount
  parsed.profitSum = strategy.profitSum
  parsed.profitMin = strategy.profitMin
  parsed.profitMax = strategy.profitMax
  parsed.profitMedian = strategy.profitMedian
  return parsed

}

function parseTeamStrategies(strategies) {
  return strategies ? _.map(strategies, parseTeamStrategy) : []
}

function parseTeamStrategy(teamStrategy) {
  if (!teamStrategy) {
    return teamStrategy
  }
  const parsed = {}
  parsed.id = teamStrategy.id
  parsed.strategy = teamStrategy.strategy
  parsed.validUntilTournament = teamStrategy.validUntilTournament
  parsed.teamId = teamStrategy.teamId
  parsed.teamName = teamStrategy.teamName
  parsed.teamNumber = teamStrategy.teamNumber
  parsed.competitionId = teamStrategy.competitionId
  parsed.organizerId = teamStrategy.organizerId
  parsed.previousStrategyId = teamStrategy.previousStrategyId
  parsed.createdAt = teamStrategy.createdAt
  parsed.updatedAt = teamStrategy.updatedAt
  return parsed
}

function parseResults(results) {
  if (!results) {
    return results
  }
  const parsed = _.orderBy(_.map(
    _.groupBy(results, 'teamId'),
    (members, teamId) => ({
      teamId,
      teamName: members[0].teamName,
      teamNumber: members[0].teamNumber,
      school: members[0].schoolShortName,
      teamMembers: members.map(member => ({
        id: member.teamMemberId,
        name: member.teamMemberName,
      })),
      room: members[0].roomName,
      gameScore: parseScore(members[0].gameScore),
      problemScore: parseScore(members[0].problemScore),
      totalScore: parseScore(members[0].totalScore),
      totalScoreRaw: members[0].totalScore,
    }),
  ), 'totalScoreRaw', 'desc')
  let place = 1
  let lastScore = -1
  parsed.forEach(team => {
    if (lastScore !== team.totalScoreRaw) {
      team.place = `${place}.`
      lastScore = team.totalScoreRaw
    }
    place++
  })
  return parsed
}

function parseScore(number) {
  const str = number.toFixed(0).replace('.', ',')
  if (str.length > 3) {
    return `${str.substr(0, str.length - 3)} ${str.substr(-3)}`
  }
  return str
}


module.exports = {
  getTournamentResults,
  getResults,
  clearGameData,
  getCurrentTeamStrategy,
  getCurrentTeamStrategies,
  revertTeamStrategyById,
  setTeamStrategy,
  createTournamentStrategies,
  createTeamScores,
  createTournament,
  getTeamScore,
}
