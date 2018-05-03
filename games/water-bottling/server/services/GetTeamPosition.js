const AbstractService = require('./../../../../server/services/AbstractService')
const repository = require('./../repository')
const gameEnums = require('./../../enums')

module.exports = class GetTeamPositionService extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {
        teamId: { type: 'integer', required: true, min: 1 },
      },
    }
  }

  async run() {
    const transaction = await this.createOrGetTransaction()
    const currentPosition = repository.findTeamPosition(
      this.competitionId,
      this.data.teamId,
      transaction,
    )
  }
}
