'use strict'

Promise = require('bluebird')
const moment = require('moment')
const _ = require('lodash')
const repository = require('../repository')
const utils = require('../utils')
const { simulateRepeatedGame, getMistakeRate } = require('../game/simulation')
const gameConfig = require('../../../config')
const TransactionalService = require('./../../../../../core/services/TransactionalService')

module.exports = class ScoreTeamsService extends TransactionalService {
  schema() {
    return {
      type: 'Object',
      properties: {
        competitionId: { type: 'integer', required: true, min: 1 },
      },
    }
  }

  async run() {
    const dbTransaction = await this.createOrGetTransaction()
    const start = moment()
    const lastRound = await repository.getTournamentResults(this.data.competitionId, dbTransaction)
    const strategies = await repository.getCurrentTeamStrategies(this.data.competitionId, dbTransaction) // eslint-disable-line max-len
    const teams = strategies.map(strategy => ({
      teamId: strategy.teamId,
      strategy: strategy.strategy,
      scores: [],
    }))

    // Run simulation
    const mistakeRate = getMistakeRate(lastRound.number + 1)
    const repetitions = gameConfig.game.repetitions
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) { // eslint-disable-line id-length
        const result = simulateRepeatedGame(teams[i], teams[j], repetitions, mistakeRate)
        teams[i].scores.push({ teamId: teams[j].teamId, score: result.teamAScore })
        teams[j].scores.push({ teamId: teams[i].teamId, score: result.teamBScore })
      }
    }

    const tournament = await repository.createTournament({
      competitionId: this.data.competitionId,
      number: lastRound.number + 1,
      mistakeRate: mistakeRate * 100,
      previousRoundId: lastRound.id,
      start: start.toISOString(),
    }, dbTransaction)
    const teamScores = getTeamScores(teams, tournament.id, this.data.competitionId)
    const tournamentStrategies = getTournamentStrategies(teams, tournament.id, this.data.competitionId) // eslint-disable-line max-len
    await Promise.all([
      repository.createTeamScores(teamScores, dbTransaction),
      repository.createTournamentStrategies(tournamentStrategies, dbTransaction),
    ])
    this.log('info', `${teams.length} TEAMS WERE SCORED`)
    return true
  }
}

function getTeamScores(teams, tournamentId, competitionId) {
  return teams.map(team => ({
    competitionId,
    tournamentId,
    teamId: team.teamId,
    score: _.sumBy(team.scores, 'score'),
  }))
}

function getTournamentStrategies(teams, tournamentId, competitionId) {
  return _.map(_.groupBy(teams, 'strategy'), (strategyTeams, strategy) => {
    const scores = _.map(
      _.map(strategyTeams, 'scores'),
      teamScores => _.sumBy(teamScores, 'score'),
    )
    return {
      competitionId,
      tournamentId,
      strategy,
      teamCount: strategyTeams.length,
      profitSum: _.sum(scores),
      profitMin: _.min(scores),
      profitMax: _.max(scores),
      profitMedian: utils.median(scores),
    }
  })
}
