const appErrors = require('../../../../server/utils/errors/application')
const TransactionalService = require('./../../../../server/services/TransactionalService')
const socket = require('./../../../../server/sockets/publish')
const repository = require('./../repository')

module.exports = class RevertMoveService extends TransactionalService {
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
    const currentPosition = await repository.findTeamPosition(
      this.competitionId,
      this.data.teamId,
      dbTransaction,
    )
    if (!currentPosition.previousPositionId) {
      throw new appErrors.CannotBeDoneError('No previous move.')
    }
    const position = await repository.findTeamPositionById(
      currentPosition.previousPositionId,
      dbTransaction,
    )
    await repository.revertTeamPositionById(
      currentPosition.id,
      this.data.organizerId,
      dbTransaction,
    )
    await socket.publishDisplayChange({
      from: {
        vertical: currentPosition.vertical,
        horizontal: currentPosition.horizontal,
        power: currentPosition.power,
      },
      to: {
        vertical: position.vertical,
        horizontal: position.horizontal,
        power: position.power,
      },
    })
  }
}
