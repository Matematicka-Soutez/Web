const AbstractService = require('./../../../../server/services/AbstractService')
const teamRepository = require('./../../../../server/repositories/team')
const repository = require('./../repository')
const gameEnums = require('./../../enums')
const gameConfig = require('./../../config.json')

const GRID_WIDTH = gameConfig.game.grid.width
const GRID_HEIGHT = gameConfig.game.grid.height

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
    const team = await teamRepository.findById(this.data.teamId)
    const position = await repository.findTeamPosition(this.competitionId, this.data.teamId)
    const score = await repository.getTeamScore(this.competitionId, this.data.teamId)
    return {
      team,
      score,
      horizontal: position.horizontal,
      vertical: position.vertical,
      power: position.power,
      possibleMoves: getPossibleMoves(position),
    }
  }
}

function getPossibleMoves(position) {
  const moves = []
  if (position.horizontal > 1) {
    moves.push(gameEnums.DIRECTIONS.LEFT.id)
  }
  if (position.horizontal < GRID_WIDTH) {
    moves.push(gameEnums.DIRECTIONS.RIGHT.id)
  }
  if (position.vertical > 1) {
    moves.push(gameEnums.DIRECTIONS.DOWN.id)
  }
  if (position.vertical < GRID_HEIGHT) {
    moves.push(gameEnums.DIRECTIONS.UP.id)
  }
  if (position.power < Number.MAX_SAFE_INTEGER) {
    moves.push(gameEnums.DIRECTIONS.ABOVE.id)
  }
  return moves
}
