'use strict'

const repository = require('../repository')
const utils = require('../utils')
const AbstractService = require('./../../../../../core/services/AbstractService')

module.exports = class GetTournamentResultsService extends AbstractService {
  async run() {
    const tournament = await repository.getTournamentResults(this.competition.id)
    utils.addRemainingTime(tournament, this.competition)
    return tournament
  }
}
