'use strict'

const repository = require('../repository')
const appErrors = require('../../../../../core/errors/application')
const TransactionalService = require('./../../../../../core/services/TransactionalService')

module.exports = class RevertChangeService extends TransactionalService {
  schema() {
    return {
      type: 'Object',
      properties: {
        teamId: { type: 'integer', required: true, min: 1 },
        organizerId: { type: 'integer', required: true, min: 1 },
      },
    }
  }

  async run() {
    const dbTransaction = await this.createOrGetTransaction()
    const currentStrategy = await repository.getCurrentTeamStrategy(
      this.competition.id,
      this.data.teamId,
      dbTransaction,
    )
    if (currentStrategy.default) {
      throw new appErrors.CannotBeDoneError('Nelze vrátit defaultní strategii.')
    }
    await repository.revertTeamStrategyById(
      currentStrategy.id,
      this.data.organizerId,
      dbTransaction,
    )
  }
}
