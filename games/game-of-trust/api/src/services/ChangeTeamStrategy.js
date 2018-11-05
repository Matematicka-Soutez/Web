'use strict'

const utils = require('../utils')
const repository = require('../repository')
const gameEnums = require('../../../core/enums')
const TransactionalService = require('./../../../../../core/services/TransactionalService')

module.exports = class ChangeTeamStrategyService extends TransactionalService {
  schema() {
    return {
      type: 'Object',
      properties: {
        teamId: { type: 'integer', required: true, min: 1 },
        strategyId: { type: 'integer', required: true, enum: gameEnums.STRATEGIES.idsAsEnum },
        organizerId: { type: 'integer', required: true, min: 1 },
      },
    }
  }

  async run() {
    const dbTransaction = await this.createOrGetTransaction()
    const tournament = await repository.getTournamentResults(this.competition.id, dbTransaction)
    const currentStrategy = await repository.getCurrentTeamStrategy(
      this.competition.id,
      this.data.teamId,
      dbTransaction,
    )
    const newStrategy = {
      strategy: this.data.strategyId,
      validUntilTournament: tournament.number + 3,
      teamId: this.data.teamId,
      competitionId: this.competition.id,
      previousStrategyId: currentStrategy.id,
      organizerId: this.data.organizerId,
    }
    utils.validateStrategy(newStrategy)
    return repository.setTeamStrategy(newStrategy, dbTransaction)
  }
}
