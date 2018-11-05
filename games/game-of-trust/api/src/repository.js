'use strict'

const moment = require('moment')
const _ = require('lodash')
const db = require('../../../../api/src/database')
const appErrors = require('../../../../core/errors/application')
const gameConfig = require('../../config.json')

const PROBLEM_POINT_VALUE = gameConfig.game.problemPointValue

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
  const results = await db.GameOfTrustCurrentTeamScore.findAll({
    where: { competitionId },
    attributes: [
      'teamId',
      'gameScore',
      [db.sequelize.literal(`"game_score" + ("solved_problems" * ${PROBLEM_POINT_VALUE})`), 'totalScore'], // eslint-disable-line max-len
    ],
    include: [{
      attributes: [
        'name',
        'number',
        [db.sequelize.literal(`("solved_problems" * ${PROBLEM_POINT_VALUE})`), 'problemScore'],
        'solvedProblems',
      ],
      model: db.Team,
      as: 'team',
      include: [{
        attributes: ['shortName'],
        model: db.School,
        as: 'school',
      }, {
        attributes: ['id', 'firstName', 'lastName'],
        model: db.TeamMember,
        as: 'members',
      }, {
        attributes: ['roomId'],
        model: db.CompetitionVenueRoom,
        as: 'competitionVenueRoom',
        include: [{
          attributes: ['name'],
          model: db.Room,
          as: 'room',
        }],
      }],
    }],
    order: [[db.sequelize.literal('"totalScore"'), 'DESC']],
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
  let place = 1
  let lastScore = -1
  const parsed = []
  results.forEach(result => {
    const res = parseResult(result)
    if (lastScore !== res.totalScoreRaw) {
      res.place = `${place}.`
      lastScore = res.totalScoreRaw
    }
    parsed.push(res)
    place++
  })
  return parsed
}

function parseResult(result) {
  const parsed = {}
  parsed.teamName = result.team.name
  parsed.teamNumber = result.team.number
  parsed.school = result.team.school.shortName
  parsed.teamMembers = parseTeamMembers(result.team.members)
  parsed.room = result.team.competitionVenueRoom.room.name
  parsed.gameScore = parseScore(result.gameScore)
  parsed.problemScore = result.team.dataValues.problemScore
  parsed.totalScore = parseScore(result.dataValues.totalScore)
  parsed.totalScoreRaw = result.dataValues.totalScore
  return parsed
}

function parseScore(number) {
  const str = number.toFixed(0).replace('.', ',')
  if (str.length > 3) {
    return `${str.substr(0, str.length - 3)} ${str.substr(-3)}`
  }
  return str
}

function parseTeamMembers(members) {
  return members
    .map(member => ({
      id: member.id,
      name: `${member.firstName} ${member.lastName}`,
    }))
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
