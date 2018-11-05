'use strict'

const _ = require('lodash')
const repository = require('../repository')
const gameConfig = require('../../../config.json')
const TransactionalService = require('./../../../../../core/services/TransactionalService')
const venueRepository = require('./../../../../../api/src/repositories/venue')

module.exports = class InitGameService extends TransactionalService {
  schema() {
    return {
      type: 'Object',
      properties: {
        organizerId: { type: 'integer', required: true, min: 1 },
      },
    }
  }

  async run() {
    const dbTransaction = await this.createOrGetTransaction()
    const venues = await venueRepository.findCompetitionVenues(this.competition.id, dbTransaction)
    const teams = _.filter(
      _.flatten(_.map(venues, 'teams')),
      ['arrived', true],
    )
    await repository.clearGameData(this.competition.id, dbTransaction)
    const defaults = generateDefaults(this.competition.id, teams)
    const tournament = await repository.createTournament(defaults.tournament(), dbTransaction)
    await Promise.all([
      repository.createTournamentStrategies(defaults.strategies(tournament.id), dbTransaction),
      repository.createTeamScores(defaults.scores(tournament.id), dbTransaction),
    ])
    return {
      result: 'Initialization successful.',
      teamsEnrolled: teams.length,
    }
  }
}

function generateDefaults(competitionId, teams) {
  return {
    tournament: () => ({
      competitionId,
      number: 0,
      mistakeRate: 0,
      start: new Date().toDateString(),
      end: new Date().toDateString(),
    }),
    scores: tournamentId => teams.map(team => ({
      competitionId,
      tournamentId,
      teamId: team.id,
      score: 0,
    })),
    strategies: tournamentId => [{
      competitionId,
      tournamentId,
      strategy: gameConfig.game.defaultStrategy,
      teamCount: teams.length,
      profitSum: 0,
      profitMin: 0,
      profitMax: 0,
      profitMedian: 0,
    }],
  }
}
