const utils = require('../utils')
const repository = require('../repository')
const gameConfig = require('../../../config.json')
const AbstractService = require('./../../../../../core/services/AbstractService')
const teamRepository = require('./../../../../../api/src/repositories/team')

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
      possibleMoves: utils.getPossibleMoves(position),
      grid: gameConfig.game.grid,
    }
  }
}
