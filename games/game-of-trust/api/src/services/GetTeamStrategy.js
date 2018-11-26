'use strict'

const utils = require('../utils')
const repository = require('../repository')
const AbstractService = require('./../../../../../core/services/AbstractService')
const teamRepository = require('./../../../../../api/src/repositories/team')

module.exports = class GetTeamStrategyService extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {
        teamId: { type: 'integer', required: true, min: 1 },
      },
    }
  }

  async run() {
    const team = await teamRepository.findById(this.data.teamId)
    const strategy = await repository.getCurrentTeamStrategy(this.competition.id, this.data.teamId)
    const score = await repository.getTeamScore(this.competition.id, this.data.teamId)
    return {
      team,
      score,
      strategy,
      possibleChanges: utils.getPossibleChanges(strategy),
    }
  }
}
