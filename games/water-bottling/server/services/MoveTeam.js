const appErrors = require('../../../../server/utils/errors/application')
const TransactionalService = require('./../../../../server/services/TransactionalService')
const repository = require('./../repository')
const gameEnums = require('./../../enums')
const gameConfig = require('./../../config.json')

const GRID_WIDTH = gameConfig.game.grid.width
const GRID_HEIGHT = gameConfig.game.grid.height

module.exports = class MoveTeamService extends TransactionalService {
  schema() {
    return {
      type: 'Object',
      properties: {
        teamId: { type: 'integer', required: true, min: 1 },
        directionId: { type: 'integer', required: true, enum: gameEnums.DIRECTIONS.idsAsEnum },
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
    const newPosition = move(this.data.directionId, currentPosition, this.data.organizerId)
    validate(newPosition)
    return repository.addTeamPosition(newPosition, dbTransaction)
  }
}

function move(directionId, curPos, organizerId) {
  const direction = gameEnums.DIRECTIONS.ids[directionId]
  return {
    horizontal: curPos.horizontal + direction.horizontalChange,
    vertical: curPos.vertical + direction.verticalChange,
    power: curPos.power + direction.powerChange,
    teamId: curPos.teamId,
    competitionId: curPos.competitionId,
    previousPositionId: curPos.id,
    organizerId,
  }
}

function validate(newPosition) {
  if (newPosition.horizontal < 1 || newPosition.horizontal > GRID_WIDTH) {
    throw new appErrors.CannotBeDoneError('Team can\'t move outside of the grid.')
  }
  if (newPosition.vertical < 1 || newPosition.vertical > GRID_HEIGHT) {
    throw new appErrors.CannotBeDoneError('Team can\'t move outside of the grid.')
  }
  if (newPosition.power === Number.MAX_SAFE_INTEGER) {
    throw new appErrors.CannotBeDoneError('Team reached power limit.')
  }
}
